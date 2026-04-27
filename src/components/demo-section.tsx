"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Loader2, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react"

const DEFAULT_URL = "https://github.com/raul-hdz-garcia/screenmatch-web-backend"
const API_ENDPOINT = "/api/github-summarizer/demo"

type ApiResponse = {
  valid: true
  summary: string
  cool_facts: string[]
}

export function DemoSection() {
  const [githubUrl, setGithubUrl] = useState(DEFAULT_URL)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubUrl }),
      })

      const data = (await res.json().catch(() => ({}))) as
        | ApiResponse
        | { valid: false; error?: string }
        | Record<string, unknown>

      if (!res.ok) {
        const message =
          typeof (data as { error?: string }).error === "string"
            ? (data as { error: string }).error
            : `Request failed with status ${res.status}`
        throw new Error(message)
      }

      if (data && typeof data === "object" && (data as ApiResponse).valid === true) {
        setResponse(data as ApiResponse)
        return
      }

      if (data && typeof data === "object" && (data as { error?: string }).error) {
        throw new Error((data as { error: string }).error)
      }
      throw new Error("Unexpected response from server")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!response) return
    navigator.clipboard.writeText(
      JSON.stringify(
        { valid: true, summary: response.summary, cool_facts: response.cool_facts },
        null,
        2
      )
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const responseText =
    response &&
    JSON.stringify(
      { valid: true, summary: response.summary, cool_facts: response.cool_facts },
      null,
      2
    )

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
                disabled={isLoading || !githubUrl.trim()}
                size="sm"
                className="shrink-0 gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
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
                  {response && responseText && (
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="h-80 overflow-auto p-4">
                  {isLoading && (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Analyzing repository...
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
                        <p className="mt-2 text-sm text-destructive">{error}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSubmit}
                          className="mt-4"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}

                  {response && !isLoading && responseText && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-accent">200 OK</span>
                      </div>
                      <div className="overflow-x-auto rounded-md bg-background p-4 font-mono text-xs">
                        <pre className="whitespace-pre-wrap break-words text-muted-foreground">
                          {responseText}
                        </pre>
                      </div>
                    </div>
                  )}

                  {!response && !isLoading && !error && (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Click &quot;Send Request&quot; to see the response
                      </p>
                    </div>
                  )}
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
