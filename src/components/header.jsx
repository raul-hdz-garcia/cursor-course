"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, GitBranch } from "lucide-react"
import HomeAuthActions from "@/components/HomeAuthActions"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <GitBranch className="h-6 w-6 text-accent" />
          <span className="text-lg font-semibold text-foreground">Dandi</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden rounded-full font-medium sm:inline-flex"
            asChild
          >
            <Link href="/dashboards">Dashboards</Link>
          </Button>
          <div className="hidden md:block">
            <HomeAuthActions />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(100vw-2rem,22rem)] max-w-full flex-col bg-background pb-[env(safe-area-inset-bottom)] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))]"
            >
              <nav className="mt-4 flex min-w-0 flex-col gap-4 sm:mt-8">
                <Link
                  href="#features"
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
                <Link
                  href="#faq"
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
                <Button variant="outline" className="mt-2 w-full rounded-xl font-medium" asChild>
                  <Link href="/dashboards" onClick={() => setIsOpen(false)}>
                    Dashboards
                  </Link>
                </Button>
                <div className="mt-4 w-full min-w-0 border-t border-border pt-4">
                  <HomeAuthActions mobileStack />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
