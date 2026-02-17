"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboards", label: "API Key Dashboard" },
];

export default function SidebarLayout({ children }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <aside
        className={`flex shrink-0 flex-col border-r border-black/[.08] bg-white transition-[width] duration-200 ease-out dark:border-white/[.12] dark:bg-zinc-950 ${
          open ? "w-56" : "w-14"
        }`}
      >
        <div className="flex h-14 items-center border-b border-black/[.08] px-3 dark:border-white/[.12]">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-black/[.06] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[.08] dark:hover:text-zinc-50"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg
              className={`h-5 w-5 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
          {open && (
            <span className="ml-2 truncate text-sm font-semibold">Dandi</span>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-black/[.08] text-zinc-950 dark:bg-white/[.12] dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-black/[.06] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[.08] dark:hover:text-zinc-50"
                } ${!open ? "justify-center px-2" : ""}`}
                title={!open ? label : undefined}
              >
                {href === "/" ? (
                  <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                )}
                {open && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
