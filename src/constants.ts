export const AI_MODELS = {
  openai: {
    model: "gpt-4o-mini", // Latest model optimized for speed and efficiency
    maxTokens: 1024,
    temperature: 0.1, // Low temperature for more consistent formatting
  },
  anthropic: {
    model: "claude-3-5-haiku-latest", // Latest Haiku model - fastest Claude model
    maxTokens: 1024,
    temperature: 0.1,
  },
  groq: {
    model: "mixtral-8x7b-32768", // Groq's fastest model
    maxTokens: 1024,
    temperature: 0.1, // Low temperature for consistent formatting
  },
} as const;

export const AI_PROVIDERS = [
  {
    id: "openai" as const,
    name: "OpenAI (GPT-4)",
    icon: "Stars" as const,
    model: AI_MODELS.openai.model,
  },
  {
    id: "anthropic" as const,
    name: "Anthropic (Claude)",
    icon: "LightBulb" as const,
    model: AI_MODELS.anthropic.model,
  },
  {
    id: "groq" as const,
    name: "Groq (Ultra-fast)",
    icon: "Bolt" as const,
    model: AI_MODELS.groq.model,
  },
  {
    id: "local" as const,
    name: "Local Model",
    icon: "Desktop" as const,
  },
] as const;
