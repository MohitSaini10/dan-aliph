export function getR2KeyFromUrl(url: string) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/+/, "");
    // ex: books/1770362414179-Englishcover.jpg
  } catch {
    return "";
  }
}
