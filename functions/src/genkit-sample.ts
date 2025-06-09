/**
 * Genkit AI sample flows and configurations.
 * This file defines Genkit flows for summarization and story generation
 * using Vertex AI.
 */
import {
  configure, // Directly import configure (function)
  defineFlow, // Directly import defineFlow (function)
  customFlow, // Directly import customFlow (function)
  generateText, // Directly import generateText (function)
  context, // Directly import context (function/object)
  genkit, // genkit itself might be an object/namespace with plugins
  AuthPolicy, // Directly import AuthPolicy (type/enum)
  StreamingCallback, // Directly import StreamingCallback (type)
} from "genkit"; // Import core functions and types from the main "genkit" package

import {firebaseAuth} from "genkit/firebase"; // Correct sub-package import for firebaseAuth
import {vertexAI, TextPart} from "genkit/vertexai"; // Correct sub-package import for vertexAI and TextPart

import * as z from "zod";

configure({ // Use configure function directly
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

export const summarize = customFlow( // Use customFlow function directly
  {
    name: "summarize",
    inputSchema: z.string(),
    outputSchema: z.string(),
    authPolicy: firebaseAuth.allowAnyAuthedUser(),
  },
  async (
    subject: string,
    auth: z.infer<typeof AuthPolicy>,
    streamingCallback: StreamingCallback<TextPart>,
  ) => {
    context().set("subject", subject); // Use context function directly
    const llmResponse = await generateText( // Use generateText function directly
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

export const storyGen = defineFlow( // Use defineFlow function directly
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
    const llmResponse = await generateText({ // Use generateText function directly
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
