-- Create table for Twilio numbers
CREATE TABLE twilio_numbers (
  id BIGSERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL,
  country_code TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_twilio_numbers_country_code ON twilio_numbers(country_code);
CREATE INDEX idx_twilio_numbers_available ON twilio_numbers(available);
