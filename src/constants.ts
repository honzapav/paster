export const AI_MODELS = {
  openai: {
    model: "gpt-4o-mini",
    maxTokens: 1024,
    temperature: 0.1, // Low temperature for consistent formatting
  },
  anthropic: {
    model: "claude-3-5-haiku-latest",
    maxTokens: 1024,
    temperature: 0.1,
  },
  groq: {
    model: "mixtral-8x7b-32768",
    maxTokens: 1024,
    temperature: 0.1,
  },
  gemini: {
    model: "gemini-1.5-flash-8b",
    maxTokens: 1024,
    temperature: 0.1,
  },
} as const;

export const AI_PROVIDERS = [
  {
    id: "openai" as const,
    name: "OpenAI (gpt-4o-mini)",
    icon: "Stars" as const,
    model: AI_MODELS.openai.model,
  },
  {
    id: "anthropic" as const,
    name: "Anthropic (claude-3.5-haiku)",
    icon: "LightBulb" as const,
    model: AI_MODELS.anthropic.model,
  },
  {
    id: "groq" as const,
    name: "Groq (mixtral-8x7b-32768)",
    icon: "Bolt" as const,
    model: AI_MODELS.groq.model,
  },
  {
    id: "gemini" as const,
    name: "Gemini (gemini-1.5-flash-8b)",
    icon: "Wand" as const,
    model: AI_MODELS.gemini.model,
  },
  {
    id: "local" as const,
    name: "Local Model",
    icon: "Laptop" as const,
  },
] as const;
