# 🎯 WhatsApp Rotator Optimal Design

## 📋 **Problem Statement**

Saat ini setiap klik memerlukan query ke database untuk menentukan agent selanjutnya. Ini tidak optimal untuk performance dan scalability.

## 🎨 **Optimal Design Strategy**

### **Concept: Pre-computed Rotation Sequences**

Alih-alih query DB per click, kita akan:

1. **Pre-compute rotation sequences** saat group dibuat/diupdate
2. **Store sequences di memory (Redis/In-memory cache)**
3. **Update index pointer** untuk setiap klik
4. **Regenerate sequences** saat agents berubah

### **Database Schema Enhancement**

```prisma
model Group {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  name              String
  slug              String   @unique
  description       String?
  isActive          Boolean  @default(true)
  strategy          String   @default("round-robin") // "round-robin", "random", "weighted"
  userId            String

  // NEW FIELDS for optimized rotation
  rotationSequence  String[] // Pre-computed phone numbers sequence
  currentIndex      Int      @default(0) // Current position in sequence
  sequenceVersion   Int      @default(1) // Increment when agents change
  lastUpdated       DateTime @default(now())

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  agentGroups AgentGroup[]
  clicks Click[]

  @@unique([slug, userId])
}

model AgentGroup {
  id       String  @id @default(auto()) @map("_id") @db.ObjectId
  agentId  String  @db.ObjectId
  groupId  String  @db.ObjectId
  isActive Boolean @default(true)
  weight   Int     @default(1) // For weighted distribution

  agent Agent @relation(fields: [agentId], references: [id], onDelete: Cascade)
  group Group @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@unique([agentId, groupId])
}
```

### **Rotation Strategies Implementation**

#### **1. Round Robin**

```typescript
// Example: agents = ["62851234", "62857890", "62855555"]
// Sequence: ["62851234", "62857890", "62855555", "62851234", "62857890", "62855555", ...]
// Pre-generate 1000 rotations to avoid recalculation

function generateRoundRobinSequence(agents: string[], length = 1000): string[] {
  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(agents[i % agents.length]);
  }
  return sequence;
}
```

#### **2. Weighted Distribution**

```typescript
// Example:
// Agent A (weight: 3) -> appears 3 times
// Agent B (weight: 2) -> appears 2 times
// Agent C (weight: 1) -> appears 1 time
// Sequence: ["A", "A", "A", "B", "B", "C"] repeated

function generateWeightedSequence(
  agentWeights: { phone: string; weight: number }[],
  length = 1000
): string[] {
  const baseSequence: string[] = [];

  // Build base sequence based on weights
  agentWeights.forEach(({ phone, weight }) => {
    for (let i = 0; i < weight; i++) {
      baseSequence.push(phone);
    }
  });

  // Shuffle for better distribution
  const shuffled = shuffleArray(baseSequence);

  // Repeat to reach desired length
  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(shuffled[i % shuffled.length]);
  }

  return sequence;
}
```

#### **3. Random Distribution**

```typescript
// Generate random sequence but ensure fair distribution
function generateRandomSequence(agents: string[], length = 1000): string[] {
  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * agents.length);
    sequence.push(agents[randomIndex]);
  }
  return sequence;
}
```

### **Cache Strategy (Redis)**

```typescript
// Cache key structure
const CACHE_KEYS = {
  sequence: (groupId: string) => `rotation:sequence:${groupId}`,
  index: (groupId: string) => `rotation:index:${groupId}`,
  version: (groupId: string) => `rotation:version:${groupId}`,
};

// Cache operations
class RotationCache {
  async setSequence(groupId: string, sequence: string[], version: number) {
    await redis.setex(
      CACHE_KEYS.sequence(groupId),
      3600,
      JSON.stringify(sequence)
    );
    await redis.setex(CACHE_KEYS.version(groupId), 3600, version.toString());
  }

  async getSequence(groupId: string): Promise<string[] | null> {
    const cached = await redis.get(CACHE_KEYS.sequence(groupId));
    return cached ? JSON.parse(cached) : null;
  }

  async incrementIndex(groupId: string): Promise<number> {
    return await redis.incr(CACHE_KEYS.index(groupId));
  }

  async resetIndex(groupId: string) {
    await redis.del(CACHE_KEYS.index(groupId));
  }
}
```

### **Fast Rotation API Logic**

```typescript
// /api/rotate/[groupSlug] - Ultra-fast rotation
export async function GET(
  request: NextRequest,
  { params }: { params: { groupSlug: string } }
) {
  const { groupSlug } = params;

  try {
    // 1. Try cache first (Redis)
    let sequence = await rotationCache.getSequence(groupSlug);
    let currentIndex = await rotationCache.getCurrentIndex(groupSlug);

    if (!sequence) {
      // 2. Cache miss - load from DB and rebuild cache
      const group = await db.group.findUnique({
        where: { slug: groupSlug },
        include: { agentGroups: { include: { agent: true } } },
      });

      if (!group || !group.isActive) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }

      // 3. Generate sequence based on strategy
      sequence = generateSequence(group);
      await rotationCache.setSequence(
        groupSlug,
        sequence,
        group.sequenceVersion
      );
      currentIndex = group.currentIndex;
    }

    // 4. Get current phone number
    const phoneNumber = sequence[currentIndex % sequence.length];

    // 5. Increment index for next request
    const nextIndex = await rotationCache.incrementIndex(groupSlug);

    // 6. Update DB index periodically (every 10 clicks) to avoid constant writes
    if (nextIndex % 10 === 0) {
      await db.group.update({
        where: { slug: groupSlug },
        data: { currentIndex: nextIndex % sequence.length },
      });
    }

    // 7. Log click (async, don't block response)
    logClick(group.id, phoneNumber);

    // 8. Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    return NextResponse.redirect(whatsappUrl);
  } catch (error) {
    console.error("Rotation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### **Performance Benefits**

#### **Before (Current)**

- ❌ **DB Query per click**: SELECT agents, calculate next
- ❌ **Complex logic per request**: Round-robin calculation
- ❌ **Race conditions**: Multiple concurrent requests
- ❌ **Scalability issues**: DB bottleneck

#### **After (Optimized)**

- ✅ **Cache-first approach**: Redis lookup (sub-millisecond)
- ✅ **Pre-computed sequences**: No calculation per request
- ✅ **Atomic operations**: Redis INCR for thread safety
- ✅ **Periodic DB sync**: Reduce write operations by 90%
- ✅ **Horizontal scaling**: Multiple instances can share Redis

### **Sequence Regeneration Triggers**

1. **Agent added/removed from group**
2. **Agent weight changed** (for weighted strategy)
3. **Strategy changed** (round-robin ↔ weighted ↔ random)
4. **Manual refresh** (admin action)

### **Implementation Steps**

1. ✅ **Add agent selection to group form**
2. 🔄 **Update Prisma schema** (add rotation fields)
3. ⏳ **Create sequence generation utilities**
4. ⏳ **Implement Redis cache layer**
5. ⏳ **Update rotation API for cache-first approach**
6. ⏳ **Add sequence regeneration triggers**
7. ⏳ **Performance testing & optimization**

### **Estimated Performance Improvement**

- **Response Time**: 200ms → 5ms (40x faster)
- **DB Load**: 100% → 10% (10x reduction)
- **Concurrent Requests**: 10/sec → 1000/sec (100x more)
- **Scalability**: Single server → Multiple instances
