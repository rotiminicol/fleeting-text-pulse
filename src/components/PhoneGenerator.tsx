import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from './CountdownTimer';
import MessageInbox from './MessageInbox';
import { supabase } from '@/integrations/supabase/client';
import { Phone, RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GeneratedNumber {
  id: string;
  number: string;
  country: string;
  expiresAt: Date;
}

interface Message {
  id: string;
  from_number: string;
  content: string;
  received_at: string;
}

const PhoneGenerator = () => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [generatedNumber, setGeneratedNumber] = useState<GeneratedNumber | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const countries = [
    { code: 'AF', name: 'Afghanistan', prefix: '+93' },
    { code: 'AL', name: 'Albania', prefix: '+355' },
    { code: 'DZ', name: 'Algeria', prefix: '+213' },
    { code: 'AD', name: 'Andorra', prefix: '+376' },
    { code: 'AO', name: 'Angola', prefix: '+244' },
    { code: 'AR', name: 'Argentina', prefix: '+54' },
    { code: 'AM', name: 'Armenia', prefix: '+374' },
    { code: 'AU', name: 'Australia', prefix: '+61' },
    { code: 'AT', name: 'Austria', prefix: '+43' },
    { code: 'AZ', name: 'Azerbaijan', prefix: '+994' },
    { code: 'BH', name: 'Bahrain', prefix: '+973' },
    { code: 'BD', name: 'Bangladesh', prefix: '+880' },
    { code: 'BY', name: 'Belarus', prefix: '+375' },
    { code: 'BE', name: 'Belgium', prefix: '+32' },
    { code: 'BZ', name: 'Belize', prefix: '+501' },
    { code: 'BJ', name: 'Benin', prefix: '+229' },
    { code: 'BT', name: 'Bhutan', prefix: '+975' },
    { code: 'BO', name: 'Bolivia', prefix: '+591' },
    { code: 'BA', name: 'Bosnia and Herzegovina', prefix: '+387' },
    { code: 'BW', name: 'Botswana', prefix: '+267' },
    { code: 'BR', name: 'Brazil', prefix: '+55' },
    { code: 'BN', name: 'Brunei', prefix: '+673' },
    { code: 'BG', name: 'Bulgaria', prefix: '+359' },
    { code: 'BF', name: 'Burkina Faso', prefix: '+226' },
    { code: 'BI', name: 'Burundi', prefix: '+257' },
    { code: 'KH', name: 'Cambodia', prefix: '+855' },
    { code: 'CM', name: 'Cameroon', prefix: '+237' },
    { code: 'CA', name: 'Canada', prefix: '+1' },
    { code: 'CV', name: 'Cape Verde', prefix: '+238' },
    { code: 'CF', name: 'Central African Republic', prefix: '+236' },
    { code: 'TD', name: 'Chad', prefix: '+235' },
    { code: 'CL', name: 'Chile', prefix: '+56' },
    { code: 'CN', name: 'China', prefix: '+86' },
    { code: 'CO', name: 'Colombia', prefix: '+57' },
    { code: 'KM', name: 'Comoros', prefix: '+269' },
    { code: 'CG', name: 'Congo', prefix: '+242' },
    { code: 'CR', name: 'Costa Rica', prefix: '+506' },
    { code: 'HR', name: 'Croatia', prefix: '+385' },
    { code: 'CU', name: 'Cuba', prefix: '+53' },
    { code: 'CY', name: 'Cyprus', prefix: '+357' },
    { code: 'CZ', name: 'Czech Republic', prefix: '+420' },
    { code: 'DK', name: 'Denmark', prefix: '+45' },
    { code: 'DJ', name: 'Djibouti', prefix: '+253' },
    { code: 'DM', name: 'Dominica', prefix: '+1767' },
    { code: 'DO', name: 'Dominican Republic', prefix: '+1809' },
    { code: 'EC', name: 'Ecuador', prefix: '+593' },
    { code: 'EG', name: 'Egypt', prefix: '+20' },
    { code: 'SV', name: 'El Salvador', prefix: '+503' },
    { code: 'GQ', name: 'Equatorial Guinea', prefix: '+240' },
    { code: 'ER', name: 'Eritrea', prefix: '+291' },
    { code: 'EE', name: 'Estonia', prefix: '+372' },
    { code: 'SZ', name: 'Eswatini', prefix: '+268' },
    { code: 'ET', name: 'Ethiopia', prefix: '+251' },
    { code: 'FJ', name: 'Fiji', prefix: '+679' },
    { code: 'FI', name: 'Finland', prefix: '+358' },
    { code: 'FR', name: 'France', prefix: '+33' },
    { code: 'GA', name: 'Gabon', prefix: '+241' },
    { code: 'GM', name: 'Gambia', prefix: '+220' },
    { code: 'GE', name: 'Georgia', prefix: '+995' },
    { code: 'DE', name: 'Germany', prefix: '+49' },
    { code: 'GH', name: 'Ghana', prefix: '+233' },
    { code: 'GR', name: 'Greece', prefix: '+30' },
    { code: 'GD', name: 'Grenada', prefix: '+1473' },
    { code: 'GT', name: 'Guatemala', prefix: '+502' },
    { code: 'GN', name: 'Guinea', prefix: '+224' },
    { code: 'GW', name: 'Guinea-Bissau', prefix: '+245' },
    { code: 'GY', name: 'Guyana', prefix: '+592' },
    { code: 'HT', name: 'Haiti', prefix: '+509' },
    { code: 'HN', name: 'Honduras', prefix: '+504' },
    { code: 'HU', name: 'Hungary', prefix: '+36' },
    { code: 'IS', name: 'Iceland', prefix: '+354' },
    { code: 'IN', name: 'India', prefix: '+91' },
    { code: 'ID', name: 'Indonesia', prefix: '+62' },
    { code: 'IR', name: 'Iran', prefix: '+98' },
    { code: 'IQ', name: 'Iraq', prefix: '+964' },
    { code: 'IE', name: 'Ireland', prefix: '+353' },
    { code: 'IL', name: 'Israel', prefix: '+972' },
    { code: 'IT', name: 'Italy', prefix: '+39' },
    { code: 'CI', name: 'Ivory Coast', prefix: '+225' },
    { code: 'JM', name: 'Jamaica', prefix: '+1876' },
    { code: 'JP', name: 'Japan', prefix: '+81' },
    { code: 'JO', name: 'Jordan', prefix: '+962' },
    { code: 'KZ', name: 'Kazakhstan', prefix: '+7' },
    { code: 'KE', name: 'Kenya', prefix: '+254' },
    { code: 'KI', name: 'Kiribati', prefix: '+686' },
    { code: 'KW', name: 'Kuwait', prefix: '+965' },
    { code: 'KG', name: 'Kyrgyzstan', prefix: '+996' },
    { code: 'LA', name: 'Laos', prefix: '+856' },
    { code: 'LV', name: 'Latvia', prefix: '+371' },
    { code: 'LB', name: 'Lebanon', prefix: '+961' },
    { code: 'LS', name: 'Lesotho', prefix: '+266' },
    { code: 'LR', name: 'Liberia', prefix: '+231' },
    { code: 'LY', name: 'Libya', prefix: '+218' },
    { code: 'LI', name: 'Liechtenstein', prefix: '+423' },
    { code: 'LT', name: 'Lithuania', prefix: '+370' },
    { code: 'LU', name: 'Luxembourg', prefix: '+352' },
    { code: 'MG', name: 'Madagascar', prefix: '+261' },
    { code: 'MW', name: 'Malawi', prefix: '+265' },
    { code: 'MY', name: 'Malaysia', prefix: '+60' },
    { code: 'MV', name: 'Maldives', prefix: '+960' },
    { code: 'ML', name: 'Mali', prefix: '+223' },
    { code: 'MT', name: 'Malta', prefix: '+356' },
    { code: 'MH', name: 'Marshall Islands', prefix: '+692' },
    { code: 'MR', name: 'Mauritania', prefix: '+222' },
    { code: 'MU', name: 'Mauritius', prefix: '+230' },
    { code: 'MX', name: 'Mexico', prefix: '+52' },
    { code: 'FM', name: 'Micronesia', prefix: '+691' },
    { code: 'MD', name: 'Moldova', prefix: '+373' },
    { code: 'MC', name: 'Monaco', prefix: '+377' },
    { code: 'MN', name: 'Mongolia', prefix: '+976' },
    { code: 'ME', name: 'Montenegro', prefix: '+382' },
    { code: 'MA', name: 'Morocco', prefix: '+212' },
    { code: 'MZ', name: 'Mozambique', prefix: '+258' },
    { code: 'MM', name: 'Myanmar', prefix: '+95' },
    { code: 'NA', name: 'Namibia', prefix: '+264' },
    { code: 'NR', name: 'Nauru', prefix: '+674' },
    { code: 'NP', name: 'Nepal', prefix: '+977' },
    { code: 'NL', name: 'Netherlands', prefix: '+31' },
    { code: 'NZ', name: 'New Zealand', prefix: '+64' },
    { code: 'NI', name: 'Nicaragua', prefix: '+505' },
    { code: 'NE', name: 'Niger', prefix: '+227' },
    { code: 'NG', name: 'Nigeria', prefix: '+234' },
    { code: 'KP', name: 'North Korea', prefix: '+850' },
    { code: 'MK', name: 'North Macedonia', prefix: '+389' },
    { code: 'NO', name: 'Norway', prefix: '+47' },
    { code: 'OM', name: 'Oman', prefix: '+968' },
    { code: 'PK', name: 'Pakistan', prefix: '+92' },
    { code: 'PW', name: 'Palau', prefix: '+680' },
    { code: 'PA', name: 'Panama', prefix: '+507' },
    { code: 'PG', name: 'Papua New Guinea', prefix: '+675' },
    { code: 'PY', name: 'Paraguay', prefix: '+595' },
    { code: 'PE', name: 'Peru', prefix: '+51' },
    { code: 'PH', name: 'Philippines', prefix: '+63' },
    { code: 'PL', name: 'Poland', prefix: '+48' },
    { code: 'PT', name: 'Portugal', prefix: '+351' },
    { code: 'QA', name: 'Qatar', prefix: '+974' },
    { code: 'RO', name: 'Romania', prefix: '+40' },
    { code: 'RU', name: 'Russia', prefix: '+7' },
    { code: 'RW', name: 'Rwanda', prefix: '+250' },
    { code: 'KN', name: 'Saint Kitts and Nevis', prefix: '+1869' },
    { code: 'LC', name: 'Saint Lucia', prefix: '+1758' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', prefix: '+1784' },
    { code: 'WS', name: 'Samoa', prefix: '+685' },
    { code: 'SM', name: 'San Marino', prefix: '+378' },
    { code: 'ST', name: 'Sao Tome and Principe', prefix: '+239' },
    { code: 'SA', name: 'Saudi Arabia', prefix: '+966' },
    { code: 'SN', name: 'Senegal', prefix: '+221' },
    { code: 'RS', name: 'Serbia', prefix: '+381' },
    { code: 'SC', name: 'Seychelles', prefix: '+248' },
    { code: 'SL', name: 'Sierra Leone', prefix: '+232' },
    { code: 'SG', name: 'Singapore', prefix: '+65' },
    { code: 'SK', name: 'Slovakia', prefix: '+421' },
    { code: 'SI', name: 'Slovenia', prefix: '+386' },
    { code: 'SB', name: 'Solomon Islands', prefix: '+677' },
    { code: 'SO', name: 'Somalia', prefix: '+252' },
    { code: 'ZA', name: 'South Africa', prefix: '+27' },
    { code: 'KR', name: 'South Korea', prefix: '+82' },
    { code: 'SS', name: 'South Sudan', prefix: '+211' },
    { code: 'ES', name: 'Spain', prefix: '+34' },
    { code: 'LK', name: 'Sri Lanka', prefix: '+94' },
    { code: 'SD', name: 'Sudan', prefix: '+249' },
    { code: 'SR', name: 'Suriname', prefix: '+597' },
    { code: 'SE', name: 'Sweden', prefix: '+46' },
    { code: 'CH', name: 'Switzerland', prefix: '+41' },
    { code: 'SY', name: 'Syria', prefix: '+963' },
    { code: 'TW', name: 'Taiwan', prefix: '+886' },
    { code: 'TJ', name: 'Tajikistan', prefix: '+992' },
    { code: 'TZ', name: 'Tanzania', prefix: '+255' },
    { code: 'TH', name: 'Thailand', prefix: '+66' },
    { code: 'TL', name: 'Timor-Leste', prefix: '+670' },
    { code: 'TG', name: 'Togo', prefix: '+228' },
    { code: 'TO', name: 'Tonga', prefix: '+676' },
    { code: 'TT', name: 'Trinidad and Tobago', prefix: '+1868' },
    { code: 'TN', name: 'Tunisia', prefix: '+216' },
    { code: 'TR', name: 'Turkey', prefix: '+90' },
    { code: 'TM', name: 'Turkmenistan', prefix: '+993' },
    { code: 'TV', name: 'Tuvalu', prefix: '+688' },
    { code: 'UG', name: 'Uganda', prefix: '+256' },
    { code: 'UA', name: 'Ukraine', prefix: '+380' },
    { code: 'AE', name: 'United Arab Emirates', prefix: '+971' },
    { code: 'UK', name: 'United Kingdom', prefix: '+44' },
    { code: 'US', name: 'United States', prefix: '+1' },
    { code: 'UY', name: 'Uruguay', prefix: '+598' },
    { code: 'UZ', name: 'Uzbekistan', prefix: '+998' },
    { code: 'VU', name: 'Vanuatu', prefix: '+678' },
    { code: 'VA', name: 'Vatican City', prefix: '+39' },
    { code: 'VE', name: 'Venezuela', prefix: '+58' },
    { code: 'VN', name: 'Vietnam', prefix: '+84' },
    { code: 'YE', name: 'Yemen', prefix: '+967' },
    { code: 'ZM', name: 'Zambia', prefix: '+260' },
    { code: 'ZW', name: 'Zimbabwe', prefix: '+263' }
  ];

  const handleGenerateNumber = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-phone', {
        body: { country: selectedCountry }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to generate phone number. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setGeneratedNumber({
        id: data.id,
        number: data.number,
        country: data.country,
        expiresAt: new Date(data.expiresAt)
      });
      
      setMessages([]);
      toast({
        title: "Success",
        description: "Phone number generated successfully!"
      });
      
    } catch (error) {
      console.error('Error generating number:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchMessages = async () => {
    if (!generatedNumber) return;

    try {
      const { data, error } = await supabase.functions.invoke('get-messages', {
        body: { phoneNumberId: generatedNumber.id }
      });

      if (!error && data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!generatedNumber) return;

    const interval = setInterval(fetchMessages, 3000);
    fetchMessages(); // Initial fetch

    return () => clearInterval(interval);
  }, [generatedNumber]);

  const copyToClipboard = async () => {
    if (generatedNumber) {
      await navigator.clipboard.writeText(generatedNumber.number);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Phone number copied to clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExpired = () => {
    setGeneratedNumber(null);
    setMessages([]);
    toast({
      title: "Expired",
      description: "Phone number has expired"
    });
  };

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Disposable Phone Numbers
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto leading-relaxed">
          Generate temporary phone numbers from any country that expire in 1 hour. Perfect for SMS verification 
          and protecting your privacy online.
        </p>
        <div className="flex justify-center mt-4 flex-wrap gap-2">
          <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">🌍 Worldwide</span>
          <span className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold">⚡ Instant</span>
          <span className="px-3 py-2 bg-pink-100 text-pink-700 rounded-full text-xs sm:text-sm font-semibold">🔒 Private</span>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Generator Card */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-lg text-white">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold">
              <Phone className="h-8 w-8 text-white" />
              Generate Temporary Phone Number
            </CardTitle>
            <p className="text-blue-100 mt-2 text-lg">Get a disposable phone number that expires in 1 hour</p>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-end">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Select Country
                </label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-full h-12 text-lg border-2 border-purple-200 focus:border-purple-500 bg-white shadow-md rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-white border-purple-200">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="text-lg py-3 hover:bg-purple-50">
                        {country.name} ({country.prefix})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleGenerateNumber} 
                disabled={isGenerating}
                className="w-full sm:w-auto px-10 h-12 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 text-white font-bold shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Number'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Number Display */}
        {generatedNumber && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-green-50 to-blue-50">
            <CardHeader className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-t-lg text-white">
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-bold">Your Temporary Number</span>
                <Badge variant="outline" className="bg-white text-green-600 border-white px-4 py-1 font-bold">
                  ✅ Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-md">
                <div>
                  <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
                    {generatedNumber.number}
                  </div>
                  <div className="text-lg text-purple-600 font-semibold">
                    {selectedCountryData?.name} ({selectedCountryData?.prefix})
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={copyToClipboard}
                  className="ml-6 border-2 border-purple-300 hover:bg-purple-100 text-purple-700 font-bold shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              
              <CountdownTimer 
                expiresAt={generatedNumber.expiresAt} 
                onExpired={handleExpired}
              />
              
              <div className="text-sm text-blue-700 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl border-2 border-blue-300 shadow-md">
                <strong>📱 SMS Only:</strong> This number can only receive SMS messages, not phone calls. 
                All incoming messages will appear in the inbox below.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages Inbox */}
        {generatedNumber && (
          <MessageInbox messages={messages} />
        )}
      </div>
    </div>
  );
};

export default PhoneGenerator;
