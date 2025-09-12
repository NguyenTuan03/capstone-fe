export const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd');
};
/**
 * Performs accent-insensitive search comparison
 * @param searchText - The text to search for
 * @param targetText - The text to search in
 * @returns True if searchText is found in targetText (case and accent insensitive)
 */
export const accentInsensitiveSearch = (searchText: string, targetText: string): boolean => {
  if (!searchText || !targetText) return false;

  const normalizedSearch = removeAccents(searchText.trim().toLowerCase());
  const normalizedTarget = removeAccents(targetText.trim().toLowerCase());

  return normalizedTarget.includes(normalizedSearch);
};

/**
 * Creates a filter function for Ant Design Select components that ignores accents
 * @param input - The search input
 * @param option - The option to filter
 * @returns True if the option matches the search input
 */
export const createAccentInsensitiveFilter = (input: string, option: any): boolean => {
  const trimmedInput = input?.trim() || '';
  if (!trimmedInput) return true;

  const label = option?.label?.toString() || '';
  const children = option?.children?.toString() || '';

  return (
    accentInsensitiveSearch(trimmedInput, label) || accentInsensitiveSearch(trimmedInput, children)
  );
};
