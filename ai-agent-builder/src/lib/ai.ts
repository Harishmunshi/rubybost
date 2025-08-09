export const ensureOpenAIEnv = (): string => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Set it in your environment (e.g., .env.local)."
    );
  }
  return apiKey;
};

import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
  if (cachedClient) return cachedClient;
  const apiKey = ensureOpenAIEnv();
  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
};