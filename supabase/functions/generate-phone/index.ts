
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PhoneRequest {
  country: string;
}

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
    
    // Generate phone number
    const phoneNumber = generatePhoneNumber(country);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    // Clean up expired numbers first
    await supabase.from('phone_numbers').delete().lt('expires_at', new Date().toISOString());
    
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

    // Simulate receiving a message after 5 seconds
    setTimeout(async () => {
      await simulateMessage(supabase, data.id);
    }, 5000);

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
  const countryPrefixes: { [key: string]: { prefix: string; format: () => string } } = {
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
    }
  };

  const country = countryPrefixes[countryCode];
  if (!country) {
    const area = Math.floor(Math.random() * (999 - 200) + 200);
    const exchange = Math.floor(Math.random() * (999 - 200) + 200);
    const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `+1 (${area}) ${exchange}-${number}`;
  }

  return country.format();
}

async function simulateMessage(supabase: any, phoneNumberId: string) {
  const sampleMessages = [
    { from: '+1234567890', content: 'Your verification code is: 123456' },
    { from: '+9876543210', content: 'Welcome! Your account has been created successfully.' },
    { from: '+5555555555', content: 'Your OTP is 789012. Valid for 5 minutes.' },
    { from: '+1111111111', content: 'Thank you for signing up! Please confirm your email address.' },
    { from: '+2222222222', content: 'Security alert: New login detected from Chrome browser.' },
  ];
  
  const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
  
  await supabase.from('sms_messages').insert({
    phone_number_id: phoneNumberId,
    from_number: randomMessage.from,
    content: randomMessage.content
  });
}
