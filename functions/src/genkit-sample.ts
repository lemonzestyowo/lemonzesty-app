/**
 * Genkit AI sample flows and configurations.
 * This file defines Genkit flows for summarization and story generation
 * using Vertex AI.
 */
import {
  configureGenkit, // Imported directly
  defineFlow, // Imported directly
  customFlow, // Imported directly
  generateText, // Imported directly
  genkit, // Imported directly
  StreamingCallback, // Imported directly
} from "@genkit-ai/core"; // Reverted to older @genkit-ai/core import

import {firebaseAuth, firebase} from "@genkit-ai/firebase"; // Reverted to older @genkit-ai/firebase import
import {
  vertexAI,
  TextPart,
} from "@genkit-ai/vertexai"; // Reverted to older @genkit-ai/vertexai import
import * as z from "zod";

configureGenkit({ // Use configureGenkit (older name)
  plugins: [
    firebaseAuth(),
    firebase(), // 'firebase' plugin might be expected with older versions
    vertexAI({
      location: "us-central1",
      model: "gemini-pro",
    }),
  ],
  logLevel: "debug",
  flowStateStore: "firebase",
});

export const summarize = customFlow( // Use customFlow directly
  {
    name: "summarize",
    inputSchema: z.string(),
    outputSchema: z.string(),
    authPolicy: firebaseAuth.allowAnyAuthedUser(),
  },
  async (
    subject: string,
    auth: z.infer<typeof firebaseAuth.AuthPolicy>,
    streamingCallback: StreamingCallback<TextPart>,
  ) => {
    genkit.context().set("subject", subject); // Use genkit.context()
    const llmResponse = await generateText( // Use generateText directly
      {
        model: "vertexAI/gemini-pro",
        prompt: `You are a summarization bot. Summarize the following in
          one sentence: ${subject}`,
        config: {
          temperature: 0.1,
        },
      },
      streamingCallback,
    );

    const summary = llmResponse.text();
    return summary;
  },
);

export const storyGen = defineFlow( // Use defineFlow directly
  {
    name: "storyGen",
    inputSchema: z.object({
      topic: z.string(),
      length: z.number().describe("Number of words"),
    }),
    outputSchema: z.string(),
    authPolicy: firebaseAuth.allowAnyAuthedUser(),
  },
  async ({topic, length}: {topic: string; length: number}) => {
    const prompt = `Write a ${length} word story about ${topic}.`;
    const llmResponse = await generateText({
      model: "vertexAI/gemini-pro",
      prompt: prompt,
      config: {
        temperature: 1,
      },
    });

    const story = llmResponse.text();
    return story;
  },
);
