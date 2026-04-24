"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboards", label: "API Key Dashboard" },
  { href: "/playground", label: "API Playground" },
];

function HomeIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function PlaygroundIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );
}

function ItemIcon({ href }) {
  if (href === "/") return <HomeIcon />;
  if (href === "/playground") return <PlaygroundIcon />;
  return <KeyIcon />;
}

function NavList({ pathname, collapsed, onNavigate, className }) {
  return (
    <nav className={className}>
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={[
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition`,
              isActive
                ? "bg-black/[.08] text-zinc-950 dark:bg-white/[.12] dark:text-zinc-50"
                : "text-zinc-600 hover:bg-black/[.06] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[.08] dark:hover:text-zinc-50",
              !collapsed ? "" : "justify-center px-2",
            ]
              .filter(Boolean)
              .join(" ")}
            title={collapsed ? label : undefined}
          >
            <ItemIcon href={href} />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function SidebarLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const closeSheet = () => setMobileOpen(false);

  return (
    <div className="flex min-h-dvh w-full max-w-[100vw] flex-col overflow-x-clip bg-zinc-50 font-sans text-zinc-950 md:flex-row dark:bg-black dark:text-zinc-50">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 min-w-0 items-center border-b border-black/[.08] bg-white pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[env(safe-area-inset-top)] dark:border-white/[.12] dark:bg-zinc-950 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(20rem,100vw-1rem)] max-w-full gap-0 border-r border-black/[.08] p-0 pt-[env(safe-area-inset-top)] sm:w-80 dark:border-white/[.12]"
          >
            <div className="border-b border-black/[.08] px-4 py-3 dark:border-white/[.12]">
              <Link
                href="/"
                onClick={closeSheet}
                className="text-base font-semibold text-zinc-950 dark:text-zinc-50"
              >
                Dandi
              </Link>
            </div>
            <NavList
              pathname={pathname}
              collapsed={false}
              onNavigate={closeSheet}
              className="flex flex-col gap-0.5 p-3"
            />
          </SheetContent>
        </Sheet>
        <Link href="/" className="ml-1 min-w-0 flex-1 truncate pr-2 text-sm font-semibold" onClick={closeSheet}>
          Dandi
        </Link>
      </header>

      <aside
        className={`hidden shrink-0 flex-col border-r border-black/[.08] bg-white transition-[width] duration-200 ease-out dark:border-white/[.12] dark:bg-zinc-950 md:flex ${
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
          {open && <span className="ml-2 min-w-0 flex-1 truncate text-sm font-semibold">Dandi</span>}
        </div>
        <NavList
          pathname={pathname}
          collapsed={!open}
          className="flex flex-1 flex-col gap-0.5 p-2"
        />
      </aside>
      <div className="flex w-full min-w-0 min-h-0 flex-1 flex-col overflow-x-clip pt-14 md:pt-0">{children}</div>
    </div>
  );
}
