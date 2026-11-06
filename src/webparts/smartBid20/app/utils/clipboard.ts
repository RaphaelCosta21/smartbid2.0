/**
 * clipboard — copy text with a fallback for hosts where the async Clipboard API is
 * blocked (e.g. SharePoint inside a Teams iframe), and build links to app routes.
 */

/** Absolute URL to a HashRouter route of this page, e.g. "/bid/B-1?tab=presentation". */
export function buildAppHashUrl(route: string): string {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}#${route}`;
}

function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  // Fullscreen elements hide everything outside them; append where the selection is allowed
  const host = (document.fullscreenElement as HTMLElement) || document.body;
  host.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  host.removeChild(textarea);
  return ok;
}

/** Resolves true when the text reached the clipboard. Never rejects. */
export function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}
