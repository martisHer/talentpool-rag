export function chunkText(
  text: string,
  chunkSize = 1200,
  overlap = 200
) {
  const normalizedText = text
    .replace(/\s+/g, " ")
    .trim();

  const chunks: string[] = [];

  let start = 0;

  while (start < normalizedText.length) {
    const end = Math.min(
      start + chunkSize,
      normalizedText.length
    );

    chunks.push(
      normalizedText.slice(start, end)
    );

    if (end === normalizedText.length) {
      break;
    }

    start += chunkSize - overlap;
  }

  return chunks;
}