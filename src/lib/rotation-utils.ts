/**
 * Rotation Logic Utilities
 * Implements pre-computed rotation sequences for optimal performance
 */

export type RotationStrategy = "round-robin" | "random" | "weighted";

export interface AgentWeight {
  phone: string;
  weight: number;
}

/**
 * Generate Round Robin sequence
 * Example: agents = ["62851234", "62857890", "62855555"]
 * Sequence: ["62851234", "62857890", "62855555", "62851234", "62857890", "62855555", ...]
 */
export function generateRoundRobinSequence(
  agents: string[],
  length = 1000
): string[] {
  if (agents.length === 0) return [];

  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(agents[i % agents.length]);
  }
  return sequence;
}

/**
 * Generate Weighted sequence
 * Example:
 * Agent A (weight: 3) -> appears 3 times
 * Agent B (weight: 2) -> appears 2 times
 * Agent C (weight: 1) -> appears 1 time
 * Sequence: ["A", "A", "A", "B", "B", "C"] repeated
 */
export function generateWeightedSequence(
  agentWeights: AgentWeight[],
  length = 1000
): string[] {
  if (agentWeights.length === 0) return [];

  const baseSequence: string[] = [];

  // Build base sequence based on weights
  agentWeights.forEach(({ phone, weight }) => {
    for (let i = 0; i < weight; i++) {
      baseSequence.push(phone);
    }
  });

  if (baseSequence.length === 0) return [];

  // Shuffle for better distribution
  const shuffled = shuffleArray(baseSequence);

  // Repeat to reach desired length
  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(shuffled[i % shuffled.length]);
  }

  return sequence;
}

/**
 * Generate Random sequence but ensure fair distribution
 */
export function generateRandomSequence(
  agents: string[],
  length = 1000
): string[] {
  if (agents.length === 0) return [];

  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * agents.length);
    sequence.push(agents[randomIndex]);
  }
  return sequence;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Main sequence generation function
 * Determines strategy and generates appropriate sequence
 */
export function generateRotationSequence(
  strategy: RotationStrategy,
  agents: string[],
  agentWeights?: AgentWeight[],
  length = 1000
): string[] {
  switch (strategy) {
    case "round-robin":
      return generateRoundRobinSequence(agents, length);

    case "weighted":
      if (!agentWeights || agentWeights.length === 0) {
        // Fallback to round-robin if no weights provided
        return generateRoundRobinSequence(agents, length);
      }
      return generateWeightedSequence(agentWeights, length);

    case "random":
      return generateRandomSequence(agents, length);

    default:
      return generateRoundRobinSequence(agents, length);
  }
}

/**
 * Calculate sequence statistics for analytics
 */
export function calculateSequenceStats(sequence: string[]): {
  totalRotations: number;
  agentDistribution: Record<string, number>;
  fairnessScore: number;
} {
  const agentDistribution: Record<string, number> = {};

  // Count occurrences
  sequence.forEach((phone) => {
    agentDistribution[phone] = (agentDistribution[phone] || 0) + 1;
  });

  const totalRotations = sequence.length;
  const agentCounts = Object.values(agentDistribution);

  // Calculate fairness score (lower is more fair)
  const average =
    agentCounts.reduce((sum, count) => sum + count, 0) / agentCounts.length;
  const variance =
    agentCounts.reduce((sum, count) => sum + Math.pow(count - average, 2), 0) /
    agentCounts.length;
  const fairnessScore = Math.sqrt(variance) / average; // Coefficient of variation

  return {
    totalRotations,
    agentDistribution,
    fairnessScore: Math.round(fairnessScore * 100) / 100,
  };
}

/**
 * Validate sequence quality
 */
export function validateSequence(
  sequence: string[],
  expectedAgents: string[]
): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (sequence.length === 0) {
    issues.push("Sequence is empty");
  }

  const uniqueAgents = new Set(sequence);
  const missingAgents = expectedAgents.filter(
    (agent) => !uniqueAgents.has(agent)
  );
  const extraAgents = Array.from(uniqueAgents).filter(
    (agent) => !expectedAgents.includes(agent)
  );

  if (missingAgents.length > 0) {
    issues.push(`Missing agents: ${missingAgents.join(", ")}`);
  }

  if (extraAgents.length > 0) {
    issues.push(`Extra agents: ${extraAgents.join(", ")}`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
