import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { ClinicianMessaging } from './ClinicianMessaging';
import { ClinicianClinicSchedule } from './ClinicianClinicSchedule';
import { ClinicSettings } from './ClinicSettings';
import { ClinicianAppointments } from './ClinicianAppointments';
import { ClinicianMedicationManagement } from './ClinicianMedicationManagement';
import { PatientLinkManagement } from './PatientLinkManagement';
import { getCurrentUser } from '../api/auth';
import { getClinicianPatients, getClinicianNotes, createClinicianNote, type PatientClinicianLink, type ClinicianNote } from '../api/clinician';
import { getGlucoseReadings, type GlucoseReading } from '../api/glucose';
import { getAlerts, type Alert } from '../api/alerts';
import { getSymptomLogs, type SymptomNote } from '../api/symptoms';
import { downloadPatientReportPdf, exportPatientReportPdf } from '../api/export';
import { getPatientProfile } from '../api/patient';
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
  Settings,
  Pill,
  UserPlus,
  Stethoscope
} from 'lucide-react';

interface ClinicianDashboardProps {
  onLogout: () => void;
}

interface PatientData extends PatientClinicianLink {
  lastReading?: number;
  lastReadingTime?: string;
  timeInRange?: number;
  trend?: 'up' | 'down' | 'stable';
  recentReadings?: number[];
  alerts?: Alert[];
  notes?: string;
  phone?: string;
  email?: string;
  symptoms?: SymptomNote[];
}

export function ClinicianDashboard({ onLogout }: ClinicianDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showClinicSchedule, setShowClinicSchedule] = useState(false);
  const [showClinicSettings, setShowClinicSettings] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showMedicationManagement, setShowMedicationManagement] = useState(false);
  const [showPatientLinkManagement, setShowPatientLinkManagement] = useState(false);
  const [medicationPatient, setMedicationPatient] = useState<PatientData | null>(null);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [patientNotes, setPatientNotes] = useState<Record<string, string>>({});
  
  // Ref to store scroll position
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef<number>(0);

  // Fetch current user and patients
  const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        if (user?.id) {
          // Fetch patients linked to this clinician
          const patientLinks = await getClinicianPatients(user.id);
          
          // Fetch additional data for each patient
          const patientsWithData = await Promise.all(
            patientLinks.map(async (link) => {
              try {
                // Fetch glucose readings
                const readings = await getGlucoseReadings(link.patientId);
                const sortedReadings = readings.sort((a: GlucoseReading, b: GlucoseReading) => 
                  new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
                );
                
                // Fetch alerts
                const alerts = await getAlerts(link.patientId);
                
                // Fetch symptoms
                let symptoms: SymptomNote[] = [];
                try {
                  symptoms = await getSymptomLogs(link.patientId);
                } catch (err) {
                  console.error('Error fetching symptoms:', err);
                }
                
                // Fetch notes
                const notes = await getClinicianNotes(link.id);
                const latestNote = notes.length > 0 ? notes[notes.length - 1].noteText : '';
                
                // Fetch patient profile for phone/email
                let patientPhone = 'N/A';
                let patientEmail = 'N/A';
                try {
                  const patientProfile = await getPatientProfile(link.patientId);
                  patientPhone = patientProfile.phone || 'N/A';
                  patientEmail = patientProfile.email || 'N/A';
                } catch (err) {
                  console.error('Error fetching patient profile:', err);
                }
                
                // Calculate stats
                const lastReading = sortedReadings[0]?.valueMgdl;
                const lastReadingTime = sortedReadings[0] ? getTimeAgo(sortedReadings[0].measuredAt) : 'N/A';
                const recentReadings = sortedReadings.slice(0, 5).map((r: GlucoseReading) => r.valueMgdl);
                
                // Calculate time in range (70-180 mg/dL)
                const inRangeCount = readings.filter((r: GlucoseReading) => r.valueMgdl >= 70 && r.valueMgdl <= 180).length;
                const timeInRange = readings.length > 0 ? Math.round((inRangeCount / readings.length) * 100) : 0;
                
                // Determine trend
                let trend: 'up' | 'down' | 'stable' = 'stable';
                if (recentReadings.length >= 2) {
                  const avg1 = recentReadings.slice(0, 2).reduce((a: number, b: number) => a + b, 0) / 2;
                  const avg2 = recentReadings.slice(2, 4).reduce((a: number, b: number) => a + b, 0) / 2;
                  if (avg1 > avg2 + 20) trend = 'up';
                  else if (avg1 < avg2 - 20) trend = 'down';
                }
                
                return {
                  ...link,
                  lastReading,
                  lastReadingTime,
                  timeInRange,
                  trend,
                  recentReadings,
                  alerts,
                  notes: latestNote,
                  phone: patientPhone,
                  email: patientEmail,
                  symptoms,
                } as PatientData;
              } catch (error) {
                console.error(`Error fetching data for patient ${link.patientId}:`, error);
                return {
                  ...link,
                  lastReading: 0,
                  lastReadingTime: 'N/A',
                  timeInRange: 0,
                  trend: 'stable' as const,
                  recentReadings: [],
                  alerts: [],
                  notes: '',
                  phone: 'N/A',
                  email: 'N/A',
                  symptoms: [],
                } as PatientData;
              }
            })
          );
          
          setPatients(patientsWithData);
        }
      } catch (error) {
        console.error('Error fetching clinician data:', error);
      } finally {
        setIsLoading(false);
      }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Refetch data when returning from sub-views
  useEffect(() => {
    if (!showMessaging && !showClinicSchedule && !showClinicSettings && !showAppointments && !showMedicationManagement && !showPatientLinkManagement) {
      fetchData();
    }
  }, [showMessaging, showClinicSchedule, showClinicSettings, showAppointments, showMedicationManagement, showPatientLinkManagement]);

  // Save scroll position before navigating away
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !showMessaging && !showClinicSchedule && !showClinicSettings && !showAppointments) {
      // Restore scroll position when coming back
      container.scrollTop = savedScrollPosition.current;
    }
  }, [showMessaging, showClinicSchedule, showClinicSettings, showAppointments]);
  
  // Helper function to calculate time ago
  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    return patients
      .filter(patient =>
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.patientName.localeCompare(b.patientName));
  }, [patients, searchTerm]);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case 'stable': return <div className="w-4 h-4 border-t-2 border-green-500" />;
      default: return null;
    }
  };

  const PatientDetailModal = ({ patient }: { patient: PatientData }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-[375px] h-[700px] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl">
        {/* Handle bar for swipe indication */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold">{patient.patientName}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-600">Patient ID: {patient.patientId.substring(0, 8)}...</span>
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
                  onClick={() => {
                    if (patient.phone && patient.phone !== 'N/A') {
                      window.location.href = `tel:${patient.phone}`;
                    }
                  }}
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
                  onClick={() => {
                    if (patient.email && patient.email !== 'N/A') {
                      window.location.href = `mailto:${patient.email}`;
                    }
                  }}
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
                    <div className="text-sm text-gray-600">
                      {patient.nextAppointmentAt 
                        ? new Date(patient.nextAppointmentAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Not scheduled'}
                    </div>
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
                      <div className="text-5xl font-bold text-red-600">{patient.lastReading || 'N/A'}</div>
                      <p className="text-lg font-medium text-red-800 mt-2">Last Reading</p>
                      <p className="text-sm text-red-600">{patient.lastReadingTime || 'N/A'}</p>
                      {getTrendIcon(patient.trend)}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-50 to-cyan-100 border-blue-200">
                    <CardContent className="pt-6 text-center">
                      <div className="text-5xl font-bold text-blue-600">{patient.timeInRange || 0}%</div>
                      <p className="text-lg font-medium text-blue-800 mt-2">Time in Range</p>
                      <Progress value={patient.timeInRange || 0} className="w-full h-4 mt-4" />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className={`shadow-lg ${patient.alerts && patient.alerts.length > 0 ? 'border-red-200 bg-gradient-to-r from-red-50 to-rose-100' : ''}`}>
              <CardHeader>
                <CardTitle className={`text-xl flex items-center space-x-2 ${patient.alerts && patient.alerts.length > 0 ? 'text-red-800' : 'text-gray-700'}`}>
                  <AlertTriangle className="w-6 h-6" />
                  <span>Active Alerts ({patient.alerts?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.alerts && patient.alerts.length > 0 ? (
                  <div className="space-y-3">
                    {patient.alerts.map((alert: Alert, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-red-200">
                        <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-lg text-red-700 font-medium">{alert.message}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <p className="text-lg text-gray-500 text-center">No active alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>

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
                  <p className="text-lg text-gray-800 leading-relaxed">{patient.notes || 'No notes available'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <Stethoscope className="w-6 h-6 text-purple-600" />
                  <span>Recent Symptoms ({patient.symptoms?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.symptoms && patient.symptoms.length > 0 ? (
                  <div className="space-y-3">
                    {patient.symptoms.slice(0, 5).map((symptom: SymptomNote, index: number) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-purple-900">{symptom.symptom}</h4>
                          <span className="text-sm text-purple-600">
                            {new Date(symptom.occurredAt).toLocaleDateString()}
                          </span>
                        </div>
                        {symptom.notes && (
                          <p className="text-sm text-purple-700">{symptom.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <p className="text-lg text-gray-500 text-center">No symptoms reported</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-4">
              <Button 
                className="h-18 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg"
                onClick={async () => {
                  if (selectedPatient) {
                    try {
                      await downloadPatientReportPdf(selectedPatient.patientId, `${selectedPatient.patientName}_report.pdf`);
                    } catch (error) {
                      console.error('Error downloading report:', error);
                      alert('Export functionality is not yet fully implemented on the backend. Please try again later.');
                    }
                  }
                }}
              >
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
              <Button 
                variant="outline" 
                className="h-18 border-2 rounded-xl shadow-lg hover:bg-green-50"
                onClick={() => {
                  if (patient.phone && patient.phone !== 'N/A') {
                    window.location.href = `tel:${patient.phone}`;
                  } else {
                    alert('Phone number not available for this patient');
                  }
                }}
              >
                <Phone className="w-6 h-6 mr-3 text-green-600" />
                <div className="text-left">
                  <div className="text-lg font-semibold">Call Patient</div>
                  <div className="text-sm text-gray-500">Direct phone call</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-18 border-2 rounded-xl shadow-lg hover:bg-orange-50"
                onClick={() => {
                  setMedicationPatient(patient);
                  setSelectedPatient(null);
                  setShowMedicationManagement(true);
                }}
              >
                <Pill className="w-6 h-6 mr-3 text-orange-600" />
                <div className="text-left">
                  <div className="text-lg font-semibold">Manage Medications</div>
                  <div className="text-sm text-gray-500">View and edit prescriptions</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If medication management is open, show it fullscreen
  if (showMedicationManagement && medicationPatient) {
    return <ClinicianMedicationManagement 
      patientId={medicationPatient.patientId}
      patientName={medicationPatient.patientName}
      onClose={() => {
        setShowMedicationManagement(false);
        setMedicationPatient(null);
      }}
    />;
  }

  // If patient link management is open, show it fullscreen
  if (showPatientLinkManagement && currentUser) {
    return <PatientLinkManagement 
      clinicianId={currentUser.id}
      onClose={() => setShowPatientLinkManagement(false)}
    />;
  }

  // If messaging is open, show it fullscreen
  if (showMessaging) {
    return <ClinicianMessaging onBack={() => setShowMessaging(false)} />;
  }

  // If clinic schedule is open, show it fullscreen
  if (showClinicSchedule) {
    return <ClinicianClinicSchedule 
      onClose={() => setShowClinicSchedule(false)} 
      onNavigateToSettings={() => {
        setShowClinicSchedule(false);
        setShowClinicSettings(true);
      }}
    />;
  }

  // If clinic settings is open, show it fullscreen
  if (showClinicSettings) {
    return <ClinicSettings onClose={() => setShowClinicSettings(false)} />;
  }

  // If appointments is open, show it fullscreen
  if (showAppointments) {
    return <ClinicianAppointments onClose={() => setShowAppointments(false)} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden pt-11">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-4 flex-shrink-0">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Patient Dashboard</h1>
              <p className="text-sm text-gray-500">{today}</p>
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
                      <h3 className="font-medium text-gray-900">{patient.patientName}</h3>
                      <p className="text-sm text-gray-500">ID: {patient.patientId.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold">{patient.lastReading || 'N/A'}</span>
                      {getTrendIcon(patient.trend)}
                    </div>
                    <p className="text-xs text-gray-500">{patient.lastReadingTime || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{patient.timeInRange || 0}%</div>
                    <p className="text-xs text-gray-500">Time in Range</p>
                  </div>
                </div>

                {patient.alerts && patient.alerts.length > 0 && (
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
                onClick={() => setShowPatientLinkManagement(true)}
              >
                <UserPlus className="w-7 h-7 text-purple-600" />
                <span className="font-medium text-center text-sm">Link<br/>Patients</span>
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