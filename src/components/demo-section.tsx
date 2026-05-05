"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Loader2 } from "lucide-react"

const DEFAULT_URL = "https://github.com/langchain-ai/langchain"
const API_ENDPOINT = "/api/github-summarizer/demo"

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
            Enter any public GitHub repository URL and see the analysis in action.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <Card className="gap-0 overflow-hidden p-0">
            {/* API Client Header */}
            <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded bg-accent/20 px-2 py-1 text-xs font-semibold text-accent">
                  POST
                </span>
                <span className="min-w-0 truncate font-mono text-sm text-muted-foreground sm:whitespace-normal sm:break-all">
                  {API_ENDPOINT}
                </span>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={status === "loading"}
                size="sm"
                className="shrink-0 gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking session…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Request Panel */}
              <div className="border-b border-border lg:border-b-0 lg:border-r">
                <div className="border-b border-border bg-secondary/30 px-4 py-2">
                  <span className="text-sm font-medium text-foreground">Request Body</span>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm text-muted-foreground">
                      GitHub Repository URL
                    </label>
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/owner/repo"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div className="overflow-hidden rounded-md bg-background p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap break-all text-muted-foreground">
                      <span className="text-foreground">{"{"}</span>
                      {"\n"}
                      {"  "}
                      <span className="text-accent">{'"githubUrl"'}</span>
                      <span className="text-foreground">:</span>{" "}
                      <span className="text-amber-400">{`"${githubUrl}"`}</span>
                      {"\n"}
                      <span className="text-foreground">{"}"}</span>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Response Panel */}
              <div>
                <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
                  <span className="text-sm font-medium text-foreground">Response</span>
                </div>
                <div className="flex h-80 items-center justify-center overflow-auto p-4">
                  <p className="max-w-sm text-center text-sm text-muted-foreground">
                    Sign in to run this request in the playground with your API key. If you&apos;re
                    already signed in, Send Request takes you there directly.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Works with public repositories. The HTTP API for integrations uses{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              POST /api/github-summarizer
            </code>{" "}
            with an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">x-api-key</code>{" "}
            header.
          </p>
        </div>
      </div>
    </section>
  )
}
