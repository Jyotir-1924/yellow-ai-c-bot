import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { darkGlassTheme } from "./theme";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Chatbot Platform",
  description: "AI Chatbot Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <ThemeProvider theme={darkGlassTheme}>
          <CssBaseline />
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
