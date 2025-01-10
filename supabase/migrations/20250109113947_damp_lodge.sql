/*
  # Risk Analysis Tables

  1. New Tables
    - `risk_assessments`: Stores risk assessment results
    - `review_queue`: Queue for high-risk transactions
    - `admin_notifications`: System notifications for administrators

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Risk Assessments Table
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL,
  risk_score decimal NOT NULL,
  risk_components jsonb NOT NULL,
  flags text[] NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Review Queue Table
CREATE TABLE IF NOT EXISTS review_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL,
  risk_score decimal NOT NULL,
  flags text[] NOT NULL,
  status text NOT NULL CHECK (status IN ('pending_review', 'reviewed', 'approved', 'rejected')),
  reviewer_id uuid REFERENCES auth.users(id),
  review_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin Notifications Table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  transaction_id uuid,
  risk_score decimal,
  flags text[],
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own risk assessments"
  ON risk_assessments FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM transactions WHERE id = transaction_id
  ));

CREATE POLICY "Admins can view all risk assessments"
  ON risk_assessments FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can manage review queue"
  ON review_queue FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can view notifications"
  ON admin_notifications FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_assessments_transaction ON risk_assessments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_review_queue_status ON review_queue(status);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_status ON admin_notifications(status);