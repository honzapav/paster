import { Clipboard, showHUD } from "@raycast/api";
import { convertToWebFormat, setClipboardContent, pasteIntoActiveApp } from "./utils";

export default async function Command() {
  try {
    const text = await Clipboard.readText();
    
    if (!text) {
      await showHUD("No text found in clipboard");
      return;
    }
    
    await showHUD("Converting for web...");
    const htmlText = await convertToWebFormat(text);
    await setClipboardContent(text, htmlText);
    await pasteIntoActiveApp();
    await showHUD("Pasted with web formatting");
  } catch (error) {
    if (error instanceof Error) {
      await showHUD(error.message);
    } else {
      await showHUD("Failed to paste for web");
    }
    console.error(error);
  }
} 