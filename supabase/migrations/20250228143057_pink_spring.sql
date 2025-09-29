/*
  # Fix duplicate policies in time management tables

  This migration ensures we don't create duplicate policies for the time management tables.
  It checks if tables and policies exist before attempting to create them.
*/

-- Check if tables exist before creating them
DO $$ 
BEGIN
  -- Only create tables if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_time_balances') THEN
    -- Create user_time_balances table
    CREATE TABLE IF NOT EXISTS user_time_balances (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      balance_hours numeric NOT NULL DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'time_balance_history') THEN
    -- Create time_balance_history table
    CREATE TABLE IF NOT EXISTS time_balance_history (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      amount_hours numeric NOT NULL,
      balance_after numeric NOT NULL,
      operation_type text NOT NULL,
      notes text,
      created_by uuid REFERENCES profiles(id) NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_session_logs') THEN
    -- Create user_session_logs table
    CREATE TABLE IF NOT EXISTS user_session_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      server_id uuid REFERENCES servers(id) ON DELETE CASCADE NOT NULL,
      start_time timestamptz NOT NULL,
      end_time timestamptz,
      duration_minutes numeric,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add columns to lessons table if they don't exist
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_metadata jsonb;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS pdf_url text;

-- Enable Row Level Security if not already enabled
DO $$ 
BEGIN
  -- Enable RLS on tables
  ALTER TABLE user_time_balances ENABLE ROW LEVEL SECURITY;
  ALTER TABLE time_balance_history ENABLE ROW LEVEL SECURITY;
  ALTER TABLE user_session_logs ENABLE ROW LEVEL SECURITY;
END $$;

-- Create policies only if they don't exist
DO $$ 
BEGIN
  -- Policies for user_time_balances
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_time_balances' AND policyname = 'Users can view their own time balance'
  ) THEN
    CREATE POLICY "Users can view their own time balance"
      ON user_time_balances
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_time_balances' AND policyname = 'Admins can manage all time balances'
  ) THEN
    CREATE POLICY "Admins can manage all time balances"
      ON user_time_balances
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;

  -- Policies for time_balance_history
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'time_balance_history' AND policyname = 'Users can view their own time balance history'
  ) THEN
    CREATE POLICY "Users can view their own time balance history"
      ON time_balance_history
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'time_balance_history' AND policyname = 'Admins can manage all time balance history'
  ) THEN
    CREATE POLICY "Admins can manage all time balance history"
      ON time_balance_history
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;

  -- Policies for user_session_logs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_session_logs' AND policyname = 'Users can view their own session logs'
  ) THEN
    CREATE POLICY "Users can view their own session logs"
      ON user_session_logs
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_session_logs' AND policyname = 'Users can insert their own session logs'
  ) THEN
    CREATE POLICY "Users can insert their own session logs"
      ON user_session_logs
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_session_logs' AND policyname = 'Users can update their own session logs'
  ) THEN
    CREATE POLICY "Users can update their own session logs"
      ON user_session_logs
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_session_logs' AND policyname = 'Admins can manage all session logs'
  ) THEN
    CREATE POLICY "Admins can manage all session logs"
      ON user_session_logs
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Add triggers to update timestamps if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_time_balances_updated_at'
  ) THEN
    CREATE TRIGGER update_user_time_balances_updated_at
    BEFORE UPDATE ON user_time_balances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create function for initial time balance if it doesn't exist
CREATE OR REPLACE FUNCTION create_initial_time_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_time_balances (user_id, balance_hours)
  VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for initial time balance if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'create_user_time_balance_on_profile_creation'
  ) THEN
    CREATE TRIGGER create_user_time_balance_on_profile_creation
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_initial_time_balance();
  END IF;
END $$;

-- Create initial time balances for existing users
INSERT INTO user_time_balances (user_id, balance_hours)
SELECT id, 0 FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM user_time_balances WHERE user_time_balances.user_id = profiles.id
);