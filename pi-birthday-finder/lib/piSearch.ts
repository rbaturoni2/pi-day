export interface PiSearchResult {
  found: boolean;
  position: number;      // 1-indexed position in Pi's decimal expansion
  matchedFormat: 'MMDDYYYY' | 'MMDDYY' | 'MMDD';
  searchString: string;  // The actual string that was searched
  context: string;       // ~30 digits surrounding the match
  contextStart: number;  // Position where context window begins (1-indexed)
  matchIndexInContext: number; // Index within context string where match starts
}

export function formatBirthdaySearchStrings(date: Date): { format: 'MMDDYYYY' | 'MMDDYY' | 'MMDD'; value: string }[] {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  const yy = yyyy.slice(-2);

  return [
    { format: 'MMDDYYYY', value: `${mm}${dd}${yyyy}` },
    { format: 'MMDDYY', value: `${mm}${dd}${yy}` },
    { format: 'MMDD', value: `${mm}${dd}` },
  ];
}

export function searchPi(piDigits: string, birthday: Date): PiSearchResult | null {
  const searchStrings = formatBirthdaySearchStrings(birthday);

  for (const { format, value } of searchStrings) {
    const idx = piDigits.indexOf(value);
    if (idx !== -1) {
      const position = idx + 1; // 1-indexed

      // Get context: 15 digits before and after
      const contextPad = 15;
      const contextStartIdx = Math.max(0, idx - contextPad);
      const contextEndIdx = Math.min(piDigits.length, idx + value.length + contextPad);
      const context = piDigits.slice(contextStartIdx, contextEndIdx);
      const matchIndexInContext = idx - contextStartIdx;

      return {
        found: true,
        position,
        matchedFormat: format,
        searchString: value,
        context,
        contextStart: contextStartIdx + 1, // 1-indexed
        matchIndexInContext,
      };
    }
  }

  return null;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}
