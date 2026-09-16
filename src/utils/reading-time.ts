function collectText(value: unknown, output: string[]): void {
  if (typeof value === "string") {
    output.push(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectText(item, output));
    return;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.text === "string") output.push(record.text);
    Object.entries(record).forEach(([key, item]) => {
      if (key !== "text") collectText(item, output);
    });
  }
}

export function getReadingTime(content: unknown): number {
  const text: string[] = [];
  collectText(content, text);
  const words = text.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
