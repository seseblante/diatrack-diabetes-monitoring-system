import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { ClinicianMessaging } from './ClinicianMessaging';
import { ClinicianClinicSchedule } from './ClinicianClinicSchedule';
import { ClinicSettings } from './ClinicSettings';
import { ClinicianAppointments } from './ClinicianAppointments';
import { 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Users,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  User,
  Phone,
  Mail,
  X,
  BookOpen,
  MessageSquare,
  MapPin,
  Settings
} from 'lucide-react';

interface ClinicianDashboardProps {
  onLogout: () => void;
}

export function ClinicianDashboard({ onLogout }: ClinicianDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showClinicSchedule, setShowClinicSchedule] = useState(false);
  const [showClinicSettings, setShowClinicSettings] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  
  // Ref to store scroll position
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef<number>(0);

  // Save scroll position before navigating away
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !showMessaging && !showClinicSchedule && !showClinicSettings && !showAppointments) {
      // Restore scroll position when coming back
      container.scrollTop = savedScrollPosition.current;
    }
  }, [showMessaging, showClinicSchedule, showClinicSettings, showAppointments]);

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: 'Sheianne Seblante',
      age: 45,
      lastReading: 110,
      lastReadingTime: '15 min ago',
      timeInRange: 68,
      trend: 'stable',
      phone: '(555) 123-4567',
      email: 'sheianne.s@email.com',
      nextAppointment: '2025-10-05',
      recentReadings: [125, 180, 110, 118, 122],
      alerts: ['High reading after lunch'],
      notes: 'Patient reports stress at work affecting readings'
    },
    {
      id: 2,
      name: 'Jose Reyes',
      age: 62,
      lastReading: 95,
      lastReadingTime: '30 min ago',
      timeInRange: 85,
      trend: 'stable',
      phone: '(555) 234-5678',
      email: 'jose.r@email.com',
      nextAppointment: '2025-10-12',
      recentReadings: [98, 95, 102, 89, 94],
      alerts: [],
      notes: 'Excellent adherence to medication schedule'
    },
    {
      id: 3,
      name: 'Arianne Acosta',
      age: 38,
      lastReading: 250,
      lastReadingTime: '45 min ago',
      timeInRange: 45,
      trend: 'up',
      phone: '(555) 345-6789',
      email: 'arianne.a@email.com',
      nextAppointment: '2025-10-03',
      recentReadings: [220, 250, 190, 280, 245],
      alerts: ['Frequent high readings', 'Missed multiple medications', 'Low time in range'],
      notes: 'Needs medication adjustment and counseling'
    },
    {
      id: 4,
      name: 'Joy Arellano',
      age: 55,
      lastReading: 120,
      lastReadingTime: '1 hour ago',
      timeInRange: 72,
      trend: 'stable',
      phone: '(555) 456-7890',
      email: 'joy.a@email.com',
      nextAppointment: '2025-10-15',
      recentReadings: [115, 120, 125, 118, 122],
      alerts: [],
      notes: 'Stable readings, good progress'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case 'stable': return <div className="w-4 h-4 border-t-2 border-green-500" />;
      default: return null;
    }
  };

  const filteredPatients = patients
    .filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  const PatientDetailModal = ({ patient }: { patient: any }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-[375px] h-[700px] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl">
        {/* Handle bar for swipe indication */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold">{patient.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-600">Age {patient.age} • ID #{patient.id}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedPatient(null)}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        <div className="px-6 pb-8 overflow-y-auto hide-scrollbar" style={{ maxHeight: 'calc(700px - 180px)' }}>

          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <User className="w-6 h-6 text-blue-600" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-16 justify-start text-left rounded-xl border-2 hover:bg-blue-50"
                >
                  <Phone className="w-6 h-6 mr-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{patient.phone}</div>
                    <div className="text-sm text-gray-500">Tap to call</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-16 justify-start text-left rounded-xl border-2 hover:bg-green-50"
                >
                  <Mail className="w-6 h-6 mr-4 text-green-600" />
                  <div>
                    <div className="font-medium">{patient.email}</div>
                    <div className="text-sm text-gray-500">Send email</div>
                  </div>
                </Button>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="font-medium">Next appointment</div>
                    <div className="text-sm text-gray-600">{patient.nextAppointment}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-purple-600" />
                  <span>Current Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  <Card className="bg-gradient-to-r from-red-50 to-rose-100 border-red-200">
                    <CardContent className="pt-6 text-center">
                      <div className="text-5xl font-bold text-red-600">{patient.lastReading}</div>
                      <p className="text-lg font-medium text-red-800 mt-2">Last Reading</p>
                      <p className="text-sm text-red-600">{patient.lastReadingTime}</p>
                      {getTrendIcon(patient.trend)}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-50 to-cyan-100 border-blue-200">
                    <CardContent className="pt-6 text-center">
                      <div className="text-5xl font-bold text-blue-600">{patient.timeInRange}%</div>
                      <p className="text-lg font-medium text-blue-800 mt-2">Time in Range</p>
                      <Progress value={patient.timeInRange} className="w-full h-4 mt-4" />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            {patient.alerts.length > 0 && (
              <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-red-800 flex items-center space-x-2">
                    <AlertTriangle className="w-6 h-6" />
                    <span>Active Alerts ({patient.alerts.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patient.alerts.map((alert: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-red-200">
                        <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-lg text-red-700 font-medium">{alert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clinical Notes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  <span>Clinical Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-xl border">
                  <p className="text-lg text-gray-800 leading-relaxed">{patient.notes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-4">
              <Button className="h-18 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg">
                <Download className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="text-lg font-semibold">Export Report</div>
                  <div className="text-sm opacity-90">Generate PDF for patient</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-18 border-2 rounded-xl shadow-lg hover:bg-indigo-50"
                onClick={() => {
                  setSelectedPatient(null);
                  setShowMessaging(true);
                }}
              >
                <MessageSquare className="w-6 h-6 mr-3 text-indigo-600" />
                <div className="text-left">
                  <div className="text-lg font-semibold">Send Message</div>
                  <div className="text-sm text-gray-500">Quick patient message</div>
                </div>
              </Button>
              <Button variant="outline" className="h-18 border-2 rounded-xl shadow-lg hover:bg-green-50">
                <Phone className="w-6 h-6 mr-3 text-green-600" />
                <div className="text-left">
                  <div className="text-lg font-semibold">Call Patient</div>
                  <div className="text-sm text-gray-500">Direct phone call</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If messaging is open, show it fullscreen
  if (showMessaging) {
    return <ClinicianMessaging onBack={() => setShowMessaging(false)} />;
  }

  // If clinic schedule is open, show it fullscreen
  if (showClinicSchedule) {
    return <ClinicianClinicSchedule onClose={() => setShowClinicSchedule(false)} />;
  }

  // If clinic settings is open, show it fullscreen
  if (showClinicSettings) {
    return <ClinicSettings onClose={() => setShowClinicSettings(false)} />;
  }

  // If appointments is open, show it fullscreen
  if (showAppointments) {
    return <ClinicianAppointments onClose={() => setShowAppointments(false)} />;
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden pt-11">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-4 flex-shrink-0">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Patient Dashboard</h1>
              <p className="text-sm text-gray-500">Wednesday, October 1, 2025</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setShowMessaging(true)}
                variant="outline" 
                size="sm"
                className="relative"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Messages
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm">
                Sign Out
              </Button>
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
      </header>

      {/* Summary Stats */}
      <div className="flex-1 overflow-y-auto px-4 py-6" ref={scrollContainerRef}>
        <div className="mb-6">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
            <CardContent className="pt-4 pb-4">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
              <p className="text-xs text-blue-700">Total Patients</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Patient Roster</CardTitle>
            <CardDescription>
              Tap a patient to view detailed information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="p-4 rounded-xl border bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">Age {patient.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold">{patient.lastReading}</span>
                      {getTrendIcon(patient.trend)}
                    </div>
                    <p className="text-xs text-gray-500">{patient.lastReadingTime}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{patient.timeInRange}%</div>
                    <p className="text-xs text-gray-500">Time in Range</p>
                  </div>
                </div>

                {patient.alerts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600 font-medium">
                        {patient.alerts.length} active alert{patient.alerts.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6 shadow-lg border-2 border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2 rounded-xl border-2 hover:bg-purple-50 hover:border-purple-300"
              >
                <Download className="w-7 h-7 text-purple-600" />
                <span className="font-medium">Export</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2 rounded-xl border-2 hover:bg-indigo-50 hover:border-indigo-300"
                onClick={() => {
                  if (scrollContainerRef.current) {
                    savedScrollPosition.current = scrollContainerRef.current.scrollTop;
                  }
                  setShowAppointments(true);
                }}
              >
                <Calendar className="w-7 h-7 text-indigo-600" />
                <span className="font-medium">Appointments</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => {
                  if (scrollContainerRef.current) {
                    savedScrollPosition.current = scrollContainerRef.current.scrollTop;
                  }
                  setShowClinicSchedule(true);
                }}
              >
                <Clock className="w-7 h-7 text-blue-600" />
                <span className="font-medium text-center text-sm">My Clinic<br/>Schedule</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2 rounded-xl border-2 hover:bg-green-50 hover:border-green-300"
                onClick={() => {
                  if (scrollContainerRef.current) {
                    savedScrollPosition.current = scrollContainerRef.current.scrollTop;
                  }
                  setShowClinicSettings(true);
                }}
              >
                <Settings className="w-7 h-7 text-green-600" />
                <span className="font-medium text-center text-sm">Clinic<br/>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && <PatientDetailModal patient={selectedPatient} />}
    </div>
  );
}