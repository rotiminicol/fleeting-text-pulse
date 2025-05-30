
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
    { code: 'US', name: 'United States', prefix: '+1' },
    { code: 'UK', name: 'United Kingdom', prefix: '+44' },
    { code: 'CA', name: 'Canada', prefix: '+1' },
    { code: 'AU', name: 'Australia', prefix: '+61' },
    { code: 'DE', name: 'Germany', prefix: '+49' },
    { code: 'FR', name: 'France', prefix: '+33' },
    { code: 'JP', name: 'Japan', prefix: '+81' },
    { code: 'IN', name: 'India', prefix: '+91' },
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Generator Card */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl text-gray-800">
            <Phone className="h-8 w-8 text-blue-600" />
            Generate Temporary Phone Number
          </CardTitle>
          <p className="text-gray-600 mt-2">Get a disposable phone number that expires in 1 hour</p>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Country
              </label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="text-lg py-3">
                      {country.name} ({country.prefix})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateNumber} 
              disabled={isGenerating}
              className="w-full sm:w-auto px-10 h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl text-gray-800">Your Temporary Number</span>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 px-4 py-1">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-100">
              <div>
                <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
                  {generatedNumber.number}
                </div>
                <div className="text-lg text-gray-600">
                  {selectedCountryData?.name} ({selectedCountryData?.prefix})
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={copyToClipboard}
                className="ml-6 border-2 hover:bg-blue-50"
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
            
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
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
  );
};

export default PhoneGenerator;
