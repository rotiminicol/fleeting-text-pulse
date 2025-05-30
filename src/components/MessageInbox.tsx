
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Inbox } from 'lucide-react';

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
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Inbox className="h-6 w-6 text-purple-600" />
            <span className="text-xl text-gray-800">SMS Inbox</span>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-4 py-1">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium mb-2">No messages yet</p>
            <p className="text-lg">SMS messages will appear here when received</p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                💡 Tip: Messages typically arrive within 5-10 seconds after generation
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-6 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:border-blue-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-lg font-semibold text-gray-900">
                      From: {message.from_number}
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {formatTime(message.received_at)}
                    </div>
                  </div>
                  <div className="text-gray-700 text-lg leading-relaxed break-words">
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageInbox;
