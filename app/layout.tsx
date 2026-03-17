import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";

export const metadata: Metadata = {
  title: "Find Your Birthday in Pi | Pi Day 2026",
  description: "Enter your birthday and watch as we scan through a million digits of Pi to find where your birthday is hiding. Happy Pi Day!",
  openGraph: {
    title: "Find Your Birthday in Pi",
    description: "Your birthday is hidden somewhere in π. Find it!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
