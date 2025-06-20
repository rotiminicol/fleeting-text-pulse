import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Client } from 'https://esm.sh/twilio@4.13.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PhoneRequest {
  country: string;
}

// Initialize Twilio client
const twilioClient = Client(
  Deno.env.get('TWILIO_ACCOUNT_SID') ?? '',
  Deno.env.get('TWILIO_AUTH_TOKEN') ?? ''
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { country }: PhoneRequest = await req.json();
    
    // Get a real phone number from Twilio
    const { data: twilioNumber, error: twilioError } = await supabase
      .from('twilio_numbers')
      .select('phone_number')
      .eq('country_code', country)
      .eq('available', true)
      .limit(1)
      .single();

    if (twilioError || !twilioNumber) {
      return new Response(JSON.stringify({ error: 'No available phone numbers in this country' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const phoneNumber = twilioNumber.phone_number;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    // Clean up expired numbers first
    await supabase.from('phone_numbers').delete().lt('expires_at', new Date().toISOString());
    
    // Mark the number as unavailable
    await supabase.from('twilio_numbers')
      .update({ available: false })
      .eq('phone_number', phoneNumber);
    
    // Insert new phone number
    const { data, error } = await supabase
      .from('phone_numbers')
      .insert({
        number: phoneNumber,
        country: country,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to generate phone number' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate OTP and send to inbox
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      // Send a generic SMS
      const message = await twilioClient.messages.create({
        body: `Your verification code has been sent to your inbox. It will expire in 5 minutes.`,
        from: Deno.env.get('TWILIO_PHONE_NUMBER') ?? '',
        to: data.number
      });

      console.log('SMS sent successfully:', message.sid);

      // Send OTP directly to inbox
      await supabase.from('messages').insert({
        phone_number_id: data.id,
        content: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
        received_at: new Date().toISOString()
      });

      // Return the OTP in the response
      return new Response(JSON.stringify({
        id: data.id,
        number: data.number,
        country: data.country,
        expiresAt: data.expires_at,
        otp: otp
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      return new Response(JSON.stringify({ error: 'Failed to send SMS' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      id: data.id,
      number: data.number,
      country: data.country,
      expiresAt: data.expires_at
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generatePhoneNumber(countryCode: string): string {
  // Enhanced country prefixes with more countries
  const countryPrefixes: { [key: string]: { prefix: string; format: () => string } } = {
    // ... keep existing code (all the country formatting functions)
    US: {
      prefix: '+1',
      format: () => {
        const area = Math.floor(Math.random() * (999 - 200) + 200);
        const exchange = Math.floor(Math.random() * (999 - 200) + 200);
        const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `+1 (${area}) ${exchange}-${number}`;
      }
    },
    UK: {
      prefix: '+44',
      format: () => {
        const area = Math.floor(Math.random() * (9999 - 1000) + 1000);
        const number = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        return `+44 ${area} ${number}`;
      }
    },
    CA: {
      prefix: '+1',
      format: () => {
        const area = Math.floor(Math.random() * (999 - 200) + 200);
        const exchange = Math.floor(Math.random() * (999 - 200) + 200);
        const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `+1 (${area}) ${exchange}-${number}`;
      }
    },
    AU: {
      prefix: '+61',
      format: () => {
        const area = Math.floor(Math.random() * 9) + 1;
        const number = Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
        return `+61 ${area} ${number}`;
      }
    },
    DE: {
      prefix: '+49',
      format: () => {
        const area = Math.floor(Math.random() * (9999 - 100) + 100);
        const number = Math.floor(Math.random() * 9999999).toString().padStart(7, '0');
        return `+49 ${area} ${number}`;
      }
    },
    FR: {
      prefix: '+33',
      format: () => {
        const first = Math.floor(Math.random() * 9) + 1;
        const groups = Array(4).fill(0).map(() => 
          Math.floor(Math.random() * 100).toString().padStart(2, '0')
        );
        return `+33 ${first} ${groups.join(' ')}`;
      }
    },
    JP: {
      prefix: '+81',
      format: () => {
        const area = Math.floor(Math.random() * (999 - 10) + 10);
        const number = Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
        return `+81 ${area} ${number}`;
      }
    },
    IN: {
      prefix: '+91',
      format: () => {
        const first = Math.floor(Math.random() * 4) + 6;
        const number = Math.floor(Math.random() * 999999999).toString().padStart(9, '0');
        return `+91 ${first}${number}`;
      }
    },
    // Add default format for all other countries
    DEFAULT: {
      prefix: '+1',
      format: () => {
        const area = Math.floor(Math.random() * (999 - 200) + 200);
        const exchange = Math.floor(Math.random() * (999 - 200) + 200);
        const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `+1 (${area}) ${exchange}-${number}`;
      }
    }
  };

  const country = countryPrefixes[countryCode] || countryPrefixes.DEFAULT;
  return country.format();
}

async function simulateMessage(supabase: any, phoneNumberId: string) {
  const sampleMessages = [
    { from: '+1234567890', content: 'Your verification code is: 123456' },
    { from: '+9876543210', content: 'Welcome! Your account has been created successfully.' },
    { from: '+5555555555', content: 'Your OTP is 789012. Valid for 5 minutes.' },
    { from: '+1111111111', content: 'Thank you for signing up! Please confirm your email address.' },
    { from: '+2222222222', content: 'Security alert: New login detected from Chrome browser.' },
    { from: '+3333333333', content: 'Your password reset code is: 456789' },
    { from: '+4444444444', content: 'Verification successful! Welcome to our service.' },
    { from: '+6666666666', content: 'Your booking confirmation code: ABC123' },
  ];
  
  const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
  
  await supabase.from('sms_messages').insert({
    phone_number_id: phoneNumberId,
    from_number: randomMessage.from,
    content: randomMessage.content
  });
}
