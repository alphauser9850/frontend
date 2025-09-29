/*
  # Create LMS tables

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `image_url` (text)
      - `created_by` (uuid, references profiles.id)
      - `is_published` (boolean, default false)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    
    - `modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses.id)
      - `title` (text, not null)
      - `description` (text)
      - `order` (integer, not null)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    
    - `lessons`
      - `id` (uuid, primary key)
      - `module_id` (uuid, references modules.id)
      - `title` (text, not null)
      - `description` (text)
      - `content_type` (text, not null) - 'video', 'document', 'quiz'
      - `content_url` (text)
      - `content` (text)
      - `order` (integer, not null)
      - `duration` (integer) - in minutes
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    
    - `workbooks`
      - `id` (uuid, primary key)
      - `server_id` (uuid, references servers.id)
      - `title` (text, not null)
      - `content` (text, not null)
      - `created_by` (uuid, references profiles.id)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    
    - `user_course_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `course_id` (uuid, references courses.id)
      - `completed_lessons` (uuid[], default '{}')
      - `last_accessed_at` (timestamp with time zone, default now())
      - `is_completed` (boolean, default false)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read published courses
    - Add policies for admins to manage all content
    - Add policies for users to track their own progress
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  content_type text NOT NULL,
  content_url text,
  content text,
  "order" integer NOT NULL,
  duration integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workbooks table
CREATE TABLE IF NOT EXISTS workbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid REFERENCES servers(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user course progress table
CREATE TABLE IF NOT EXISTS user_course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  completed_lessons uuid[] DEFAULT '{}',
  last_accessed_at timestamptz DEFAULT now(),
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

-- Policies for courses
CREATE POLICY "Anyone can view published courses"
  ON courses
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all courses"
  ON courses
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own course progress"
  ON courses
  FOR SELECT
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_course_progress
      WHERE user_course_progress.course_id = courses.id
      AND user_course_progress.user_id = auth.uid()
    )
  );

-- Policies for modules
CREATE POLICY "Anyone can view modules of published courses"
  ON modules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id
      AND courses.is_published = true
    )
  );

CREATE POLICY "Admins can manage all modules"
  ON modules
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies for lessons
CREATE POLICY "Anyone can view lessons of published courses"
  ON lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON courses.id = modules.course_id
      WHERE modules.id = lessons.module_id
      AND courses.is_published = true
    )
  );

CREATE POLICY "Admins can manage all lessons"
  ON lessons
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies for workbooks
CREATE POLICY "Users can view workbooks for servers they have access to"
  ON workbooks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM server_assignments
      WHERE server_assignments.server_id = workbooks.server_id
      AND server_assignments.user_id = auth.uid()
      AND server_assignments.status = 'approved'
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all workbooks"
  ON workbooks
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies for user course progress
CREATE POLICY "Users can view and update their own progress"
  ON user_course_progress
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user progress"
  ON user_course_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update timestamps
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON modules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workbooks_updated_at
BEFORE UPDATE ON workbooks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at
BEFORE UPDATE ON user_course_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();