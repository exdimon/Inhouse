"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { GoogleSheetsModalProps } from "./types";
import { toEmbedUrl, isGoogleSheetsUrl } from "./utils";

export function GoogleSheetsModal({
  url,
  isOpen,
  onClose,
  title,
  mode = "edit",
  zIndex = 1000,
}: GoogleSheetsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, url]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  if (!mounted || !isOpen) return null;

  let embedUrl: string;
  try {
    if (!isGoogleSheetsUrl(url)) {
      throw new Error("Некорректная ссылка на Google Таблицу");
    }
    embedUrl = toEmbedUrl(url, mode);
  } catch (err) {
    embedUrl = "";
    if (!error) {
      setError(err instanceof Error ? err.message : "Ошибка обработки URL");
    }
  }

  const modal = (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 md:p-8"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Google Sheets"}
    >
      <div className="relative flex w-full max-w-5xl flex-col rounded-lg bg-white shadow-2xl md:h-[80vh] h-[90vh] dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title || "Google Таблица"}
          </h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {mode === "edit" ? "Редактирование" : "Просмотр"}
            </span>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              aria-label="Закрыть"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden">
          {error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
              >
                Открыть в новой вкладке
              </a>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-zinc-900">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
                </div>
              )}
              <iframe
                src={embedUrl}
                className="h-full w-full border-0"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError(
                    "Не удалось загрузить таблицу. Возможно, она не разрешает встраивание."
                  );
                }}
                allow="clipboard-read; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
