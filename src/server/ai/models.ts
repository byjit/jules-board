import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// ------------------------------- Models ----------------------------------

export type ModelProviders = "google" | "openrouter";

export const getModels = ({ provider }: { provider: ModelProviders }) => {
  const modelMapping: Record<
    ModelProviders,
    () => ReturnType<typeof createGoogleGenerativeAI> | ReturnType<typeof createOpenRouter>
  > = {
    google: () => createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY }),
    openrouter: () => createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY }),
  };

  const creator = modelMapping[provider];
  if (!creator) {
    throw new Error(`Unsupported model provider: ${provider}`);
  }

  const modelCreator = creator();

  return modelCreator;
};
