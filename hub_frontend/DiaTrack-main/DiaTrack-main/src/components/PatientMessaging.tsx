import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Stethoscope, Clock, Check } from 'lucide-react';

interface Message {
  id: number;
  clinicianName: string;
  content: string;
  timestamp: string;
  date: string;
  read: boolean;
}

interface PatientMessagingProps {
  onBack: () => void;
}

export function PatientMessaging({ onBack }: PatientMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      clinicianName: 'Dr. Maria Santos',
      content: 'Great job with your readings!',
      timestamp: '2:30 PM',
      date: 'Today',
      read: false
    },
    {
      id: 2,
      clinicianName: 'Dr. Maria Santos',
      content: 'Check your glucose today',
      timestamp: '10:15 AM',
      date: 'Today',
      read: false
    },
    {
      id: 3,
      clinicianName: 'Dr. Maria Santos',
      content: 'Excellent work this week!',
      timestamp: '4:45 PM',
      date: 'Yesterday',
      read: true
    },
    {
      id: 4,
      clinicianName: 'Dr. Maria Santos',
      content: 'See you Oct 15 at 2PM',
      timestamp: '9:30 AM',
      date: 'Oct 8',
      read: true
    },
    {
      id: 5,
      clinicianName: 'Dr. Maria Santos',
      content: 'Drink more water today',
      timestamp: '3:20 PM',
      date: 'Oct 7',
      read: true
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleMessageClick = (message: Message) => {
    // Mark as read
    setMessages(messages.map(m => 
      m.id === message.id ? { ...m, read: true } : m
    ));
    setSelectedMessage(message);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (selectedMessage) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col pt-11">
        {/* Header */}
        <div className="bg-white shadow-sm px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMessage(null)}
              className="rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600">
              <AvatarFallback className="bg-transparent text-white">
                <Stethoscope className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{selectedMessage.clinicianName}</h2>
              <p className="text-xs text-gray-500">Your Healthcare Provider</p>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <Card className="bg-white shadow-md border-0">
            <CardContent className="p-6">
              <p className="text-lg text-gray-800 leading-relaxed break-words">
                {selectedMessage.content}
              </p>
              <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{selectedMessage.date} at {selectedMessage.timestamp}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Footer */}
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-3">
          <p className="text-xs text-blue-700 text-center">
            💬 This is a message from your healthcare provider
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Messages</h1>
            <p className="text-xs text-gray-500">From your healthcare provider</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white h-6 min-w-6 rounded-full flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                !message.read ? 'border-2 border-blue-300 bg-blue-50' : 'bg-white border-0'
              }`}
              onClick={() => handleMessageClick(message)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 flex-shrink-0">
                    <AvatarFallback className="bg-transparent text-white">
                      <Stethoscope className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {message.clinicianName}
                      </h3>
                      {!message.read ? (
                        <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">New</Badge>
                      ) : (
                        <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2 break-words">
                      {message.content}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="whitespace-nowrap">{message.date} · {message.timestamp}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Messages from your healthcare provider will appear here
            </p>
          </div>
        )}

        {messages.length > 0 && (
          <Card className="bg-blue-50 border-blue-200 mt-4">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800 text-center">
                💡 Your doctor will send you quick messages here. Tap any message to read it.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}