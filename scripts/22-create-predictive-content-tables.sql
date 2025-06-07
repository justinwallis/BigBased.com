-- Predictive Content Planning

-- Content Performance Predictions
CREATE TABLE IF NOT EXISTS content_performance_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  prediction_type VARCHAR(100) NOT NULL, -- engagement, conversion, traffic, etc.
  predicted_value DECIMAL(10,4) NOT NULL,
  confidence_level DECIMAL(3,2) NOT NULL, -- 0.0 to 1.0
  prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actual_value DECIMAL(10,4), -- filled in after the fact for model training
  model_version VARCHAR(50),
  factors JSONB DEFAULT '{}', -- factors that influenced the prediction
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Gap Analysis
CREATE TABLE IF NOT EXISTS content_gap_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic VARCHAR(255) NOT NULL,
  keyword VARCHAR(255) NOT NULL,
  search_volume INTEGER,
  competition_level VARCHAR(50), -- low, medium, high
  opportunity_score DECIMAL(3,2), -- 0.0 to 1.0
  recommended_content_type VARCHAR(100), -- blog, video, infographic, etc.
  target_audience VARCHAR(255),
  priority_level VARCHAR(50), -- low, medium, high, urgent
  status VARCHAR(50) DEFAULT 'identified', -- identified, planned, in_progress, completed
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seasonal Trends
CREATE TABLE IF NOT EXISTS seasonal_content_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic VARCHAR(255) NOT NULL,
  season VARCHAR(50) NOT NULL, -- spring, summer, fall, winter, holiday, etc.
  trend_strength DECIMAL(3,2) NOT NULL, -- how strong the seasonal trend is
  peak_months INTEGER[], -- array of month numbers (1-12)
  historical_data JSONB DEFAULT '{}', -- historical performance data
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitive Content Monitoring
CREATE TABLE IF NOT EXISTS competitive_content_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_name VARCHAR(255) NOT NULL,
  competitor_url TEXT,
  content_title VARCHAR(500),
  content_url TEXT,
  content_type VARCHAR(100),
  publish_date TIMESTAMP WITH TIME ZONE,
  engagement_metrics JSONB DEFAULT '{}', -- likes, shares, comments, etc.
  performance_score DECIMAL(3,2),
  topics TEXT[], -- extracted topics
  keywords TEXT[], -- extracted keywords
  threat_level VARCHAR(50), -- low, medium, high
  action_required BOOLEAN DEFAULT false,
  notes TEXT,
  monitored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Planning Calendar
CREATE TABLE IF NOT EXISTS content_planning_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(100) NOT NULL,
  target_audience VARCHAR(255),
  planned_publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'planned', -- planned, in_progress, review, approved, published
  assigned_to UUID REFERENCES auth.users(id),
  priority_level VARCHAR(50) DEFAULT 'medium',
  estimated_effort_hours INTEGER,
  target_keywords TEXT[],
  target_topics TEXT[],
  success_metrics JSONB DEFAULT '{}',
  content_item_id UUID REFERENCES content_items(id), -- linked when content is created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_predictions_content ON content_performance_predictions(content_item_id);
CREATE INDEX IF NOT EXISTS idx_content_predictions_type ON content_performance_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_content_gap_status ON content_gap_analysis(status);
CREATE INDEX IF NOT EXISTS idx_content_gap_priority ON content_gap_analysis(priority_level);
CREATE INDEX IF NOT EXISTS idx_seasonal_trends_topic ON seasonal_content_trends(topic);
CREATE INDEX IF NOT EXISTS idx_competitive_monitoring_competitor ON competitive_content_monitoring(competitor_name);
CREATE INDEX IF NOT EXISTS idx_competitive_monitoring_date ON competitive_content_monitoring(monitored_at);
CREATE INDEX IF NOT EXISTS idx_content_calendar_date ON content_planning_calendar(planned_publish_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_planning_calendar(status);
