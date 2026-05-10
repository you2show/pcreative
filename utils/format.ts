export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

export const getAvatarFallbackUrl = (name: string, size = 200): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=4f46e5&color=ffffff&bold=true`;
};
