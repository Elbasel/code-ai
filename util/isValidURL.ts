export const isValidURL = (string: string | null) => {
  if (!string) return false;

  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
