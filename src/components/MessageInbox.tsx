
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, User } from 'lucide-react';

interface Message {
  id: string;
  from_number: string;
  content: string;
  received_at: string;
}

interface MessageInboxProps {
  messages: Message[];
}

const MessageInbox: React.FC<MessageInboxProps> = ({ messages }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-orange-50 to-yellow-50">
      <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-t-lg text-white">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <MessageSquare className="h-7 w-7" />
          SMS Inbox
          <Badge variant="outline" className="bg-white text-orange-600 border-white font-bold">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages yet</h3>
            <p className="text-gray-500">
              Messages will appear here when they arrive. You'll typically receive a verification message within a few seconds.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className="p-4 bg-gradient-to-r from-white to-orange-50 rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-orange-600 font-semibold">
                    <User className="h-4 w-4" />
                    From: {message.from_number}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {formatTime(message.received_at)}
                  </div>
                </div>
                <div className="text-gray-800 bg-white p-3 rounded-lg border border-orange-100 font-medium">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageInbox;
