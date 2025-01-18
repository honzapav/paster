import { getPreferenceValues, showHUD, Clipboard } from "@raycast/api";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { Groq } from "groq-sdk";
import TurndownService from "turndown";
import { htmlToText } from "html-to-text";
import { prompts } from "./prompts";
import { AI_MODELS } from "./constants";
import { execSync } from "child_process";

interface Preferences {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  groqApiKey?: string;
  preferredAiProvider: "openai" | "anthropic" | "groq";
}

const formatWithAI = async (text: string, promptType: keyof typeof prompts): Promise<string> => {
  const preferences = getPreferenceValues<Preferences>();

  // If no AI is configured, return early
  if (
    !(
      (preferences.preferredAiProvider === "openai" && preferences.openaiApiKey) ||
      (preferences.preferredAiProvider === "anthropic" && preferences.anthropicApiKey) ||
      (preferences.preferredAiProvider === "groq" && preferences.groqApiKey)
    )
  ) {
    return text;
  }

  await showHUD("Processing with AI...");
  try {
    if (preferences.preferredAiProvider === "openai" && preferences.openaiApiKey) {
      const openai = getAiClient() as OpenAI;
      const response = await openai.chat.completions.create({
        model: AI_MODELS.openai.model,
        max_tokens: AI_MODELS.openai.maxTokens,
        temperature: AI_MODELS.openai.temperature,
        messages: [
          ...(prompts[promptType].system
            ? [
                {
                  role: "system" as const,
                  content: prompts[promptType].system,
                },
              ]
            : []),
          {
            role: "user" as const,
            content: prompts[promptType].user.replace("{text}", text),
          },
        ],
      });
      return response.choices[0]?.message?.content || text;
    } else if (preferences.preferredAiProvider === "anthropic" && preferences.anthropicApiKey) {
      const anthropic = getAiClient() as Anthropic;
      const response = await anthropic.messages.create({
        model: AI_MODELS.anthropic.model,
        max_tokens: AI_MODELS.anthropic.maxTokens,
        temperature: AI_MODELS.anthropic.temperature,
        messages: [
          {
            role: "user",
            content: prompts[promptType].user.replace("{text}", text),
          },
        ],
      });
      return response.content[0]?.text || text;
    } else if (preferences.preferredAiProvider === "groq" && preferences.groqApiKey) {
      const groq = getAiClient() as Groq;
      const response = await groq.chat.completions.create({
        model: AI_MODELS.groq.model,
        max_tokens: AI_MODELS.groq.maxTokens,
        temperature: AI_MODELS.groq.temperature,
        messages: [
          ...(prompts[promptType].system
            ? [
                {
                  role: "system" as const,
                  content: prompts[promptType].system,
                },
              ]
            : []),
          {
            role: "user" as const,
            content: prompts[promptType].user.replace("{text}", text),
          },
        ],
      });
      return response.choices[0]?.message?.content || text;
    }
  } catch (error) {
    console.error("AI formatting failed:", error);
    throw error;
  }

  return text;
};

export const cleanText = (text: string): string => {
  // Remove extra whitespace and normalize line endings
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Normalize multiple line breaks
    .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""); // Trim whitespace
};

export const convertToMarkdown = async (text: string): Promise<string> => {
  // First clean and convert to basic markdown
  const turndownService = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });

  let markdownText: string;
  try {
    markdownText = cleanText(turndownService.turndown(text));
  } catch {
    markdownText = cleanText(text);
  }

  // Try to enhance with AI
  try {
    return await formatWithAI(markdownText, "markdown");
  } catch (error) {
    console.error("AI formatting failed:", error);
    return markdownText; // Fall back to basic conversion
  }
};

export const convertToHtml = async (text: string): Promise<string> => {
  // First do basic HTML conversion
  let htmlText: string;
  if (/<[a-z][\s\S]*>/i.test(text)) {
    htmlText = cleanText(text);
  } else {
    // Convert markdown to HTML
    htmlText = text
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/\n/gim, "<br>");
  }

  // Try to enhance with AI
  try {
    return await formatWithAI(htmlText, "html");
  } catch (error) {
    console.error("AI formatting failed:", error);
    return htmlText; // Fall back to basic conversion
  }
};

export const stripHtml = async (text: string): Promise<string> => {
  // First do basic HTML stripping
  const cleanedText = htmlToText(text, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });

  // Try to enhance with AI
  try {
    return await formatWithAI(cleanedText, "clean");
  } catch (error) {
    console.error("AI formatting failed:", error);
    return cleanedText; // Fall back to basic conversion
  }
};

export const getAiClient = () => {
  const preferences = getPreferenceValues<Preferences>();

  if (preferences.preferredAiProvider === "openai" && preferences.openaiApiKey) {
    return new OpenAI({ apiKey: preferences.openaiApiKey });
  } else if (preferences.preferredAiProvider === "anthropic" && preferences.anthropicApiKey) {
    return new Anthropic({ apiKey: preferences.anthropicApiKey });
  } else if (preferences.preferredAiProvider === "groq" && preferences.groqApiKey) {
    return new Groq({ apiKey: preferences.groqApiKey });
  }

  throw new Error("No AI provider configured. Please set up your API key in preferences.");
};

const createClipboardHtml = (html: string): string => {
  const header = `Version:0.9
StartHTML:00000097
EndHTML:{END_HTML}
StartFragment:00000133
EndFragment:{END_FRAGMENT}`;

  const beforeFragment = `<!DOCTYPE html><html><body><!--StartFragment-->`;
  const afterFragment = '<!--EndFragment--></body></html>';

  const fullHtml = `${header}\n${beforeFragment}${html}${afterFragment}`;
  
  // Calculate positions
  const endFragment = beforeFragment.length + html.length + 97 + header.length + 1;
  const endHtml = endFragment + afterFragment.length;
  
  return fullHtml
    .replace('{END_HTML}', endHtml.toString().padStart(8, '0'))
    .replace('{END_FRAGMENT}', endFragment.toString().padStart(8, '0'));
};

export const setClipboardContent = async (text: string, html: string): Promise<void> => {
  await Clipboard.copy({
    text: text,
    html: html,
  });
};

export const convertToWordFormat = async (text: string): Promise<string> => {
  // First convert to clean HTML
  let htmlText = await convertToHtml(text);
  
  // Add Word-specific styling (only structure, no fonts)
  htmlText = htmlText
    .replace(/<h1>/g, '<h1>')
    .replace(/<h2>/g, '<h2>')
    .replace(/<h3>/g, '<h3>')
    .replace(/<p>/g, '<p>')
    .replace(/<ul>/g, '<ul>')
    .replace(/<ol>/g, '<ol>');
  
  return htmlText;
};

export const convertToWebFormat = async (text: string): Promise<string> => {
  // First convert to clean HTML
  let htmlText = await convertToHtml(text);
  
  // Add web-standard styling (only structure, no fonts)
  htmlText = htmlText
    .replace(/<h1>/g, '<h1>')
    .replace(/<h2>/g, '<h2>')
    .replace(/<h3>/g, '<h3>')
    .replace(/<p>/g, '<p>')
    .replace(/<ul>/g, '<ul>')
    .replace(/<ol>/g, '<ol>');
  
  return htmlText;
};

export const pasteIntoActiveApp = async (): Promise<void> => {
  // Use system paste command (Cmd+V)
  execSync('osascript -e \'tell application "System Events" to keystroke "v" using command down\'');
};
