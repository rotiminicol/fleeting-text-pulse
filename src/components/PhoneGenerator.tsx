
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from './CountdownTimer';
import MessageInbox from './MessageInbox';
import { generatePhoneNumber } from '../utils/phoneUtils';
import { Phone, RefreshCw, Copy, Check } from 'lucide-react';

interface GeneratedNumber {
  number: string;
  country: string;
  expiresAt: Date;
}

interface Message {
  id: string;
  from: string;
  content: string;
  receivedAt: Date;
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
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const number = generatePhoneNumber(selectedCountry);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    setGeneratedNumber({
      number,
      country: selectedCountry,
      expiresAt
    });
    
    setMessages([]);
    setIsGenerating(false);
    
    // Simulate receiving messages
    setTimeout(() => {
      simulateMessage();
    }, 5000);
  };

  const simulateMessage = () => {
    const sampleMessages = [
      { from: '+1234567890', content: 'Your verification code is: 123456' },
      { from: '+9876543210', content: 'Welcome! Your account has been created successfully.' },
      { from: '+5555555555', content: 'Your OTP is 789012. Valid for 5 minutes.' },
    ];
    
    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const newMessage: Message = {
      id: Date.now().toString(),
      from: randomMessage.from,
      content: randomMessage.content,
      receivedAt: new Date()
    };
    
    setMessages(prev => [newMessage, ...prev]);
  };

  const copyToClipboard = async () => {
    if (generatedNumber) {
      await navigator.clipboard.writeText(generatedNumber.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExpired = () => {
    setGeneratedNumber(null);
    setMessages([]);
  };

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Generator Card */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Phone className="h-6 w-6" />
            Generate Phone Number
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Country
              </label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.prefix})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateNumber} 
              disabled={isGenerating}
              className="w-full sm:w-auto px-8"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Temporary Number</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-2xl font-mono font-bold text-gray-900">
                  {generatedNumber.number}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedCountryData?.name} ({selectedCountryData?.prefix})
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="ml-4"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            
            <CountdownTimer 
              expiresAt={generatedNumber.expiresAt} 
              onExpired={handleExpired}
            />
            
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>Note:</strong> This number can only receive SMS messages, not phone calls. 
              All messages will be displayed below.
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
