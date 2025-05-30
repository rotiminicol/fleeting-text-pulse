
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Inbox } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  content: string;
  receivedAt: Date;
}

interface MessageInboxProps {
  messages: Message[];
}

const MessageInbox: React.FC<MessageInboxProps> = ({ messages }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Messages
          </div>
          <Badge variant="secondary">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">SMS messages will appear here when received</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">
                      From: {message.from}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(message.receivedAt)}
                    </div>
                  </div>
                  <div className="text-gray-700 break-words">
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
