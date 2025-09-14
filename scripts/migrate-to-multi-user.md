# Migration Guide: Single User ke Multi-User

## Overview

Schema Prisma telah diupdate untuk mendukung multiple user. Setiap user sekarang memiliki data mereka sendiri (agents, groups, settings).

## Perubahan Schema

### 1. Agent Model

- ✅ Ditambahkan `userId` field
- ✅ Relasi ke User model
- ✅ Unique constraint: `[userId, phoneNumber]`
- ✅ Cascade delete saat user dihapus

### 2. Group Model

- ✅ Ditambahkan `userId` field
- ✅ Relasi ke User model
- ✅ Unique constraint: `[userId, name]` dan `[userId, slug]`
- ✅ Cascade delete saat user dihapus

### 3. RotationSettings Model

- ✅ Ditambahkan `userId` field
- ✅ Relasi ke User model
- ✅ Unique constraint: `[userId]` (satu settings per user)

### 4. User Model

- ✅ Ditambahkan relasi ke `agents`, `groups`, `rotationSettings`

## Migration Steps

### 1. Backup Database

```bash
# Backup MongoDB collection
mongodump --db your_database_name --collection agents
mongodump --db your_database_name --collection groups
mongodump --db your_database_name --collection rotation_settings
```

### 2. Update Environment Variables

Pastikan `DATABASE_URL` sudah benar di `.env.local`

### 3. Generate Prisma Client

```bash
pnpm prisma generate
```

### 4. Push Schema ke Database

```bash
pnpm prisma db push
```

### 5. Data Migration (Jika ada data existing)

Jika Anda sudah punya data di database, jalankan script migration:

```javascript
// scripts/migrate-existing-data.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function migrateData() {
  // Ambil user pertama sebagai owner default
  const firstUser = await prisma.user.findFirst();

  if (!firstUser) {
    console.log("Tidak ada user ditemukan");
    return;
  }

  console.log(`Migrating data untuk user: ${firstUser.email}`);

  // Update agents
  const agentResult = await prisma.agent.updateMany({
    where: { userId: null },
    data: { userId: firstUser.id },
  });
  console.log(`Updated ${agentResult.count} agents`);

  // Update groups
  const groupResult = await prisma.group.updateMany({
    where: { userId: null },
    data: { userId: firstUser.id },
  });
  console.log(`Updated ${groupResult.count} groups`);

  // Update rotation settings
  const settingsResult = await prisma.rotationSettings.updateMany({
    where: { userId: null },
    data: { userId: firstUser.id },
  });
  console.log(`Updated ${settingsResult.count} rotation settings`);

  console.log("Migration completed!");
}

migrateData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Testing Multi-User Support

### 1. Test User Isolation

```javascript
// Test bahwa user A tidak bisa melihat data user B
const userAAgents = await getUserAgents(); // Hanya agent milik user A
const userBAgents = await getUserAgents(); // Hanya agent milik user B
```

### 2. Test API Endpoints

```bash
# Test GET /api/agents (harus return hanya agent milik user)
curl -H "Cookie: session=..." http://localhost:3000/api/agents

# Test POST /api/agents (harus create agent untuk user yang login)
curl -X POST -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{"name":"Agent Test","phoneNumber":"+6281234567890"}' \
  http://localhost:3000/api/agents
```

## Security Considerations

### 1. Data Isolation

- ✅ Setiap query menggunakan `userId` filter
- ✅ Tidak ada cross-user data access
- ✅ Cascade delete saat user dihapus

### 2. API Security

- ✅ Semua API routes menggunakan `requireAuth()`
- ✅ Data ownership validation di setiap operation
- ✅ Input validation dan sanitization

### 3. Database Constraints

- ✅ Unique constraints per user
- ✅ Foreign key constraints dengan cascade delete
- ✅ Required fields validation

## Rollback Plan

Jika perlu rollback:

1. **Restore Database Backup**
2. **Revert Schema Changes**
3. **Regenerate Prisma Client**
4. **Push Old Schema**

```bash
# Restore backup
mongorestore --db your_database_name agents.bson
mongorestore --db your_database_name groups.bson
mongorestore --db your_database_name rotation_settings.bson

# Revert schema
git checkout HEAD~1 prisma/schema.prisma
pnpm prisma generate
pnpm prisma db push
```

## Monitoring

Setelah migration, monitor:

1. **Database Performance**: Query dengan `userId` filter
2. **Memory Usage**: Multiple user sessions
3. **Error Logs**: Unique constraint violations
4. **User Experience**: Data isolation working correctly
