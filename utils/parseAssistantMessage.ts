/**
 * Parse assistant message content that may be in structured format
 * The API returns content as a JSON string with format:
 * "[{'type': 'text', 'text': '...', 'extras': {...}}]"
 */
export function parseAssistantMessage(content: string): string {
  try {
    // First, check if it's already plain text (no structured format indicators)
    if (!content.includes("'type':") && !content.includes('"type":') && !content.includes("type")) {
      return content;
    }

    // Try to parse as-is first (in case it's already valid JSON)
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].text) {
        return parsed[0].text;
      }
    } catch {
      // Continue to next parsing attempt
    }

    // Replace single quotes with double quotes for JSON compatibility
    // But preserve escaped single quotes within strings
    let jsonString = content;
    
    // Handle Python-style string format: replace single quotes with double quotes
    // This regex avoids replacing single quotes that are escaped or inside text
    jsonString = jsonString
      .replace(/\\'/g, "ESCAPED_QUOTE") // Temporarily replace escaped quotes
      .replace(/'([^']*)':/g, '"$1":')   // Replace keys
      .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace simple string values
      .replace(/ESCAPED_QUOTE/g, "'");   // Restore escaped quotes
    
    // Try parsing after conversion
    const parsed = JSON.parse(jsonString);
    
    if (Array.isArray(parsed) && parsed.length > 0) {
      const firstItem = parsed[0];
      if (firstItem.type === 'text' && firstItem.text) {
        // Clean up the text: handle escaped newlines
        return firstItem.text
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "\t")
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"');
      }
    }
    
    return content;
  } catch (error) {
    // Fallback: Use regex to extract text content
    try {
      // Try to find text between 'text': ' and the next '
      // This handles cases where JSON parsing fails
      const patterns = [
        /'text':\s*'([^']*(?:\\'[^']*)*)'/,
        /"text":\s*"([^"]*(?:\\"[^"]*)*)"/,
        /'text':\s*"([^"]*(?:\\"[^"]*)*)"/
      ];
      
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          return match[1]
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"');
        }
      }
    } catch {
      // Ignore regex errors
    }
    
    // Last resort: return original content
    console.warn("Failed to parse assistant message, returning original:", error);
    return content;
  }
}
