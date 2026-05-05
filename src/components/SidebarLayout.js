"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
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

function sidebarShowsAccount(pathname) {
  return (
    pathname === "/dashboards" ||
    pathname === "/playground" ||
    pathname?.startsWith("/dashboards/") ||
    pathname?.startsWith("/playground/")
  );
}

function SidebarAccountFooter({ collapsed }) {
  const { data: session, status } = useSession();
  const showSkeleton = status === "loading";

  if (!showSkeleton && !session?.user) return null;

  const wrapClass =
    "flex shrink-0 flex-col border-t border-black/[.08] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3 dark:border-white/[.12] " +
    (collapsed ? "items-center gap-2" : "gap-3");

  if (showSkeleton) {
    return (
      <div className={wrapClass} aria-hidden>
        {collapsed ? (
          <>
            <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-[70%] max-w-[10rem] animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-[90%] max-w-[11rem] animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
            <div className="h-8 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </>
        )}
      </div>
    );
  }

  const name = session.user.name?.trim() ?? "";
  const email = session.user.email?.trim() ?? "";
  const photo = session.user.image;
  const primary = name || email || "Signed in";
  const secondary = name && email ? email : null;
  const tooltip = [name, email].filter(Boolean).join(" · ") || primary;

  const photoAlt = `${primary} profile photo`;

  function handleSignOut() {
    signOut({ callbackUrl: "/" });
  }

  if (collapsed) {
    return (
      <div className={wrapClass}>
        {photo ? (
          <span title={tooltip} className="inline-flex shrink-0">
            <Image
              src={photo}
              alt={photoAlt}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-black/[.08] dark:ring-white/[.12]"
            />
          </span>
        ) : (
          <span
            title={tooltip}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-700 ring-2 ring-black/[.08] dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/[.12]"
          >
            {(primary.trim().charAt(0) || "?").toUpperCase()}
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="border-black/[.08] bg-transparent text-zinc-950 shadow-none hover:bg-black/[.06] hover:text-zinc-950 dark:border-white/[.12] dark:bg-transparent dark:text-zinc-50 dark:hover:bg-white/[.08] dark:hover:text-zinc-50 [&_svg]:text-current"
          aria-label="Log out"
          title="Log out"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <div className="flex min-w-0 items-center gap-3">
        {photo ? (
          <Image
            src={photo}
            alt={photoAlt}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-black/[.08] dark:ring-white/[.12]"
          />
        ) : (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 ring-2 ring-black/[.08] dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/[.12]"
            aria-hidden
          >
            {(primary.trim().charAt(0) || "?").toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">{primary}</p>
          {secondary && (
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{secondary}</p>
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-black/[.08] bg-transparent text-zinc-950 shadow-none hover:bg-black/[.06] hover:text-zinc-950 dark:border-white/[.12] dark:bg-transparent dark:text-zinc-50 dark:hover:bg-white/[.08] dark:hover:text-zinc-50"
        onClick={handleSignOut}
      >
        Log out
      </Button>
    </div>
  );
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
  const showAccount = sidebarShowsAccount(pathname);

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
            className="flex h-full max-h-dvh min-h-0 w-[min(20rem,100vw-1rem)] max-w-full flex-col gap-0 border-r border-black/[.08] p-0 pt-[env(safe-area-inset-top)] sm:w-80 dark:border-white/[.12]"
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
              className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-3"
            />
            {showAccount ? <SidebarAccountFooter collapsed={false} /> : null}
          </SheetContent>
        </Sheet>
        <Link href="/" className="ml-1 min-w-0 flex-1 truncate pr-2 text-sm font-semibold" onClick={closeSheet}>
          Dandi
        </Link>
      </header>

      <aside
        className={`hidden min-h-0 shrink-0 flex-col overflow-hidden border-r border-black/[.08] bg-white transition-[width] duration-200 ease-out dark:border-white/[.12] dark:bg-zinc-950 md:sticky md:top-0 md:flex md:h-dvh md:max-h-dvh md:self-start ${
          open ? "w-56" : "w-14"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center border-b border-black/[.08] px-3 dark:border-white/[.12]">
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
          className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain p-2"
        />
        {showAccount ? <SidebarAccountFooter collapsed={!open} /> : null}
      </aside>
      <div className="flex w-full min-w-0 min-h-0 flex-1 flex-col overflow-x-clip pt-14 md:pt-0">{children}</div>
    </div>
  );
}
