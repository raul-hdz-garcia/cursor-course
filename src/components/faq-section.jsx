"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does Dandi GitHub Analyzer work?",
    answer:
      "Dandi connects to GitHub's API to fetch repository data, then uses AI to analyze and summarize the information. You simply enter a repository URL, and we handle the rest.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We only access public repository data and never store your GitHub credentials. All data is encrypted in transit and at rest.",
  },
  {
    question: "Can I analyze private repositories?",
    answer:
      "Yes, with the Pro and Team plans. You'll need to authorize our app with your GitHub account to access private repositories.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 5 repository analyses per month, basic summaries, star count tracking, and access to our community support channels.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="break-words pr-2 text-left text-foreground hover:text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="break-words text-pretty text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
