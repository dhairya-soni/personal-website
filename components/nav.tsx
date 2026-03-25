"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "home" },
  { href: "/log", label: "log" },
  { href: "/work", label: "work" },
  { href: "/projects", label: "projects" },
  { href: "/articles", label: "articles" },
  { href: "/contact", label: "contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-bg-primary/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm text-accent-green font-semibold tracking-tight">
          dhairya<span className="text-text-secondary">@vit</span>
          <span className="animate-blink text-accent-green ml-0.5">▊</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-xs transition-colors duration-200 ${
                pathname === l.href
                  ? "text-accent-green"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-text-secondary"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-bg-primary/95 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`font-mono text-sm ${
                pathname === l.href ? "text-accent-green" : "text-text-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
