import { Injectable, Logger } from '@nestjs/common';
import { KNOWLEDGE_BASE, KnowledgeItem } from './knowledge-base';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable()
export class RagBotService {
  private readonly logger = new Logger(RagBotService.name);

  async answerQuestion(query: string, history: ChatMessage[] = []) {
    const trimmed = query.trim().toLowerCase();

    // 1. Retrieve most relevant knowledge items via weighted keyword matching & token overlap
    const scoredItems = KNOWLEDGE_BASE.map((item) => {
      let score = 0;
      const queryTokens = trimmed.split(/\s+/);

      // Check title match
      if (item.title.toLowerCase().includes(trimmed)) score += 10;

      // Check keywords
      for (const kw of item.keywords) {
        if (trimmed.includes(kw.toLowerCase())) score += 6;
      }

      // Check content token overlaps
      for (const token of queryTokens) {
        if (token.length > 2) {
          if (item.content.toLowerCase().includes(token)) score += 2;
          if (item.title.toLowerCase().includes(token)) score += 4;
        }
      }

      return { item, score };
    });

    scoredItems.sort((a, b) => b.score - a.score);
    const topMatches = scoredItems.filter((s) => s.score > 0).slice(0, 3);
    const contextItems = topMatches.length > 0 ? topMatches.map((m) => m.item) : [KNOWLEDGE_BASE[0]];

    const contextText = contextItems
      .map((k) => `### ${k.title}\n${k.content}`)
      .join('\n\n');

    const suggested = Array.from(
      new Set(contextItems.flatMap((k) => k.suggestedQuestions || [])),
    ).slice(0, 3);

    // 2. Try Gemini API if key is present
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const reply = await this.callGeminiApi(query, contextText, history, geminiKey);
        if (reply) {
          return {
            reply,
            sources: contextItems.map((c) => ({ title: c.title, id: c.id })),
            suggestedQuestions: suggested,
          };
        }
      } catch (err: any) {
        this.logger.warn(`Gemini API error, falling back to local synthesizer: ${err?.message}`);
      }
    }

    // 3. Built-in contextual synthesizer (Works 100% offline / without external keys)
    const synthesizedReply = this.synthesizeLocalReply(query, contextItems);

    return {
      reply: synthesizedReply,
      sources: contextItems.map((c) => ({ title: c.title, id: c.id })),
      suggestedQuestions: suggested,
    };
  }

  private async callGeminiApi(
    query: string,
    context: string,
    history: ChatMessage[],
    apiKey: string,
  ): Promise<string | null> {
    const systemInstruction = `You are the Goodwill Motive AI Assistant. You are friendly, helpful, encouraging, and passionate about humanitarian impact through social learning.
Use the following verified platform knowledge to answer the user accurately:
---
${context}
---
Rules:
1. Always be concise, clear, and inspiring.
2. If asked about scoring, donations, or missions, provide the exact numbers from the knowledge base.
3. Use markdown with bullet points and bold text for readability.`;

    const contents = [
      ...history.slice(-4).map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: query }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          },
        }),
      },
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  private synthesizeLocalReply(query: string, items: KnowledgeItem[]): string {
    const primary = items[0];
    const greeting = query.toLowerCase().includes('hi') || query.toLowerCase().includes('hello')
      ? 'Hello there! 🌱 Welcome to Goodwill Motive Assistant.\n\n'
      : '';

    return `${greeting}Here is what you need to know about **${primary.title}**:\n\n${primary.content}\n\n💡 *Tip: Feel free to click any of the suggested questions below to learn more!*`;
  }

  getSuggestedPrompts() {
    return [
      'How does learning turn into real food and aid?',
      'How do I earn Contribution Score (XP)?',
      'How do daily streaks and multipliers work?',
      'How can I sponsor meals directly with Razorpay?',
    ];
  }
}
