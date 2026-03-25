import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Dhairya Soni",
    template: "%s — Dhairya Soni",
  },
  description: "CS student at VIT Vellore. Learning systems engineering in public — building, breaking, and documenting everything.",
  openGraph: {
    title: "Dhairya Soni",
    description: "CS student at VIT Vellore. Learning systems engineering in public.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="bg-bg-primary text-text-primary antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
