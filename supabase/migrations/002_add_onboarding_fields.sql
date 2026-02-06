-- Add onboarding fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS project_description TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS field_of_expertise TEXT;

-- Update tool_specs table for co-creation format
ALTER TABLE tool_specs ADD COLUMN IF NOT EXISTS app_description TEXT;
ALTER TABLE tool_specs ADD COLUMN IF NOT EXISTS extraordinary_ability_connection TEXT;
ALTER TABLE tool_specs ADD COLUMN IF NOT EXISTS target_users TEXT;
ALTER TABLE tool_specs ADD COLUMN IF NOT EXISTS deployment_plan JSONB DEFAULT '{}'::jsonb;
ALTER TABLE tool_specs ADD COLUMN IF NOT EXISTS three_year_roadmap JSONB DEFAULT '{}'::jsonb;
ALTER TABLE tool_specs ADD COLUMN IF NOT EXISTS screenshots_plan JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tool_specs ADD COLUMN IF NOT EXISTS future_features JSONB DEFAULT '[]'::jsonb;
