import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Sparkles, FileCheck, Rocket } from "lucide-react"
import { AuthButton } from "@/components/auth/AuthButton"

const IA_LOGO = "https://www.innovativeautomations.dev/wp-content/uploads/2025/04/Innovative-Automation-Studios-Logo-trimmed.png"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
              <Button>Start Creating</Button>
            </Link>
            <AuthButton />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Co-Creation Studio
          <br />
          <span className="text-primary">For O-1 Visa Applicants</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Design and document a custom app that demonstrates your extraordinary ability. 
          We&apos;ll work together to create a compelling O-1 itinerary app with full specifications, 
          screenshots, and a 3-year roadmap.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/chat">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start Co-Creating
            </Button>
          </Link>
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Our AI-guided process helps you design an app that strengthens your O-1 visa petition.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">1. Design Together</CardTitle>
                <CardDescription>
                  Chat with our AI assistant to design your app. We&apos;ll explore how it 
                  connects to your extraordinary ability and plan every feature.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileCheck className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">2. Get Your Spec</CardTitle>
                <CardDescription>
                  Receive a complete App Specification including features, screenshots plan, 
                  deployment timeline, and 3-year roadmap for your petition.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Rocket className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">3. We Build It</CardTitle>
                <CardDescription>
                  Our team builds your app with all documented features. Track progress 
                  and get a live demo URL for your O-1 petition evidence.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">What&apos;s Included</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Everything you need for a compelling O-1 itinerary app exhibit.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Custom App Design", desc: "Tailored to your field of expertise and extraordinary ability" },
              { title: "Full Specification", desc: "Detailed documentation of features, users, and technical approach" },
              { title: "Screenshot Mockups", desc: "Professional visuals of key screens for your petition" },
              { title: "Deployment Timeline", desc: "Phased plan from MVP to full launch" },
              { title: "3-Year Roadmap", desc: "Long-term vision showing future contributions to the US" },
              { title: "Live Demo URL", desc: "Working prototype to include in your O-1 evidence" },
            ].map((item) => (
              <Card key={item.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Build Your O-1 App?</h2>
          <p className="mt-4 text-primary-foreground/80">
            Start designing an app that demonstrates your extraordinary ability 
            and strengthens your visa petition.
          </p>
          <Link href="/chat">
            <Button size="lg" variant="secondary" className="mt-8 gap-2">
              <Sparkles className="h-5 w-5" />
              Start Co-Creating
            </Button>
          </Link>
        </div>
      </section>

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
              Building O-1 itinerary apps for extraordinary individuals
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
