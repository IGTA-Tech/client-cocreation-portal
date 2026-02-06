'use client'

import { CheckCircle2, Circle, Sparkles } from 'lucide-react'
import type { Message } from '@/types'

interface ProgressIndicatorProps {
  messages: Message[]
  specDetected: boolean
}

type Phase = {
  id: number
  name: string
  description: string
}

const PHASES: Phase[] = [
  { id: 1, name: 'Discovery', description: 'Understanding your needs' },
  { id: 2, name: 'App Design', description: 'Defining features' },
  { id: 3, name: 'O-1 Alignment', description: 'Connecting to visa goals' },
  { id: 4, name: 'Spec Ready', description: 'Specification complete' },
]

/**
 * Determine the current phase based on message count and content
 */
export function calculatePhase(messages: Message[], specDetected: boolean): number {
  if (specDetected) return 4

  // Count user messages only
  const userMessageCount = messages.filter(m => m.role === 'user').length

  if (userMessageCount >= 9) return 3
  if (userMessageCount >= 5) return 2
  if (userMessageCount >= 2) return 1
  return 0
}

/**
 * Check if the spec has been generated in any message
 */
export function detectSpec(messages: Message[]): boolean {
  return messages.some(
    m => m.role === 'assistant' && 
    (m.content.includes('## O-1 Itinerary App Specification') ||
     m.content.includes('## App Specification') ||
     m.content.includes('### Complete Specification'))
  )
}

/**
 * Extract the full spec content from messages
 */
export function extractSpecContent(messages: Message[]): string | null {
  for (const message of [...messages].reverse()) {
    if (message.role === 'assistant') {
      // Look for spec markers
      const specMarkers = [
        '## O-1 Itinerary App Specification',
        '## App Specification',
        '### Complete Specification',
      ]
      
      for (const marker of specMarkers) {
        if (message.content.includes(marker)) {
          // Return content from the marker onwards
          const startIndex = message.content.indexOf(marker)
          return message.content.slice(startIndex)
        }
      }
    }
  }
  return null
}

export function ProgressIndicator({ messages, specDetected }: ProgressIndicatorProps) {
  const currentPhase = calculatePhase(messages, specDetected)
  const userMessageCount = messages.filter(m => m.role === 'user').length

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2">
        {PHASES.map((phase, index) => {
          const isComplete = currentPhase > phase.id || (currentPhase === 4 && phase.id === 4)
          const isCurrent = currentPhase === phase.id
          const isFirst = index === 0

          return (
            <div key={phase.id} className="flex items-center flex-1">
              {/* Connector line */}
              {!isFirst && (
                <div 
                  className={`h-0.5 flex-1 transition-colors duration-300 ${
                    isComplete || isCurrent ? 'bg-green-500' : 'bg-muted'
                  }`}
                />
              )}
              
              {/* Phase indicator */}
              <div className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isComplete 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : phase.id === 4 ? (
                    <Sparkles className={`h-4 w-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                <span 
                  className={`text-xs mt-1 font-medium whitespace-nowrap ${
                    isComplete || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {phase.name}
                </span>
              </div>

              {/* Connector line after */}
              {index < PHASES.length - 1 && (
                <div 
                  className={`h-0.5 flex-1 transition-colors duration-300 ${
                    isComplete ? 'bg-green-500' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Phase description */}
      <div className="text-center text-xs text-muted-foreground">
        {currentPhase === 0 ? (
          <span>Start the conversation to begin designing your app</span>
        ) : currentPhase === 4 ? (
          <span className="text-green-600 font-medium">🎉 Your App Specification is Ready!</span>
        ) : (
          <span>
            {PHASES[currentPhase - 1]?.description} • {userMessageCount} message{userMessageCount !== 1 ? 's' : ''} so far
          </span>
        )}
      </div>
    </div>
  )
}
