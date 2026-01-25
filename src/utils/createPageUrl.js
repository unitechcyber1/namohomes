export function createPageUrl(page) {
  if (!page) return "/";

  // Trim spaces & convert to lowercase
  const formatted = page.trim().toLowerCase();

  // Convert spaces → hyphens
  const slug = formatted.replace(/\s+/g, "-");

  // Handle pages like "Home" => "/"
  if (slug === "home") return "/";

  return `/${slug}`;
}
