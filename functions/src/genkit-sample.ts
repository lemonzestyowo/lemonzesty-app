/**
 * Genkit AI sample flows and configurations.
 * This file defines Genkit flows for summarization and story generation
 * using Vertex AI.
 */
import * as genkit from "genkit";

import {firebaseAuth} from "genkit/firebase";
import {vertexAI, TextPart} from "genkit/vertexai";
import * as z from "zod";

genkit.configure({
  plugins: [
    firebaseAuth(),
    vertexAI({
      location: "us-central1",
      model: "gemini-pro",
    }),
  ],
  logLevel: "debug",
  flowStateStore: "firebase",
});

export const summarize = genkit.customFlow(
  {
    name: "summarize",
    inputSchema: z.string(),
    outputSchema: z.string(),
    authPolicy: firebaseAuth.allowAnyAuthedUser(),
  },
  async (
    subject: string,
    auth: z.infer<typeof genkit.AuthPolicy>,
    streamingCallback: genkit.StreamingCallback<TextPart>,
  ) => {
    genkit.context().set("subject", subject);
    const llmResponse = await genkit.generateText(
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

export const storyGen = genkit.defineFlow(
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
    const llmResponse = await genkit.generateText({
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
