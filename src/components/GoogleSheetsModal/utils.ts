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
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Некорректная ссылка на Google Таблицу");
  }

  if (
    parsed.hostname !== "docs.google.com" ||
    !parsed.pathname.includes("/spreadsheets/d/")
  ) {
    throw new Error("Некорректная ссылка на Google Таблицу");
  }

  const sheetId = extractSheetId(rawUrl);
  if (!sheetId) {
    throw new Error("Не удалось извлечь ID таблицы из URL");
  }

  const gid =
    parsed.searchParams.get("gid") ||
    parsed.hash.match(/gid=(\d+)/)?.[1];

  if (mode === "view") {
    const url = new URL(
      `https://docs.google.com/spreadsheets/d/${sheetId}/preview`
    );
    if (gid) url.searchParams.set("gid", gid);
    return url.toString();
  }

  const url = new URL(
    `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
  );
  url.searchParams.set("embedded", "true");
  url.searchParams.set("rm", "minimal");
  if (gid) url.searchParams.set("gid", gid);
  return url.toString();
}
