import { ChatWindow } from '@/components/chat/ChatWindow'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const IA_LOGO = "https://www.innovativeautomations.dev/wp-content/uploads/2025/04/Innovative-Automation-Studios-Logo-trimmed.png"

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Link href="/" className="flex items-center">
          <Image
            src={IA_LOGO}
            alt="Innovative Automations"
            width={120}
            height={35}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Tool Discovery Chat</h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s discover what tool would help your visa journey
          </p>
        </div>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-hidden">
        <ChatWindow />
      </main>
    </div>
  )
}
