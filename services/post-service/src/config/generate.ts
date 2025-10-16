import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as dotenv from 'dotenv';

dotenv.config();

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

const contentPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a skilled Social Media Manager and copywriter. Your task is to generate a detailed, engaging post body (main content) for the given platform, topic, and tone. The content should be highly shareable and provide clear value to the target audience.",
  ],
  [
    "human",
    "Topic: {topic}\nTone: {tone}",
  ],
]);

export const contentChain = contentPrompt.pipe(llm).pipe(new StringOutputParser());

const captionPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a professional digital marketer. Generate a concise, punchy caption and exactly 3 relevant hashtags (#hashtags) for the given topic and platform. Output only the caption and hashtags.",
  ],
  [
    "human",
    "Topic: {topic}",
  ],
]);
export const captionChain = captionPrompt.pipe(llm).pipe(new StringOutputParser());