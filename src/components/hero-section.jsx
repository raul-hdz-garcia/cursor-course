import { Button } from "@/components/ui/button"
import { BookOpen, Star, GitPullRequest, Terminal, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background grid pattern (subtle on cream) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.35_0_0/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.35_0_0/0.08)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-primary/10 px-4 py-1.5 text-sm font-medium text-foreground/80">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            Now analyzing 100K+ repositories
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Unlock insights from any{" "}
            <span className="text-accent">GitHub repository</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Get instant summaries, star trends, cool facts, latest PRs and version updates 
            on open source projects. Make informed decisions faster.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Button size="lg" className="gap-2 rounded-xl px-5 font-semibold">
              <Terminal className="h-4 w-4 opacity-90" />
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="gap-2 rounded-xl px-5 font-semibold">
              <BookOpen className="h-4 w-4 opacity-80" />
              View Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-6 text-center">
            <Star className="h-6 w-6 text-accent" />
            <span className="text-3xl font-bold text-foreground">2.5M+</span>
            <span className="text-sm text-muted-foreground">Stars Tracked</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-6 text-center">
            <GitPullRequest className="h-6 w-6 text-accent" />
            <span className="text-3xl font-bold text-foreground">500K+</span>
            <span className="text-sm text-muted-foreground">PRs Analyzed</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-6 text-center">
            <TrendingUp className="h-6 w-6 text-accent" />
            <span className="text-3xl font-bold text-foreground">10K+</span>
            <span className="text-sm text-muted-foreground">Active Users</span>
          </div>
        </div>
      </div>
    </section>
  )
}
