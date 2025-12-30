'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Plus, Wrench, Clock, CheckCircle, Loader2, Trash2 } from 'lucide-react'
import { AuthButton } from '@/components/auth/AuthButton'
import { createClient } from '@/lib/supabase/client'

const IA_LOGO = "https://www.innovativeautomations.dev/wp-content/uploads/2025/04/Innovative-Automation-Studios-Logo-trimmed.png"

interface Conversation {
  id: string
  title: string | null
  status: string
  updated_at: string
  messages: Array<{ id: string; role: string; content: string }>
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    spec_generated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    converted_to_project: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    queued: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    designing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    building: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    testing: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }

  const labels: Record<string, string> = {
    active: 'In Progress',
    spec_generated: 'Spec Ready',
    converted_to_project: 'In Development',
    queued: 'Queued',
    designing: 'Designing',
    building: 'Building',
    testing: 'Testing',
    delivered: 'Delivered',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
      {labels[status] || status}
    </span>
  )
}

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch conversations from Supabase
  useEffect(() => {
    async function fetchConversations() {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
      } else {
        setConversations(data || [])
      }
      setLoading(false)
    }

    fetchConversations()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={IA_LOGO}
                alt="Innovative Automations"
                width={140}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/chat">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </Link>
            <AuthButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations.length}</div>
              <p className="text-xs text-muted-foreground">Tool discovery chats</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tools in Development</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Being built for you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered Tools</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
          </Card>
        </div>

        {/* Conversations Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Conversations</h2>
            <Link href="/chat">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Start New
              </Button>
            </Link>
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : conversations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start a chat to discover what custom tool would help your visa journey.
                </p>
                <Link href="/chat">
                  <Button>Start Discovery Chat</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {conversations.map((conversation) => (
                <Card key={conversation.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {conversation.title || 'Untitled Conversation'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(conversation.updated_at).toLocaleDateString()}
                        <span className="text-muted-foreground">•</span>
                        {conversation.messages?.length || 0} messages
                      </CardDescription>
                    </div>
                    <StatusBadge status={conversation.status} />
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Link href={`/chat/${conversation.id}`}>
                      <Button variant="outline" size="sm">Continue Chat</Button>
                    </Link>
                    {conversation.status === 'spec_generated' && (
                      <Button size="sm">View Spec</Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(conversation.id)}
                      disabled={deletingId === conversation.id}
                    >
                      {deletingId === conversation.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Projects Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tools in Development</h2>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center">
                Once you approve a tool specification, it will appear here as we build it.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
