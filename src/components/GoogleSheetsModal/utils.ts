import type { EmbedMode } from "./types";

const SHEET_ID_REGEX = /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/;

export function extractSheetId(url: string): string | null {
  const match = url.match(SHEET_ID_REGEX);
  return match ? match[1] : null;
}

export function isGoogleSheetsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "docs.google.com" &&
      parsed.pathname.includes("/spreadsheets/d/")
    );
  } catch {
    return false;
  }
}

export function toEmbedUrl(rawUrl: string, mode: EmbedMode = "edit"): string {
  if (!isGoogleSheetsUrl(rawUrl)) {
    throw new Error("Invalid Google Sheets URL");
  }

  const sheetId = extractSheetId(rawUrl);
  if (!sheetId) {
    throw new Error("Could not extract sheet ID from URL");
  }

  const parsed = new URL(rawUrl);
  const gid = parsed.searchParams.get("gid") || parsed.hash.match(/gid=(\d+)/)?.[1];

  if (mode === "view") {
    const url = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/preview`);
    if (gid) url.searchParams.set("gid", gid);
    return url.toString();
  }

  const url = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`);
  url.searchParams.set("embedded", "true");
  url.searchParams.set("rm", "minimal");
  if (gid) url.searchParams.set("gid", gid);
  return url.toString();
}
