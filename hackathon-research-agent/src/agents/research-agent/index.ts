// ============================================================================
// ArXiv Paper Scout Agent
// A research assistant for hackathon participants to discover papers and get
// project ideas inspired by cutting-edge research.
// ============================================================================

import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { anthropic } from '@ai-sdk/anthropic';
import { groq } from '@ai-sdk/groq';
import { generateText, generateObject, tool, stepCountIs } from 'ai';
import { z } from 'zod';

// ============================================================================
// MAIN AGENT HANDLER
// This is where the agent loop starts - it receives requests that are routed
// to the agent (API, webhook, email, etc)
// ============================================================================

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  try {
    // Get the user's query from the request
    const userQuery = await req.data.text();

    // The core agent loop: LLM + Tools
    const result = await generateText({
      model: anthropic('claude-sonnet-4-5'),
      // Stop after 3 tool use steps (prevents infinite loops)
      stopWhen: stepCountIs(3),
      system: `You are an ArXiv research paper scout for hackathon students. 

Your job:
1. Search ArXiv for papers related to the user's topic
2. Classify each paper as ML-related, AI Agent related, Generative AI related, or not based on the primary category
3. For each paper, include the title, authors, 1-2 sentence abstract summary, category, AND the PDF URL link
4. Suggest several hackathon project ideas inspired by the papers with a short summary, a pitch, and conceptual ideas

If there are no good papers found, try again up to 3 times.

AI-related categories include: cs.LG, cs.AI, cs.CV, cs.CL, cs.NE, stat.ML, eess.IV

IMPORTANT: 
- Keep abstracts to 1-2 sentences max
- ALWAYS include clickable links to papers (use the pdfUrl from the tool results)
- Do NOT include implementation tips or tech stack recommendations
- Do NOT mention time frames or how long projects take

Format your response clearly with paper summaries (including links) and project ideas.`,
      prompt: userQuery || 'Find papers about diffusion models',
      // TOOLS: Functions the agent can call
      tools: {
        searchArxiv: searchArxiv,
      },
    });

    ctx.logger.info(
      'Agent completed with %d tool calls',
      result.toolCalls.length
    );

    // Return the final text response
    return resp.text(result.text);
  } catch (error) {
    ctx.logger.error('Error running agent:', error);
    return resp.text('Sorry, there was an error processing your request.');
  }
}

// ============================================================================
// TOOL: searchArxiv
// Searches ArXiv API and parses results using a fast LLM (Groq)
// ============================================================================

const searchArxiv = tool({
  // Tool description - tells the LLM what this tool does
  description: 'Search ARXIV',
  // Input schema - defines what parameters the tool accepts (using Zod)
  inputSchema: z.object({
    query: z.string().describe('The query to use to search'),
    maxResults: z
      .number()
      .optional()
      .default(5)
      .describe('Maximum number of papers to return (default 5)'),
  }),
  execute: async ({ query, maxResults }) => {
    const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
      query
    )}&max_results=${maxResults || 5}&sortBy=relevance`;
    const response = await fetch(url);
    const xmlText = await response.text();

    // Define the structure we want to extract from each paper
    const ArxivPaperSchema = z.object({
      title: z.string(),
      authors: z.array(z.string()),
      abstract: z.string(),
      primaryCategory: z.string(),
      pdfUrl: z.string(),
      arxivId: z.string(),
    });

    const ArxivResultsSchema = z.object({
      papers: z.array(ArxivPaperSchema),
    });

    // Use Groq (fast!) to parse the XML into structured data
    const result = await generateObject({
      model: groq('openai/gpt-oss-20b'), // Fast, cheap model for parsing
      schema: ArxivResultsSchema,
      system:
        'You are a fast XML parser. Extract paper information from ArXiv XML response.',
      prompt: `Parse this ArXiv XML and extract all papers:\n\n${xmlText}`,
      temperature: 0.0, // Deterministic parsing
    });

    return result.object.papers;
  },
});

// ============================================================================
// WELCOME MESSAGE
// Defines the welcome message and example prompts shown in the Agentuity UI
// ============================================================================

export const welcome = () => {
  return {
    welcome:
      'ArXiv Paper Scout - Find research papers and get hackathon project ideas! 🚀',
    prompts: [
      {
        data: 'Find papers about AI agents and suggest hackathon projects',
        contentType: 'text/plain',
      },
      {
        data: 'Search for diffusion models research and classify which are ML-focused',
        contentType: 'text/plain',
      },
      {
        data: 'What are the latest papers on reinforcement learning?',
        contentType: 'text/plain',
      },
    ],
  };
};
