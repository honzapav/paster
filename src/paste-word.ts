import { Clipboard, showHUD } from "@raycast/api";
import { convertToWordFormat, setClipboardContent, pasteIntoActiveApp } from "./utils";

export default async function Command() {
  try {
    const text = await Clipboard.readText();
    
    if (!text) {
      await showHUD("No text found in clipboard");
      return;
    }
    
    await showHUD("Converting for Word...");
    const htmlText = await convertToWordFormat(text);
    await setClipboardContent(text, htmlText);
    await pasteIntoActiveApp();
    await showHUD("Pasted with Word formatting");
  } catch (error) {
    if (error instanceof Error) {
      await showHUD(error.message);
    } else {
      await showHUD("Failed to paste for Word");
    }
    console.error(error);
  }
} 