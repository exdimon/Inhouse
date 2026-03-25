import type { Metadata } from "next";
import { ModalManagerProvider } from "@/context/ModalManagerContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inhouse CRM",
  description: "Inhouse CRM — Google Sheets Integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ModalManagerProvider>{children}</ModalManagerProvider>
      </body>
    </html>
  );
}
