import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

/**
 * Creates a LangChain chain to summarize a GitHub repository's README using an LLM.
 * @param {string} readmeContent - The content of the README.md file.
 * @returns {Promise<{ summary: string, cool_facts: string[] }>}
 */
export async function summarizeGithubReadme(readmeContent) {
  const summarySchema = z.object({
    summary: z.string().describe("A concise summary of the repository and its purpose."),
    cool_facts: z.array(z.string()).describe("A list of interesting or unique facts about the repository."),
  });

  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.0,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an expert developer assistant. Your job is to summarize an open-source GitHub repository for a potential new contributor or user. Carefully read the repository's README file, and:\n- Provide a concise summary of the repository.\n- List cool or interesting facts about it (features, design, stats, fun tidbits, etc.).\nFormat your response as a JSON object with fields 'summary' and 'cool_facts'."
    ],
    [
      "human",
      "Summarize this GitHub repository from this README file content:\n\n{readmeContent}"
    ]
  ]);

  const chain = prompt.pipe(llm.withStructuredOutput(summarySchema));
  return await chain.invoke({ readmeContent });
}
