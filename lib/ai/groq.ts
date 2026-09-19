import { GoogleGenAI } from '@google/genai';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChatCompletionResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

let cachedGroqModels: string[] | null = null;
let lastGroqModelsFetch = 0;

async function getAvailableGroqModels(apiKey: string): Promise<string[]> {
  const now = Date.now();
  if (cachedGroqModels && now - lastGroqModelsFetch < 300000) {
    return cachedGroqModels;
  }
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey.trim()}` },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = (await res.json()) as { data?: { id: string }[] };
      if (Array.isArray(data.data)) {
        const textModels = data.data
          .map((m) => m.id)
          .filter(
            (id) =>
              !id.includes('whisper') &&
              !id.includes('guard') &&
              !id.includes('prompt') &&
              !id.includes('orpheus')
          );
        const preferred = [
          'openai/gpt-oss-20b',
          'groq/compound-mini',
          'qwen/qwen3.8-27b',
          'openai/gpt-oss-120b',
          'groq/compound',
        ];
        const sorted = [
          ...preferred.filter((m) => textModels.includes(m)),
          ...textModels.filter((m) => !preferred.includes(m)),
        ];
        if (sorted.length > 0) {
          cachedGroqModels = Array.from(new Set(sorted));
          lastGroqModelsFetch = now;
          return cachedGroqModels;
        }
      }
    }
  } catch {
    // Network or timeout, fallback to active supported list
  }
  return ['openai/gpt-oss-20b', 'groq/compound-mini', 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'groq/compound'];
}

export class AIService {
  /**
   * Universal completion wrapper supporting:
   * 1. Groq API (via GROQ_API_KEY with auto-discovered active models)
   * 2. Gemini API (via GEMINI_API_KEY with gemini-2.5-flash / gemini-3.1-flash-lite / gemini-3.8-flash)
   * 3. Structured fallback
   */
  static async complete({
    systemPrompt,
    userPrompt,
    temperature = 0.2,
    jsonMode = false,
  }: {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    jsonMode?: boolean;
  }): Promise<{ content: string; provider: 'groq' | 'gemini' | 'fallback' }> {
    const groqKey = process.env.GROQ_API_KEY;

    // 1. Try Groq API if key is provided and valid
    if (groqKey && groqKey !== 'YOUR_GROQ_API_KEY' && groqKey.trim() !== '') {
      const groqModels = await getAvailableGroqModels(groqKey);

      for (const model of groqModels) {
        try {
          const messages: GroqMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ];

          const payload: Record<string, unknown> = {
            model,
            messages,
            temperature,
          };

          if (jsonMode) {
            payload.response_format = { type: 'json_object' };
          }

          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqKey.trim()}`,
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(4000),
          });

          if (res.ok) {
            const data = (await res.json()) as GroqChatCompletionResponse;
            const text = data.choices[0]?.message?.content || '';
            if (text) {
              return { content: text, provider: 'groq' };
            }
          } else {
            const errText = await res.text();
            // If model decommissioned (400) or not found (404), seamlessly continue to next model
            if (
              res.status === 404 ||
              res.status === 400 ||
              errText.includes('model_not_found') ||
              errText.includes('model_decommissioned')
            ) {
              continue;
            }
            console.warn(`[AIService] Groq API (${model}) non-200:`, res.status, errText);
          }
        } catch {
          // Timeout or fetch error, try next model
        }
      }
    }

    // 2. Try Gemini API if available (gemini-2.5-flash & gemini-3.1-flash-lite prioritized for 503 resilience)
    const gemini = getGeminiClient();
    if (gemini) {
      const geminiModels = [
        'gemini-2.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-3.8-flash',
      ];
      const fullPrompt = `${systemPrompt}\n\nUser Input:\n${userPrompt}${
        jsonMode ? '\n\nOutput strictly valid JSON with no markdown wrapping.' : ''
      }`;

      for (const model of geminiModels) {
        try {
          const response = await gemini.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
              temperature,
              ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
            },
          });

          const text = response.text || '';
          if (text) {
            return { content: text, provider: 'gemini' };
          }
        } catch (geminiErr: any) {
          const errMsg = geminiErr?.message || String(geminiErr);
          // If 503 temporary demand spike or unavailable, try next model in fallback array
          if (errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand')) {
            continue;
          }
          console.warn(`[AIService] Gemini API (${model}) error:`, errMsg);
        }
      }
    }

    // 3. Fallback to structured internal engine
    return { content: '', provider: 'fallback' };
  }
}
