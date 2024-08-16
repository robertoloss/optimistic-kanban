import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

	const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

import { cn } from "./utils/cn";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Optimistic Kanban Board",
  description: "A kanban board with Next.js and Supabase featuring optimistic UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
			<body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
				<ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
					Under Maintenance
          </ThemeProvider>
      </body>
    </html>
  );
}
