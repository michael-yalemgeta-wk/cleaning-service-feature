/**
 * Converts various image URL formats to embeddable links.
 * Specifically handles Google Drive sharing links.
 */
export const getEmbedLink = (url: string | undefined): string => {
  if (!url) return '';

  // Google Drive standard view link
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  if (url.includes('drive.google.com') && url.includes('/file/d/')) {
    const matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matches && matches[1]) {
      return `https://drive.google.com/uc?export=view&id=${matches[1]}`;
    }
  }

  // Google Drive open link
  // Format: https://drive.google.com/open?id=FILE_ID
  if (url.includes('drive.google.com') && url.includes('id=')) {
    const matches = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (matches && matches[1]) {
      return `https://drive.google.com/uc?export=view&id=${matches[1]}`;
    }
  }

  return url;
};
