import { Button } from "@/components/ui/button"
import { BookOpen, Terminal } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border-2 border-foreground/10 bg-card p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] md:p-16">
          {/* Background pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.35_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.35_0_0/0.06)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-80" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to unlock repository insights?
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Join thousands of developers who use Dandi to make better decisions about open source projects.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <Button size="lg" className="gap-2 rounded-xl px-5 font-semibold">
                <Terminal className="h-4 w-4 opacity-90" />
                Start Free Today
              </Button>
              <Button size="lg" variant="outline" className="gap-2 rounded-xl px-5 font-semibold">
                <BookOpen className="h-4 w-4 opacity-80" />
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
