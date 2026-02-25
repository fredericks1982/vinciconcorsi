import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VinciConcorsi.it",
  description: "Preparazione Istruttore Amministrativo - Servizi Demografici",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background">
            <header className="border-b border-border">
              <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-muted-foreground">
                  VinciConcorsi.it
                </span>
                <ThemeToggle />
              </div>
            </header>
            <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
