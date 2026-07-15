import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dr. Victor Valadares",
  description: "Sistema profissional de gestão odontológica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem
  disableTransitionOnChange
>
  <TooltipProvider>{children}</TooltipProvider>
  <Toaster richColors position="top-right" />
</ThemeProvider>
      </body>
    </html>
  );
}