/**
 * Returns the avatar URL, falling back to a default avatar if none is provided or empty
 * @param avatar - The avatar URL to check
 * @returns The avatar URL or the default avatar path
 */
export const getAvatarUrl = (avatar?: string): string => {
  return avatar?.trim() ? avatar : '/assets/images/avatar.jpg';
};
