import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Wrench, Sparkles } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";

const IA_LOGO = "https://www.innovativeautomations.dev/wp-content/uploads/2025/04/Innovative-Automation-Studios-Logo-trimmed.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Image
              src={IA_LOGO}
              alt="Innovative Automations"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/chat">
              <Button>Start Chat</Button>
            </Link>
            <AuthButton />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Co-Create Custom Tools
          <br />
          <span className="text-primary">For Your Visa Journey</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Tell us about your challenges, and we&apos;ll build custom tools tailored specifically
          to your needs. From document generators to evidence organizers - if you can dream it,
          we can build it.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/chat">
            <Button size="lg" className="gap-2">
              <MessageSquare className="h-5 w-5" />
              Start Discovery Chat
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-secondary/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Our AI-powered discovery process helps you identify exactly what tool you need,
            then we build it for you.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">1. Chat With Us</CardTitle>
                <CardDescription>
                  Have a conversation with our AI assistant. Tell us about your visa journey,
                  your challenges, and what would make your life easier.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">2. Get Your Spec</CardTitle>
                <CardDescription>
                  Based on our conversation, we&apos;ll generate a Tool Specification
                  outlining exactly what we&apos;ll build for you. Review and approve it.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wrench className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">3. We Build It</CardTitle>
                <CardDescription>
                  Watch as your custom tool comes to life. Track progress in real-time
                  and provide feedback along the way.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tool Types */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">Tools We Can Build</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            We specialize in building tools for immigration professionals and visa applicants.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Document Generators", desc: "Petition drafts, cover letters, exhibit packages" },
              { title: "Evidence Organizers", desc: "Classifiers, exhibit assemblers, chronology builders" },
              { title: "Research Tools", desc: "Media search, prior art, competitor analysis" },
              { title: "Tracking Systems", desc: "Case status, deadline reminders, document checklists" },
              { title: "Calculators & Evaluators", desc: "Eligibility scoring, criteria matching" },
              { title: "Custom Automation", desc: "Email templates, form fillers, content generators" },
            ].map((tool) => (
              <Card key={tool.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription>{tool.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Build Your Tool?</h2>
          <p className="mt-4 text-primary-foreground/80">
            Start a conversation with our AI assistant and discover what custom tool
            would help your visa journey.
          </p>
          <Link href="/chat">
            <Button size="lg" variant="secondary" className="mt-8 gap-2">
              <MessageSquare className="h-5 w-5" />
              Start Discovery Chat
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src={IA_LOGO}
                alt="Innovative Automations"
                width={120}
                height={35}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Building custom tools for immigration professionals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
