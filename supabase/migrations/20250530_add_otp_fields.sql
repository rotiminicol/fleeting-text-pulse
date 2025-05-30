-- Add OTP fields to phone_numbers table
ALTER TABLE phone_numbers
ADD COLUMN otp TEXT,
ADD COLUMN otp_expires_at TIMESTAMP WITH TIME ZONE;

-- Add index for faster OTP lookups
CREATE INDEX idx_phone_numbers_otp ON phone_numbers(otp);
