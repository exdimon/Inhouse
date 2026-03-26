"use client";

import { useState } from "react";
import { useGoogleSheetsModal } from "@/components/GoogleSheetsModal";
import type { EmbedMode } from "@/components/GoogleSheetsModal";

const EXAMPLES: { name: string; url: string; mode: EmbedMode }[] = [
  {
    name: "Пример: Sales Pipeline",
    url: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit",
    mode: "edit",
  },
  {
    name: "Пример: Project Tracker",
    url: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit#gid=0",
    mode: "view",
  },
];

export default function Home() {
  const { openSheet, closeAll, modals } = useGoogleSheetsModal();
  const [url, setUrl] = useState("");

  const handleOpen = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    openSheet(trimmed, { title: "Google Таблица" });
    setUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleOpen();
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Inhouse CRM
          </h1>
          {modals.length > 0 && (
            <button
              onClick={closeAll}
              className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              Закрыть все ({modals.length})
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Открыть Google Таблицу
          </h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Вставьте ссылку на Google Таблицу..."
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
            <button
              onClick={handleOpen}
              disabled={!url.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Открыть
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Примеры таблиц
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {EXAMPLES.map((example) => (
              <div
                key={example.name}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">
                  {example.name}
                </h3>
                <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                  Режим: {example.mode === "edit" ? "Редактирование" : "Просмотр"}
                </p>
                <button
                  onClick={() =>
                    openSheet(example.url, {
                      title: example.name,
                      mode: example.mode,
                    })
                  }
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  Открыть таблицу
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
