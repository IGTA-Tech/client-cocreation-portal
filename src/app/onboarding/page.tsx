'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

const IA_LOGO = "https://www.innovativeautomations.dev/wp-content/uploads/2025/04/Innovative-Automation-Studios-Logo-trimmed.png"

const VISA_TYPES = ['O-1A', 'O-1B', 'P-1A', 'EB-1A', 'EB-1B', 'H-1B', 'Other']

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    visa_type: '',
    field_of_expertise: '',
    attorney_name: 'Sherrod Seward',
    project_description: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = formData.full_name && formData.visa_type && formData.field_of_expertise && formData.project_description

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
          <Image
            src={IA_LOGO}
            alt="Innovative Automations"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Welcome to Co-Creation Studio</CardTitle>
            <CardDescription>
              Tell us about yourself so we can personalize your O-1 itinerary app experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  name="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Company (Optional)</label>
                <Input
                  name="company"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Visa Type *</label>
                <select
                  name="visa_type"
                  value={formData.visa_type}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select visa type...</option>
                  {VISA_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Field of Expertise *</label>
                <Input
                  name="field_of_expertise"
                  placeholder="Machine Learning, Music Production, etc."
                  value={formData.field_of_expertise}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Attorney Name (Optional)</label>
                <Input
                  name="attorney_name"
                  placeholder="Sherrod Seward"
                  value={formData.attorney_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Project Description *</label>
                <textarea
                  name="project_description"
                  placeholder="Describe the app you want to build and how it relates to your extraordinary ability..."
                  value={formData.project_description}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone (Optional)</label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full h-12" disabled={isLoading || !isValid}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up your studio...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enter Co-Creation Studio
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
