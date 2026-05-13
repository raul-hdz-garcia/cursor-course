"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Loader2 } from "lucide-react"

const DEFAULT_URL = "https://github.com/langchain-ai/langchain"

export function DemoSection() {
  const [githubUrl, setGithubUrl] = useState(DEFAULT_URL)
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleSubmit = () => {
    if (status === "loading") return
    if (session) {
      router.push("/playground")
      return
    }
    const callback = encodeURIComponent("/playground")
    router.push(`/auth/sign-in?callbackUrl=${callback}`)
  }

  return (
    <section id="demo" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Try it yourself
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Continue to the playground, paste a public repository link, add your API key, and run a summary
            to see the analysis.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <Card className="gap-0 overflow-hidden p-0">
            <div className="flex flex-col gap-3 border-b border-border bg-secondary/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 text-sm text-muted-foreground">
                Pick a repository link to try (you can change it), then open the playground to summarize it.
              </p>
              <Button
                onClick={handleSubmit}
                disabled={status === "loading"}
                size="sm"
                className="shrink-0 gap-2 self-start sm:self-auto"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking session…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Continue to playground
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="border-b border-border lg:border-b-0 lg:border-r">
                <div className="border-b border-border bg-secondary/30 px-4 py-2">
                  <span className="text-sm font-medium text-foreground">Repository URL</span>
                </div>
                <div className="p-4">
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Public GitHub repository URL
                  </label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    You can copy this link into the playground, or replace it with any public repo you want to
                    try.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
                  <span className="text-sm font-medium text-foreground">What happens next</span>
                </div>
                <div className="flex h-80 items-center justify-center overflow-auto p-4">
                  <p className="max-w-sm text-center text-sm text-muted-foreground">
                    We&apos;ll take you to sign in if needed, then to the playground. There you paste the
                    repository URL, enter your API key, and choose Summarize repository to see results.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Summaries are available for public repositories only.
          </p>
        </div>
      </div>
    </section>
  )
}
