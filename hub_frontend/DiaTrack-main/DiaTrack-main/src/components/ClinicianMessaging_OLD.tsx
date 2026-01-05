import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, User, Send, Clock, Check, Search } from 'lucide-react';
import { Input } from './ui/input';

interface Patient {
  id: number;
  name: string;
  lastSent?: string;
  lastSentTimestamp?: number;
}

interface Message {
  id: number;
  patientId: number;
  content: string;
  timestamp: string;
  date: string;
  read: boolean;
}

interface ClinicianMessagingProps {
  onBack: () => void;
}

export function ClinicianMessaging({ onBack }: ClinicianMessagingProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock patients list with last sent times
  const patientsData: Patient[] = [
    {
      id: 1,
      name: 'Sheianne Seblante',
      lastSent: '10 min ago',
      lastSentTimestamp: Date.now() - 10 * 60 * 1000
    },
    {
      id: 2,
      name: 'Jose Reyes',
      lastSent: '2 hours ago',
      lastSentTimestamp: Date.now() - 2 * 60 * 60 * 1000
    },
    {
      id: 3,
      name: 'Arianne Acosta',
      lastSent: 'Yesterday',
      lastSentTimestamp: Date.now() - 24 * 60 * 60 * 1000
    },
    {
      id: 4,
      name: 'Joy Arellano'
      // No messages sent yet
    }
  ];

  // Sort patients by ID number and filter by search term
  const patients = [...patientsData]
    .filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  // Pre-defined quick messages
  const quickMessageTemplates = [
    {
      category: 'Positive Reinforcement',
      icon: '🌟',
      color: 'from-green-50 to-emerald-100 border-green-200',
      messages: [
        'Great job with your readings!',
        'Excellent work this week!',
        'Keep up the good work!',
        'You\'re doing amazing!'
      ]
    },
    {
      category: 'Reminders',
      icon: '⏰',
      color: 'from-blue-50 to-cyan-100 border-blue-200',
      messages: [
        'Check your glucose today',
        'Time for your medication',
        'Log your meals today',
        'Monitor your levels'
      ]
    },
    {
      category: 'Appointments',
      icon: '📅',
      color: 'from-purple-50 to-violet-100 border-purple-200',
      messages: [
        'Looking forward to your visit',
        'Bring your glucose meter',
        'Follow-up scheduled next week'
      ]
    },
    {
      category: 'Diet & Lifestyle',
      icon: '🥗',
      color: 'from-orange-50 to-amber-100 border-orange-200',
      messages: [
        'Drink more water today',
        'Add veggies to your meals',
        'Walk after meals',
        'Stay hydrated'
      ]
    },
    {
      category: 'Medication',
      icon: '💊',
      color: 'from-pink-50 to-rose-100 border-pink-200',
      messages: [
        'Take meds same time daily',
        'Report any side effects',
        'Prescription ready for pickup',
        'Continue current dosage'
      ]
    },
    {
      category: 'Check-In',
      icon: '🩺',
      color: 'from-indigo-50 to-blue-100 border-indigo-200',
      messages: [
        'How are you feeling?',
        'Let\'s discuss at next visit',
        'Levels looking good!',
        'Keep monitoring'
      ]
    }
  ];

  // Mock messages for selected patient
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      patientId: 1,
      content: 'Great job with your readings!',
      timestamp: '2:30 PM',
      date: 'Today',
      read: true
    },
    {
      id: 2,
      patientId: 1,
      content: 'Check your glucose today',
      timestamp: '10:15 AM',
      date: 'Today',
      read: true
    },
    // {
    //   id: 3,
    //   patientId: 1,
    //   content: 'See you Oct 15 at 2PM',
    //   timestamp: '4:45 PM',
    //   date: 'Yesterday',
    //   read: true
    // }
  ]);

  const handleSendQuickMessage = (messageContent: string) => {
    if (!selectedPatient) return;

    const newMessage: Message = {
      id: Date.now(),
      patientId: selectedPatient.id,
      content: messageContent,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      date: 'Today',
      read: false
    };

    setMessages([newMessage, ...messages]);
    setShowQuickMessages(false);
  };

  // Quick Messages Selection View
  if (showQuickMessages && selectedPatient) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col pt-11">
        {/* Header */}
        <div className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQuickMessages(false)}
              className="rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h2 className="font-semibold">Send Quick Message</h2>
              <p className="text-sm text-gray-500">To: {selectedPatient.name}</p>
            </div>
          </div>
        </div>

        {/* Quick Messages Categories */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-4">
            {quickMessageTemplates.map((category, categoryIndex) => (
              <Card key={categoryIndex} className={`border-0 shadow-md bg-gradient-to-r ${category.color}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span>{category.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.messages.map((message, messageIndex) => (
                    <Button
                      key={messageIndex}
                      variant="outline"
                      className="w-full justify-start h-auto py-4 text-left bg-white hover:bg-gray-50 border-2"
                      onClick={() => handleSendQuickMessage(message)}
                    >
                      <div className="flex items-start space-x-2 w-full">
                        <Send className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
                        <p className="text-sm leading-relaxed break-words flex-1">{message}</p>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Patient Message History View
  if (selectedPatient) {
    const patientMessages = messages.filter(m => m.patientId === selectedPatient.id);

    return (
      <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col pt-11">
        {/* Header */}
        <div className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedPatient(null)}
              className="rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Avatar className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600">
              <AvatarFallback className="bg-transparent text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{selectedPatient.name}</h2>
              <p className="text-xs text-gray-500">Patient Messages</p>
            </div>
          </div>
          <Button
            onClick={() => setShowQuickMessages(true)}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl h-10"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>

        {/* Messages History */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          {patientMessages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No messages sent yet</p>
              <p className="text-sm text-gray-400">
                Use the Send button above to send a quick message
              </p>
            </div>
          )}

          {patientMessages.length > 0 && (
            <div className="space-y-3">
              {patientMessages.map((message) => (
                <Card key={message.id} className="border-0 shadow-md bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">{message.date} · {message.timestamp}</span>
                      </div>
                      {message.read ? (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300 flex-shrink-0">
                          <Check className="w-3 h-3 mr-1" />
                          Read
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300 flex-shrink-0">
                          Sent
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-800 leading-relaxed break-words">{message.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Patients List View
  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col pt-11">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Quick Messages</h1>
            <p className="text-xs text-gray-500">Send pre-defined messages to patients</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-3">
          {patients.map((patient) => (
            <Card
              key={patient.id}
              className="cursor-pointer hover:shadow-lg transition-all border-0 bg-white"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0">
                    <AvatarFallback className="bg-transparent text-white">
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border-gray-300">
                        ID: {patient.id}
                      </Badge>
                    </div>
                    {patient.lastSent && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500">Last sent: {patient.lastSent}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-indigo-50 border-indigo-200 mt-4">
          <CardContent className="p-4">
            <p className="text-sm text-indigo-800 text-center">
              💬 Select a patient to send them a quick message
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}