import { ContextMemoryEntry, RAGQuery, RAGResult, AgentType } from './types.js';

/**
 * Context Memory - Stores and retrieves conversation context
 */
export class ContextMemory {
  private memory: Map<string, ContextMemoryEntry[]> = new Map();
  private maxEntries: number = 1000;
  private embeddings: Map<string, number[]> = new Map();

  /**
   * Store a context entry
   */
  async storeContext(entry: ContextMemoryEntry): Promise<void> {
    if (!this.memory.has(entry.conversationId)) {
      this.memory.set(entry.conversationId, []);
    }

    const entries = this.memory.get(entry.conversationId)!;

    // Keep memory size manageable
    if (entries.length >= this.maxEntries) {
      entries.shift();
    }

    entries.push(entry);

    // Store embedding for similarity search
    const embedding = await this.generateEmbedding(entry.content);
    this.embeddings.set(entry.id, embedding);
  }

  /**
   * Retrieve context by conversation ID
   */
  async retrieveContext(conversationId: string): Promise<ContextMemoryEntry[]> {
    return this.memory.get(conversationId) || [];
  }

  /**
   * Find similar entries using RAG
   */
  async findSimilarEntries(
    query: string,
    conversationId: string,
    topK: number = 5
  ): Promise<ContextMemoryEntry[]> {
    const entries = this.memory.get(conversationId) || [];
    if (entries.length === 0) return [];

    const queryEmbedding = await this.generateEmbedding(query);

    // Calculate similarity scores
    const scored = entries.map((entry) => ({
      entry,
      score: this.cosineSimilarity(
        queryEmbedding,
        this.embeddings.get(entry.id) || []
      ),
    }));

    // Sort by score and return top K
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => ({
        ...item.entry,
        relevanceScore: item.score,
      }));
  }

  /**
   * Filter entries by agent type
   */
  async getEntriesByAgent(
    conversationId: string,
    agentType: AgentType
  ): Promise<ContextMemoryEntry[]> {
    const entries = this.memory.get(conversationId) || [];
    return entries.filter((entry) => entry.agentType === agentType);
  }

  /**
   * Get entries within time window
   */
  async getEntriesByTimeWindow(
    conversationId: string,
    minutes: number
  ): Promise<ContextMemoryEntry[]> {
    const entries = this.memory.get(conversationId) || [];
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);

    return entries.filter((entry) => new Date(entry.timestamp) > cutoffTime);
  }

  /**
   * Generate embedding for text (simulated)
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    // Simulate embedding generation
    // In production, use a real embedding service
    const chars = text.split('').map((c) => c.charCodeAt(0));
    const embedding: number[] = [];

    for (let i = 0; i < 384; i++) {
      let sum = 0;
      for (let j = 0; j < chars.length; j++) {
        sum += Math.sin(chars[j] + i) * Math.cos(j + i);
      }
      embedding.push(sum / chars.length);
    }

    return embedding;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length === 0 || b.length === 0) return 0;

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    return (
      dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB) || 1)
    );
  }

  /**
   * Clear old entries (cleanup)
   */
  async cleanup(daysOld: number = 7): Promise<number> {
    let removed = 0;
    const cutoffTime = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    for (const conversationId of this.memory.keys()) {
      const entries = this.memory.get(conversationId)!;
      const filtered = entries.filter(
        (entry) => new Date(entry.timestamp) > cutoffTime
      );

      removed += entries.length - filtered.length;
      this.memory.set(conversationId, filtered);
    }

    return removed;
  }

  /**
   * Get memory statistics
   */
  getStatistics(): Record<string, unknown> {
    let totalEntries = 0;
    const conversationStats: Record<string, number> = {};

    for (const [conversationId, entries] of this.memory) {
      conversationStats[conversationId] = entries.length;
      totalEntries += entries.length;
    }

    return {
      totalEntries,
      conversations: this.memory.size,
      maxEntries: this.maxEntries,
      conversationStats,
    };
  }
}

/**
 * Retrieval-Augmented Generation (RAG) System
 */
export class RAGSystem {
  private contextMemory: ContextMemory;

  constructor(contextMemory: ContextMemory) {
    this.contextMemory = contextMemory;
  }

  /**
   * Execute RAG query
   */
  async query(ragQuery: RAGQuery): Promise<RAGResult> {
    const { query, conversationId, topK = 5, threshold = 0.3 } = ragQuery;

    // Find relevant context from memory
    const relevantEntries = await this.contextMemory.findSimilarEntries(
      query,
      conversationId,
      topK
    );

    // Filter by threshold
    const filteredResults = relevantEntries
      .filter((entry) => (entry.relevanceScore || 0) >= threshold)
      .map((entry) => ({
        source: entry.agentType,
        content: entry.content,
        similarity: entry.relevanceScore || 0,
        metadata: entry.context,
      }));

    // Build augmented context
    const augmentedContext = this.buildContext(query, filteredResults);

    return {
      query,
      results: filteredResults,
      context: augmentedContext,
    };
  }

  /**
   * Build augmented context from results
   */
  private buildContext(
    query: string,
    results: Array<{ source: string; content: string; similarity: number }>
  ): string {
    if (results.length === 0) {
      return `Query: "${query}"\nNo relevant context found.`;
    }

    let context = `Query: "${query}"\n\nRelevant Context:\n`;

    results.forEach((result, index) => {
      context += `\n${index + 1}. Source: ${result.source} (Similarity: ${(
        result.similarity * 100
      ).toFixed(1)}%)\n`;
      context += `   ${result.content.substring(0, 200)}...\n`;
    });

    return context;
  }

  /**
   * Get augmented response combining RAG context with agent response
   */
  async augmentAgentResponse(
    query: string,
    conversationId: string,
    agentResponse: unknown
  ): Promise<{ augmentedResponse: unknown; context: string }> {
    const ragResult = await this.query({
      query,
      conversationId,
      topK: 3,
    });

    return {
      augmentedResponse: {
        agentResponse,
        ragContext: ragResult.results,
        augmentedContext: ragResult.context,
      },
      context: ragResult.context,
    };
  }
}

// Export singleton instances
export const contextMemory = new ContextMemory();
export const ragSystem = new RAGSystem(contextMemory);
