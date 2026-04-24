import { FileText, Star, Lightbulb, GitPullRequest, Tag, BarChart3 } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Repository Summaries",
    description: "Get AI-powered summaries of any repository&apos;s purpose, architecture, and key features in seconds.",
  },
  {
    icon: Star,
    title: "Star Tracking",
    description: "Monitor star growth trends, daily gains, and compare popularity across similar projects.",
  },
  {
    icon: Lightbulb,
    title: "Cool Facts",
    description: "Discover interesting insights like top contributors, commit patterns, and hidden gems.",
  },
  {
    icon: GitPullRequest,
    title: "Latest PRs",
    description: "Stay updated with the most important pull requests and their impact on the codebase.",
  },
  {
    icon: Tag,
    title: "Version Updates",
    description: "Track releases, changelogs, and breaking changes across your favorite repositories.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visualize repository health, activity trends, and community engagement metrics.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to analyze repositories
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Powerful tools to help you understand and track open source projects effortlessly.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-card/80"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
