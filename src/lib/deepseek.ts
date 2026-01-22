// DeepSeek API client with streaming support

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekConfig {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface DeepSeekResponse {
  id: string;
  choices: Array<{
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const DEFAULT_CONFIG: DeepSeekConfig = {
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 1000,
  stream: true,
};

/**
 * Create a chat completion with DeepSeek API (non-streaming)
 */
export async function createChatCompletion(
  messages: ChatMessage[],
  config: DeepSeekConfig = {}
): Promise<DeepSeekResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is not set');
  }

  const mergedConfig = { ...DEFAULT_CONFIG, ...config, stream: false };

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: mergedConfig.model,
      messages,
      temperature: mergedConfig.temperature,
      max_tokens: mergedConfig.max_tokens,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Create a streaming chat completion with DeepSeek API
 * Returns a ReadableStream that emits chunks of the response
 */
export async function createStreamingChatCompletion(
  messages: ChatMessage[],
  config: DeepSeekConfig = {}
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is not set');
  }

  const mergedConfig = { ...DEFAULT_CONFIG, ...config, stream: true };

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: mergedConfig.model,
      messages,
      temperature: mergedConfig.temperature,
      max_tokens: mergedConfig.max_tokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  if (!response.body) {
    throw new Error('No response body received from DeepSeek API');
  }

  return response.body;
}

/**
 * Transform a DeepSeek SSE stream into a readable stream of text chunks
 */
export function transformStreamToText(
  stream: ReadableStream<Uint8Array>
): ReadableStream<string> {
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream({
    async start(controller) {
      const reader = stream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed || trimmed === 'data: [DONE]') {
              continue;
            }

            if (trimmed.startsWith('data: ')) {
              try {
                const json = JSON.parse(trimmed.slice(6));
                const content = json.choices?.[0]?.delta?.content;

                if (content) {
                  controller.enqueue(content);
                }
              } catch {
                // Skip malformed JSON
                continue;
              }
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Create a streaming response that can be returned directly from a Next.js API route
 */
export async function createStreamingResponse(
  messages: ChatMessage[],
  config: DeepSeekConfig = {}
): Promise<Response> {
  const stream = await createStreamingChatCompletion(messages, config);
  const textStream = transformStreamToText(stream);

  // Convert the text stream to a byte stream for the response
  const encoder = new TextEncoder();
  const responseStream = new ReadableStream({
    async start(controller) {
      const reader = textStream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            break;
          }

          controller.enqueue(encoder.encode(value));
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
