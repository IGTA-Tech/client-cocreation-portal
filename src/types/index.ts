export interface User {
  id: string
  email: string
  full_name: string | null
  company: string | null
  visa_type: string | null
  attorney_name: string | null
  created_at: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  messages: Message[]
  extracted_context: ExtractedContext | null
  status: 'active' | 'spec_generated' | 'converted_to_project'
  created_at: string
  updated_at: string
}

export interface ExtractedContext {
  visa_type?: string
  working_with_attorney?: boolean
  pain_points?: string[]
  desired_features?: string[]
  urgency?: 'low' | 'medium' | 'high'
}

export interface ToolSpec {
  id: string
  conversation_id: string
  user_id: string
  tool_name: string
  problem_statement: string
  key_features: string[]
  user_stories: UserStory[]
  complexity: 'simple' | 'medium' | 'complex'
  similar_tools: string[]
  approved_by_client: boolean
  approved_at: string | null
  created_at: string
}

export interface UserStory {
  as_a: string
  i_want: string
  so_that: string
}

export interface Project {
  id: string
  spec_id: string
  user_id: string
  title: string
  status: 'queued' | 'designing' | 'building' | 'testing' | 'delivered'
  progress_percent: number
  current_stage: string | null
  github_repo: string | null
  netlify_url: string | null
  notes: string | null
  created_at: string
  delivered_at: string | null
}

export interface ProjectStage {
  id: string
  project_id: string
  stage_name: string
  status: 'pending' | 'in_progress' | 'completed'
  notes: string | null
  attachments: Record<string, unknown> | null
  completed_at: string | null
  created_at: string
}

export interface DeliveredTool {
  id: string
  project_id: string
  user_id: string
  name: string
  description: string | null
  live_url: string | null
  documentation_url: string | null
  delivered_at: string
}
