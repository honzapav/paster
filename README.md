# Paster

A Raycast extension for smart text formatting and pasting.

## Features

- **Smart Paste**: Automatically formats text while preserving structure and meaning
- **Word Formatting**: Paste text with Microsoft Word-compatible formatting
- **Web-Standard Formatting**: Paste formatted text into web applications (Google Docs, Airtable, Asana, etc.)
- **Markdown Conversion**: Convert text to clean Markdown
- **HTML Stripping**: Remove HTML formatting while preserving text structure
- **AI Enhancement**: Optional AI-powered formatting improvements with choice of providers:
  - OpenAI (gpt-4o-mini)
  - Anthropic (claude-3.5-haiku)
  - Groq (mixtral-8x7b-32768)
  - Gemini (gemini-1.5-flash-8b)
  - Local Model (self-hosted)

## Commands

- `Smart Paste`: Automatically detect and preserve text formatting
- `Paste for Word`: Convert and paste text with Word-compatible formatting
- `Paste for Web`: Convert and paste text with web-standard formatting (works in Google Docs, Airtable, Asana, and other web apps)
- `Convert to Markdown`: Convert text to clean Markdown format
- `Strip Formatting`: Remove all formatting while preserving structure

## Setup

1. Install the extension from the Raycast store
2. Optional: Set up AI enhancement by configuring your preferred provider:
   - OpenAI API key for gpt-4o-mini formatting
   - Anthropic API key for claude-3.5-haiku formatting
   - Groq API key for mixtral-8x7b-32768 formatting
   - Gemini API key for gemini-1.5-flash-8b formatting
   - Local model endpoint and name for using your own model

## Usage

1. Copy text from any source
2. Use the appropriate Raycast command based on your target application
3. The text will be automatically formatted and pasted

## Tips

- Use `Paste for Web` when working with any web-based editor (Google Docs, Airtable, Asana, etc.)
- Use `Paste for Word` specifically for Microsoft Word
- Use `Smart Paste` when you want automatic format detection
- Use `Convert to Markdown` for clean, portable formatting
- Use `Strip Formatting` to remove all formatting while preserving structure
- For cloud processing, configure any of the available providers (OpenAI, Anthropic, Groq, or Gemini)
- For offline use, configure any local model of your choice

## Local Model Setup

To use a local model, you'll need:

1. A running model server that accepts text generation requests
2. Configure in Raycast preferences:
   - Set endpoint URL (e.g., `http://localhost:11434` for Ollama)
   - Set model name as expected by your server

Example setups:
- **Ollama**:
  - Install from https://ollama.ai
  - Pull your model: `ollama pull llama2`
  - Endpoint: `http://localhost:11434`
  - Model name: `llama2`

- **LocalAI**:
  - Set up LocalAI server
  - Endpoint: `http://localhost:8080`
  - Model name: matches your loaded model

- **Text Generation WebUI**:
  - Run with API enabled
  - Endpoint: `http://localhost:5000`
  - Model name: as configured in your setup

Note: The local model integration uses a simple generate endpoint (`/api/generate`). Make sure your model server provides a compatible API or adjust the code as needed.