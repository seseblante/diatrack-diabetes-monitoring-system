import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Stethoscope, Clock, Check } from 'lucide-react';
import { getCurrentUser } from '../api/auth';
import { getMessages, markMessagesAsRead, QuickMessage } from '../api/messages';
import { getPatientClinicians, PatientClinicianLink } from '../api/patient';

interface PatientMessagingProps {
  onBack: () => void;
}

export function PatientMessaging({ onBack }: PatientMessagingProps) {
  const currentUser = getCurrentUser();
  const [messages, setMessages] = useState<QuickMessage[]>([]);
  const [clinicianLinks, setClinicianLinks] = useState<PatientClinicianLink[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<QuickMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;
      
      try {
        // Fetch clinician links first
        const links = await getPatientClinicians(currentUser.id);
        setClinicianLinks(links);
        
        // Fetch messages if there are clinician links
        if (links.length > 0) {
          const msgs = await getMessages(links[0].id);
          setMessages(msgs);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser?.id]);
  
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  // Format time helper
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleMessageClick = async (message: QuickMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if not already read
    if (!message.readAt && clinicianLinks.length > 0) {
      try {
        const updatedMessages = await markMessagesAsRead(clinicianLinks[0].id);
        setMessages(updatedMessages);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const unreadCount = messages.filter(m => !m.readAt).length;
  
  // Get clinician name for a message
  const getClinicianName = (message: QuickMessage) => {
    const link = clinicianLinks.find(l => l.id === message.patientClinicianLinkId);
    return link?.clinicianName || 'Doctor';
  };

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
              <h2 className="font-semibold">{getClinicianName(selectedMessage)}</h2>
              <p className="text-xs text-gray-500">Your Healthcare Provider</p>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <Card className="bg-white shadow-md border-0">
            <CardContent className="p-6">
              <p className="text-lg text-gray-800 leading-relaxed break-words">
                {selectedMessage.messageContent}
              </p>
              <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{formatDate(selectedMessage.createdAt)} at {formatTime(selectedMessage.createdAt)}</span>
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

  if (isLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
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
                !message.isRead ? 'border-2 border-blue-300 bg-blue-50' : 'bg-white border-0'
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
                        {getClinicianName(message)}
                      </h3>
                      {!message.readAt ? (
                        <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">New</Badge>
                      ) : (
                        <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2 break-words">
                      {message.messageContent}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="whitespace-nowrap">{formatDate(message.createdAt)} · {formatTime(message.createdAt)}</span>
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