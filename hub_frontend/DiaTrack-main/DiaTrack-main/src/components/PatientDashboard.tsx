import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { PatientMessaging } from './PatientMessaging';
import { PatientClinicSchedule } from './PatientClinicSchedule';
import { PatientMedicalProfile } from './PatientMedicalProfile';
import { EducationalResources } from './EducationalResources';
import { DataPrivacyPage } from './DataPrivacyPage';
import logoImage from '../assets/logoImage.png';
import { getCurrentUser } from '../api/auth';
import { getGlucoseReadings, logGlucoseReading, GlucoseReading, GlucoseContextType } from '../api/glucose';
import { getMealLogs, logMeal, Meal } from '../api/meals';
import { getMedicationRegimens, getMedicationLogs, logMedicationTaken, deleteMedicationLog, MedicationRegimen, MedicationLog } from '../api/medications';
import { getMessages, markMessagesAsRead, QuickMessage } from '../api/messages';
import { getPatientClinicians, PatientClinicianLink } from '../api/patient';
import { exportPatientReportPdf } from '../api/export';
import { logSymptom, getSymptomLogs, SymptomNote } from '../api/symptoms';
import { 
  Activity, 
  Heart, 
  Plus, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Utensils,
  Pill,
  BookOpen,
  Award,
  Home,
  BarChart3,
  User,
  Bell,
  Calendar,
  X,
  Droplets,
  Apple,
  Info,
  History as HistoryIcon,
  Menu as MenuIcon,
  FileText,
  MessageSquare,
  MapPin,
  Shield
} from 'lucide-react';

interface PatientDashboardProps {
  onLogout: () => void;
}

type MobileTab = 'home' | 'trends' | 'history' | 'menu';
type QuickLogType = 'glucose' | 'meal' | 'medication' | 'symptoms' | null;

// Normalize time string to HH:mm format (24-hour)
// Handles: "08:00", "08:00:00", "8:00 AM", "08:00 AM"
const normalizeTime = (timeStr: string): string => {
  // Remove any whitespace
  timeStr = timeStr.trim();
  
  // Check if it's 12-hour format (contains AM/PM)
  const has12HourFormat = /AM|PM/i.test(timeStr);
  
  if (has12HourFormat) {
    // Parse 12-hour format
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      
      // Convert to 24-hour
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }
  
  // Parse 24-hour format (with or without seconds)
  const match = timeStr.match(/(\d{1,2}):(\d{2})(:\d{2})?/);
  if (match) {
    const hours = match[1].padStart(2, '0');
    const minutes = match[2];
    return `${hours}:${minutes}`;
  }
  
  // Fallback: return as-is
  return timeStr;
};

interface QuickLogModalProps {
  quickLogType: QuickLogType;
  setQuickLogType: (type: QuickLogType) => void;
  glucoseValue: string;
  setGlucoseValue: (value: string) => void;
  glucoseContext: GlucoseContextType;
  setGlucoseContext: (context: GlucoseContextType) => void;
  mealDescription: string;
  setMealDescription: (value: string) => void;
  carbsValue: string;
  setCarbsValue: (value: string) => void;
  mealTime: string;
  setMealTime: (value: string) => void;
  symptomDescription: string;
  setSymptomDescription: (value: string) => void;
  symptomNotesInput: string;
  setSymptomNotesInput: (value: string) => void;
  medicationRegimens: MedicationRegimen[];
  medicationLogs: MedicationLog[];
  isLoading: boolean;
  currentUser: any;
  handleSaveGlucose: () => Promise<void>;
  handleSaveMeal: () => Promise<void>;
  handleLogMedication: (regimenId: string, scheduledTime: string) => Promise<void>;
  handleSaveSymptom: () => Promise<void>;
  formatDate: (isoString: string) => string;
  formatTime: (isoString: string) => string;
}

function QuickLogModal({
  quickLogType,
  setQuickLogType,
  glucoseValue,
  setGlucoseValue,
  glucoseContext,
  setGlucoseContext,
  mealDescription,
  setMealDescription,
  carbsValue,
  setCarbsValue,
  mealTime,
  setMealTime,
  symptomDescription,
  setSymptomDescription,
  symptomNotesInput,
  setSymptomNotesInput,
  medicationRegimens,
  medicationLogs,
  isLoading,
  currentUser,
  handleSaveGlucose,
  handleSaveMeal,
  handleLogMedication,
  handleSaveSymptom,
  formatDate,
  formatTime
}: QuickLogModalProps) {
  const mealTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const symptomTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const symptomNotesTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  if (!quickLogType) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" onClick={() => setQuickLogType(null)} />
      <div className="relative bg-white w-full max-w-[375px] rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl isolate transform-gpu z-10" onClick={(e: any) => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">
              {quickLogType === 'glucose' && '🩸 Blood Sugar'}
              {quickLogType === 'meal' && '🍽️ Log Meal'}
              {quickLogType === 'medication' && '💊 Medication'}
              {quickLogType === 'symptoms' && '📝 Symptoms'}
            </h2>
            <Button 
              variant="ghost" 
              onClick={() => setQuickLogType(null)}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        <div className="px-6 pb-8 overflow-y-auto max-h-[75vh] hide-scrollbar">

          {quickLogType === 'glucose' && (
            <div className="space-y-6">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                <CardContent className="pt-6 pb-6 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="text-gray-600">Enter your reading</div>
                    <div className="flex items-center justify-center space-x-4">
                      <Input 
                        type="text" 
                        placeholder="120"
                        value={glucoseValue}
                        onChange={(e) => setGlucoseValue(e.target.value)}
                        className="w-32 h-16 text-4xl text-center border-2 border-blue-300 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white shadow-lg"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoFocus
                      />
                      <span className="text-xl text-gray-700 font-medium">mg/dL</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-center text-gray-600 font-medium">When was this taken?</p>
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        variant="outline" 
                        className={`h-12 rounded-xl border-2 ${glucoseContext === 'Fasting' ? 'bg-blue-100 border-blue-400' : 'hover:bg-blue-50'}`}
                        onClick={() => setGlucoseContext('Fasting')}
                      >
                        Fasting
                      </Button>
                      <Button 
                        variant="outline" 
                        className={`h-12 rounded-xl border-2 ${glucoseContext === 'Before Meal' ? 'bg-blue-100 border-blue-400' : 'hover:bg-blue-50'}`}
                        onClick={() => setGlucoseContext('Before Meal')}
                      >
                        Before Meal
                      </Button>
                      <Button 
                        variant="outline" 
                        className={`h-12 rounded-xl border-2 ${glucoseContext === 'After Meal' ? 'bg-blue-100 border-blue-400' : 'hover:bg-blue-50'}`}
                        onClick={() => setGlucoseContext('After Meal')}
                      >
                        After Meal
                      </Button>
                      <Button 
                        variant="outline" 
                        className={`h-12 rounded-xl border-2 ${glucoseContext === 'Bedtime' ? 'bg-blue-100 border-blue-400' : 'hover:bg-blue-50'}`}
                        onClick={() => setGlucoseContext('Bedtime')}
                      >
                        Bedtime
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSaveGlucose}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg"
                    disabled={!glucoseValue || isLoading}
                  >
                    {isLoading ? '⏳ Saving...' : (glucoseValue ? `Save Reading: ${glucoseValue} mg/dL` : 'Enter Reading First')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {quickLogType === 'meal' && (
            <div className="space-y-6">
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
                <CardContent className="pt-6 pb-6 space-y-5">
                  <div>
                    <label className="block font-semibold mb-3 text-gray-800">What did you eat? 🍽️</label>
                    <textarea 
                      placeholder="e.g., Grilled chicken salad with vinaigrette, whole grain roll..."
                      dir="auto"
                      value={mealDescription}
                      onChange={(e) => setMealDescription(e.target.value)}
                      className="w-full h-20 p-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-white shadow-lg resize-none text-left"
                      style={{ unicodeBidi: 'plaintext' }}
                      spellCheck={false}
                      autoCorrect="off"
                      autoCapitalize="none"
                      ref={mealTextareaRef}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-semibold mb-2 text-gray-800">Carbs (grams) 🍞</label>
                    <Input 
                      type="text" 
                      placeholder="e.g., 45"
                      value={carbsValue}
                      onChange={(e) => setCarbsValue(e.target.value)}
                      className="h-12 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-300 bg-white shadow-lg"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-800">Time eaten 🕐</label>
                    <Input 
                      type="time" 
                      value={mealTime}
                      onChange={(e) => setMealTime(e.target.value)}
                      className="h-12 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-300 bg-white shadow-lg"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSaveMeal}
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg"
                    disabled={!mealDescription || isLoading}
                  >
                    {isLoading ? '⏳ Saving...' : (mealDescription ? '✅ Log This Meal' : 'Describe Your Meal First')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {quickLogType === 'medication' && (
            <div className="space-y-6">
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
                <CardContent className="pt-6 pb-6 space-y-5">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <Pill className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">Mark medications as taken</p>
                  </div>
                  
                  <div className="space-y-3">
                    {medicationRegimens.length > 0 ? (
                      (() => {
                        // Explode regimens: create one row per scheduled time
                        const explodedDoses: Array<{
                          regimenId: string;
                          medicationName: string;
                          doseAmount: number;
                          doseUnit: string;
                          scheduledTime: string;
                          isTaken: boolean;
                        }> = [];

                        medicationRegimens.forEach((regimen) => {
                          regimen.timesOfDay.forEach((time) => {
                            // Check if this specific dose was taken today
                            // Match by regimenId, date (Today), and scheduled time (normalized)
                            const normalizedScheduledTime = normalizeTime(time);
                            
                            const isTaken = medicationLogs.some(log => {
                              if (log.regimenId !== regimen.id) return false;
                              if (formatDate(log.takenAt) !== 'Today') return false;
                              
                              // Normalize the log's taken time to HH:mm format
                              const logDate = new Date(log.takenAt);
                              const logHours = logDate.getHours().toString().padStart(2, '0');
                              const logMinutes = logDate.getMinutes().toString().padStart(2, '0');
                              const normalizedLogTime = `${logHours}:${logMinutes}`;
                              
                              // Debug logging
                              console.log('Comparing:', normalizedLogTime, normalizedScheduledTime);
                              
                              // Match if times are equal (exact match)
                              return normalizedLogTime === normalizedScheduledTime;
                            });

                            explodedDoses.push({
                              regimenId: regimen.id,
                              medicationName: regimen.medicationName,
                              doseAmount: regimen.doseAmount,
                              doseUnit: regimen.doseUnit,
                              scheduledTime: time,
                              isTaken
                            });
                          });
                        });

                        // Sort by scheduled time
                        explodedDoses.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

                        return explodedDoses.map((dose, index) => {
                          // Format time for display (e.g., "08:00" -> "8:00 AM")
                          const formatScheduledTime = (time: string) => {
                            const [hours, minutes] = time.split(':').map(Number);
                            const period = hours >= 12 ? 'PM' : 'AM';
                            const displayHours = hours % 12 || 12;
                            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                          };

                          return (
                            <Button 
                              key={`${dose.regimenId}-${dose.scheduledTime}-${index}`}
                              variant="outline" 
                              className={`w-full h-16 justify-between text-left rounded-xl border-2 shadow-lg transition-all ${
                                dose.isTaken 
                                  ? 'bg-gray-100 border-gray-300 opacity-60 hover:opacity-70' 
                                  : 'border-purple-300 bg-white hover:bg-purple-50'
                              } cursor-pointer`}
                              onClick={() => handleLogMedication(dose.regimenId, dose.scheduledTime)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    dose.isTaken ? 'bg-gray-200' : 'bg-purple-100'
                                  }`}>
                                    <Pill className={`w-5 h-5 ${dose.isTaken ? 'text-gray-500' : 'text-purple-600'}`} />
                                  </div>
                                  <div className={`min-w-0 flex-1 ${dose.isTaken ? 'opacity-70' : ''}`}>
                                    <div className="font-semibold truncate">{dose.medicationName} ({formatScheduledTime(dose.scheduledTime)})</div>
                                    <div className="text-sm text-gray-500 truncate">{dose.doseAmount} {dose.doseUnit}</div>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                  {dose.isTaken ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                  ) : (
                                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                                  )}
                                </div>
                              </div>
                            </Button>
                          );
                        });
                      })()
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No medications found</p>
                        <p className="text-sm">Ask your doctor to add your medications</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {quickLogType === 'symptoms' && (
            <div className="space-y-6">
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg">
                <CardContent className="pt-6 pb-6 space-y-5">
                  <div>
                    <label className="block font-semibold mb-3 text-gray-800">How are you feeling? 💭</label>
                    <textarea 
                      placeholder="e.g., Feeling dizzy after lunch, slight headache, more tired than usual..."
                      dir="auto"
                      className="w-full h-24 p-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 bg-white shadow-lg resize-none text-left"
                      style={{ unicodeBidi: 'plaintext' }}
                      value={symptomDescription}
                      onChange={(e) => setSymptomDescription(e.target.value)}
                      spellCheck={false}
                      autoCorrect="off"
                      autoCapitalize="none"
                      ref={symptomTextareaRef}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-semibold mb-3 text-gray-800">Additional Notes (Optional)</label>
                    <textarea 
                      placeholder="Any additional details..."
                      dir="auto"
                      className="w-full h-20 p-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 bg-white shadow-lg resize-none text-left"
                      style={{ unicodeBidi: 'plaintext' }}
                      value={symptomNotesInput}
                      onChange={(e) => setSymptomNotesInput(e.target.value)}
                      spellCheck={false}
                      autoCorrect="off"
                      autoCapitalize="none"
                      ref={symptomNotesTextareaRef}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-800">Quick options:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="h-12 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 shadow-lg"
                        onClick={() => setSymptomDescription('Feeling tired')}
                      >
                        😴 Tired
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        className="h-12 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 shadow-lg"
                        onClick={() => setSymptomDescription('Feeling nauseous')}
                      >
                        🤢 Nauseous
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        className="h-12 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 shadow-lg"
                        onClick={() => setSymptomDescription('Feeling dizzy')}
                      >
                        😵‍💫 Dizzy
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        className="h-12 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 shadow-lg"
                        onClick={() => setSymptomDescription('Feeling unwell')}
                      >
                        🤒 Unwell
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-14 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-xl shadow-lg"
                    disabled={!symptomDescription || isLoading}
                    onClick={handleSaveSymptom}
                  >
                    {isLoading ? '⏳ Saving...' : '📝 Log Symptoms'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PatientDashboard({ onLogout }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [quickLogType, setQuickLogType] = useState<QuickLogType>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMedicalProfile, setShowMedicalProfile] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showClinicSchedule, setShowClinicSchedule] = useState(false);
  const [showEducationalResources, setShowEducationalResources] = useState(false);
  const [showDataPrivacy, setShowDataPrivacy] = useState(false);
  const [glucoseValue, setGlucoseValue] = useState('');
  const [glucoseContext, setGlucoseContext] = useState<GlucoseContextType>('Fasting');
  const [mealDescription, setMealDescription] = useState('');
  const [carbsValue, setCarbsValue] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [symptomDescription, setSymptomDescription] = useState('');
  const [symptomNotesInput, setSymptomNotesInput] = useState('');
  
  // Backend data state
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [medicationRegimens, setMedicationRegimens] = useState<MedicationRegimen[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [clinicianLinks, setClinicianLinks] = useState<PatientClinicianLink[]>([]);
  const [messages, setMessages] = useState<QuickMessage[]>([]);
  const [symptomNotes, setSymptomNotes] = useState<SymptomNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user
  const currentUser = getCurrentUser();

  // Fetch data from backend
  const fetchData = async () => {
    if (!currentUser?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First fetch clinician links to get the link ID for messages
      const clinicianLinksData = await getPatientClinicians(currentUser.id);
      setClinicianLinks(clinicianLinksData);
      
      // Then fetch other data in parallel
      const [glucoseData, mealsData, regimensData, logsData, symptomsData] = await Promise.all([
        getGlucoseReadings(currentUser.id),
        getMealLogs(currentUser.id),
        getMedicationRegimens(currentUser.id),
        getMedicationLogs(currentUser.id),
        getSymptomLogs(currentUser.id)
      ]);
      
      setGlucoseReadings(glucoseData);
      setMeals(mealsData);
      setMedicationRegimens(regimensData);
      setMedicationLogs(logsData);
      setSymptomNotes(symptomsData);
      
      // Fetch messages if there are clinician links
      if (clinicianLinksData.length > 0) {
        const messagesData = await getMessages(clinicianLinksData[0].id);
        setMessages(messagesData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [currentUser?.id]);

  // Refetch data when tab changes
  useEffect(() => {
    if (activeTab !== 'menu') {
      fetchData();
    }
  }, [activeTab]);

  // Get current date and time
  const getCurrentDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    return `${dayName}, ${monthName} ${date}, ${year}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Helper functions to process backend data
  const getGlucoseStatus = (value: number): 'good' | 'high' | 'low' => {
    if (value < 70) return 'low';
    if (value > 180) return 'high';
    return 'good';
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Generate dynamic glucose trend message based on recent readings
  const getGlucoseTrendMessage = () => {
    if (glucoseReadings.length === 0) {
      return "Start logging your glucose readings to see your progress!";
    }

    // Get last 7 days of readings
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentReadings = glucoseReadings.filter(
      r => new Date(r.measuredAt) >= sevenDaysAgo
    );

    if (recentReadings.length === 0) {
      return "No recent glucose readings. Keep logging to track your progress!";
    }

    // Calculate percentage in target range (70-180 mg/dL)
    const inRange = recentReadings.filter(
      r => Number(r.valueMgdl) >= 70 && Number(r.valueMgdl) <= 180
    ).length;
    const percentageInRange = (inRange / recentReadings.length) * 100;

    // Calculate average
    const average = recentReadings.reduce((sum, r) => sum + Number(r.valueMgdl), 0) / recentReadings.length;

    if (percentageInRange >= 70) {
      return `Great progress! Your glucose levels are trending well. ${percentageInRange.toFixed(0)}% of readings in target range. Keep up the good work with your meal logging and medication adherence.`;
    } else if (percentageInRange >= 50) {
      return `Good effort! ${percentageInRange.toFixed(0)}% of your readings are in range. Continue monitoring your diet and medications to improve further.`;
    } else {
      return `Your glucose levels need attention. Only ${percentageInRange.toFixed(0)}% in target range. Please review your meal plan and medication schedule with your doctor.`;
    }
  };

  // Handle export report
  const handleExportReport = async () => {
    if (!currentUser?.id) return;
    
    try {
      const blob = await exportPatientReportPdf(currentUser.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `patient_report_${currentUser.fullName || 'report'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  // Process glucose readings from backend - REACTIVE with useMemo
  const todaysReadings = useMemo(() => {
    return glucoseReadings
      .filter(r => formatDate(r.measuredAt) === 'Today')
      .map(r => ({
        time: formatTime(r.measuredAt),
        value: Number(r.valueMgdl),
        status: getGlucoseStatus(Number(r.valueMgdl)),
        context: r.context,
        measuredAt: r.measuredAt
      }))
      .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime());
  }, [glucoseReadings]);

  const previousReadings = useMemo(() => {
    return glucoseReadings
      .filter(r => formatDate(r.measuredAt) !== 'Today')
      .map(r => ({
        date: formatDate(r.measuredAt),
        time: formatTime(r.measuredAt),
        value: Number(r.valueMgdl),
        status: getGlucoseStatus(Number(r.valueMgdl)),
        context: r.context,
        measuredAt: r.measuredAt
      }))
      .sort((a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime())
      .slice(0, 10);
  }, [glucoseReadings]);

  const previousMeals = useMemo(() => {
    return meals
      .map(m => ({
        date: formatDate(m.loggedAt),
        time: formatTime(m.loggedAt),
        meal: m.description,
        carbs: m.carbsG ? Number(m.carbsG) : undefined,
        loggedAt: m.loggedAt
      }))
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime())
      .slice(0, 10);
  }, [meals]);

  // Calculate stats from backend data - REACTIVE with useMemo
  const weeklyStats = useMemo(() => {
    const allGlucoseValues = glucoseReadings.map(r => Number(r.valueMgdl));
    const averageGlucose = allGlucoseValues.length > 0 
      ? Math.round(allGlucoseValues.reduce((a, b) => a + b, 0) / allGlucoseValues.length)
      : 0;
    const highEvents = allGlucoseValues.filter(v => v > 180).length;
    const lowEvents = allGlucoseValues.filter(v => v < 70).length;

    // Calculate streak - consecutive days with at least one glucose reading
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasReadingOnDay = glucoseReadings.some(r => {
        const readingDate = new Date(r.measuredAt);
        readingDate.setHours(0, 0, 0, 0);
        return readingDate.getTime() === checkDate.getTime();
      });
      
      if (hasReadingOnDay) {
        streak++;
      } else if (i > 0) {
        // Stop counting if we hit a day with no reading (but allow today to be empty)
        break;
      }
    }

    return {
      averageGlucose,
      timeInRange: allGlucoseValues.length > 0 
        ? Math.round((allGlucoseValues.filter(v => v >= 70 && v <= 180).length / allGlucoseValues.length) * 100)
        : 0,
      lowEvents,
      highEvents,
      loggedMeals: meals.length,
      missedMeds: 0, // Calculated from medication logs
      streak
    };
  }, [glucoseReadings, meals]);

  const tips = [
    { emoji: '💡', text: 'Eating protein with meals can help slow carb absorption and prevent spikes.' },
    { emoji: '🚶‍♀️', text: 'A 10-minute walk after meals can lower blood sugar by 20-30 points.' },
    { emoji: '💧', text: 'Staying hydrated helps your kidneys flush out excess glucose.' },
    { emoji: '😴', text: 'Good sleep (7-9 hours) helps regulate blood sugar levels.' },
  ];

  const reminders = [
    { time: '8:00 AM', text: 'Time to take your morning Metformin', icon: '💊' },
    { time: '12:00 PM', text: 'Remember to log your lunch', icon: '🍽️' },
    { time: '8:00 PM', text: 'Evening insulin dose', icon: '💉' },
  ];

  // Calculate unread messages count from backend data
  const unreadMessagesCount = messages.filter(m => !m.readAt).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'high': return '⚠️';
      case 'low': return '⚡';
      default: return '📊';
    }
  };

  const handleSaveGlucose = async () => {
    if (!glucoseValue || !currentUser?.id) return;
    
    setIsLoading(true);
    try {
      await logGlucoseReading(currentUser.id, {
        measuredAt: new Date().toISOString(),
        valueMgdl: parseFloat(glucoseValue),
        context: glucoseContext
      });
      
      // Close modal immediately
      setQuickLogType(null);
      
      // Show success toast
      toast.success('Blood sugar logged successfully!');
      
      // Reset form
      setGlucoseValue('');
      setGlucoseContext('Fasting');
      
      // Refetch data to get updated list
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save glucose reading');
      toast.error('Failed to save glucose reading');
      console.error('Error saving glucose:', err);
    } finally {
      setIsLoading(false);
    }
  };

    const handleSaveMeal = async () => {
        if (!mealDescription || !currentUser?.id) return;

        setIsLoading(true);
        try {
            let loggedAtISO: string;

            if (mealTime) {
                // mealTime is "HH:mm"
                const [hours, minutes] = mealTime.split(':').map(Number);

                const date = new Date();
                date.setHours(hours, minutes, 0, 0);

                loggedAtISO = date.toISOString();
            } else {
                loggedAtISO = new Date().toISOString();
            }

            await logMeal(currentUser.id, {
                loggedAt: loggedAtISO,
                description: mealDescription,
                carbsG: carbsValue ? parseFloat(carbsValue) : undefined
            });

            setQuickLogType(null);
            toast.success('Meal logged successfully!');

            setMealDescription('');
            setCarbsValue('');
            setMealTime('');

            await fetchData();
        } catch (err: any) {
            setError(err.message || 'Failed to save meal');
            toast.error('Failed to save meal');
            console.error('Error saving meal:', err);
        } finally {
            setIsLoading(false);
        }
    };


    const handleLogMedication = async (regimenId: string, scheduledTime: string) => {
    if (!currentUser?.id) return;

    setIsLoading(true);
    try {
      // Normalize the scheduled time to HH:mm format
      const normalizedScheduledTime = normalizeTime(scheduledTime);
      const [schedHours, schedMinutes] = normalizedScheduledTime.split(':').map(Number);
      
      // Check if this medication slot is already taken today
      const existingLog = medicationLogs.find(log => {
        if (log.regimenId !== regimenId) return false;
        
        // Check if log is from today
        const logDate = new Date(log.takenAt);
        const today = new Date();
        if (logDate.toDateString() !== today.toDateString()) return false;
        
        // Normalize the log's time to HH:mm format
        const logHours = logDate.getHours().toString().padStart(2, '0');
        const logMinutes = logDate.getMinutes().toString().padStart(2, '0');
        const normalizedLogTime = `${logHours}:${logMinutes}`;
        
        // Exact match comparison
        return normalizedLogTime === normalizedScheduledTime;
      });

      if (existingLog) {
        // ALREADY TAKEN: Delete the log (toggle off)
        await deleteMedicationLog(currentUser.id, existingLog.id);
        toast.success('Medication unmarked');
        
        // Remove from state optimistically
        setMedicationLogs((prev) => prev.filter(log => log.id !== existingLog.id));
      } else {
        // NOT TAKEN: Create the log (toggle on)
        const takenAt = new Date();
        takenAt.setHours(schedHours, schedMinutes, 0, 0);
        
        const newLog = await logMedicationTaken(currentUser.id, {
          regimenId,
          takenAt: takenAt.toISOString()
        });

        toast.success('Medication logged successfully!');
        
        // Add to state optimistically
        setMedicationLogs((prev) => [{ ...newLog }, ...prev]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update medication');
      toast.error('Failed to update medication');
      console.error('Error updating medication:', err);
    } finally {
      setIsLoading(false);
      // Refetch to ensure consistency
      if (currentUser?.id) {
        getMedicationLogs(currentUser.id).then(setMedicationLogs).catch(() => {});
      }
    }
  };

  const handleSaveSymptom = async () => {
    if (!currentUser?.id || !symptomDescription) return;
    
    setIsLoading(true);
    try {
      await logSymptom(currentUser.id, {
        symptom: symptomDescription,
        notes: symptomNotesInput || undefined,
        occurredAt: new Date().toISOString()
      });
      
      // Close modal immediately
      setQuickLogType(null);
      
      // Show success toast
      toast.success('Symptom logged successfully!');
      
      // Reset form
      setSymptomDescription('');
      setSymptomNotesInput('');
      
      // Refetch data to get updated list
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to log symptom');
      toast.error('Failed to log symptom');
      console.error('Error logging symptom:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const NotificationsModal = () => {
    if (!showNotifications) return null;

    return (
      <div className="absolute inset-0 z-50 flex items-end justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowNotifications(false)} />
        <div className="relative bg-white w-full max-w-[375px] rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl isolate transform-gpu">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">🔔 Notifications</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowNotifications(false)}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          <div className="px-6 pb-8 overflow-y-auto max-h-[75vh] hide-scrollbar">
            <div className="space-y-6">
              {/* Messages - Priority */}
              <Card className="shadow-lg border-2 border-indigo-200">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-6 h-6 text-indigo-600" />
                      <span>Messages from Doctor</span>
                    </div>
                    {unreadMessagesCount > 0 && (
                      <Badge className="bg-red-500 text-white">{unreadMessagesCount}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      // Find the clinician name from links
                      const clinician = clinicianLinks.find(link => link.id === message.patientClinicianLinkId);
                      const clinicianName = clinician?.clinicianName || 'Doctor';
                      
                      return (
                        <div 
                          key={message.id} 
                          className={`flex items-start space-x-4 p-4 rounded-xl border cursor-pointer transition-all ${
                            !message.readAt 
                              ? 'bg-indigo-50 border-indigo-300 shadow-md' 
                              : 'bg-white border-indigo-200'
                          }`}
                          onClick={() => setShowMessaging(true)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900">{clinicianName}</p>
                              {!message.readAt && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-700 mb-1">{message.messageContent}</p>
                            <p className="text-sm text-gray-500">{formatDate(message.createdAt)} • {formatTime(message.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No messages yet</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setShowMessaging(true)}
                  >
                    View All Messages
                  </Button>
                </CardContent>
              </Card>

              {/* Reminders */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-6 h-6 text-purple-600" />
                    <span>Today's Reminders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reminders.map((reminder, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="text-3xl">{reminder.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{reminder.time}</p>
                        <p className="text-sm text-gray-600">{reminder.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Educational Tips */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-6 h-6 text-green-600" />
                    <span>Educational Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-green-50 border border-green-200">
                      <div className="text-3xl">{tip.emoji}</div>
                      <div className="flex-1">
                        <p className="text-gray-700">{tip.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const HomeTab = () => (
    <div className="space-y-6">
      {/* Header with notification bell */}
      <div className="relative py-6">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto">
            <img src={logoImage} alt="DiaTrack Logo" className="w-full h-full object-contain" />
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-gray-900">{getGreeting()}, {currentUser?.fullName?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="text-gray-600">{getCurrentDate()}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowNotifications(true)}
          className="absolute top-6 right-0 w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100"
        >
          <Bell className="w-6 h-6 text-blue-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>

      {/* Most Recent Reading Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg">
        <CardContent className="pt-6">
          {todaysReadings.length > 0 ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Droplets className="w-6 h-6 text-blue-600" />
                <span className="text-blue-800 font-medium">Most Recent Reading</span>
              </div>
              <div className="text-6xl font-bold text-blue-600">{todaysReadings[todaysReadings.length - 1].value}</div>
              <p className="text-blue-700 text-xl">mg/dL</p>
              <div className="flex items-center justify-center space-x-2">
                <Badge className={`text-base px-4 py-1 ${
                  todaysReadings[todaysReadings.length - 1].status === 'good' 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : todaysReadings[todaysReadings.length - 1].status === 'high'
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {todaysReadings[todaysReadings.length - 1].context}
                </Badge>
              </div>
              <p className="text-blue-600 text-sm">{todaysReadings[todaysReadings.length - 1].time}</p>
            
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-blue-200">
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-800">{todaysReadings.length}</div>
                <p className="text-sm text-gray-600">Readings</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-green-600">{weeklyStats.averageGlucose}</div>
                <p className="text-sm text-gray-600">Avg Today</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-purple-600">{weeklyStats.streak}</div>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-8">
              <Droplets className="w-16 h-16 text-blue-300 mx-auto" />
              <p className="text-blue-600 text-lg">No readings yet today</p>
              <p className="text-blue-500 text-sm">Log your first glucose reading!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <span>Quick Log</span>
          </CardTitle>
          <CardDescription>Track your health in seconds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => setQuickLogType('glucose')}
              className="h-20 flex flex-col space-y-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 rounded-xl" 
              variant="outline"
            >
              <Droplets className="w-8 h-8" />
              <span className="font-medium">Blood Sugar</span>
            </Button>
            <Button 
              onClick={() => setQuickLogType('meal')}
              className="h-20 flex flex-col space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 rounded-xl" 
              variant="outline"
            >
              <Apple className="w-8 h-8" />
              <span className="font-medium">Meal</span>
            </Button>
            <Button 
              onClick={() => setQuickLogType('medication')}
              className="h-20 flex flex-col space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 rounded-xl" 
              variant="outline"
            >
              <Pill className="w-8 h-8" />
              <span className="font-medium">Medication</span>
            </Button>
            <Button 
              onClick={() => setQuickLogType('symptoms')}
              className="h-20 flex flex-col space-y-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 rounded-xl" 
              variant="outline"
            >
              <Heart className="w-8 h-8" />
              <span className="font-medium">Symptoms</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Readings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span>Today's Readings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaysReadings.map((reading, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getStatusEmoji(reading.status)}</div>
                <div>
                  <div className="font-medium text-gray-900">{reading.time}</div>
                  <div className="text-sm text-gray-500">{reading.context}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{reading.value}</div>
                <div className="text-sm text-gray-500">mg/dL</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gentle Alert */}
      {weeklyStats.highEvents > 0 && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-orange-800 mb-2">Gentle Reminder</p>
                <p className="text-orange-700">Your afternoon reading was a bit high. A short walk after meals might help! 🚶‍♀️</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const TrendsTab = () => {
    // Calculate 7-day and 30-day summaries from backend data
    const sevenDaySummary = useMemo(() => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentReadings = glucoseReadings.filter(r => new Date(r.measuredAt) >= sevenDaysAgo);
      const recentMeals = meals.filter(m => new Date(m.loggedAt) >= sevenDaysAgo);
      const recentMedicationLogs = medicationLogs.filter(log => new Date(log.takenAt) >= sevenDaysAgo);
      const values = recentReadings.map(r => Number(r.valueMgdl));
      
      const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      const inRange = values.length > 0 ? Math.round((values.filter(v => v >= 70 && v <= 180).length / values.length) * 100) : 0;
      const lowEvents = values.filter(v => v < 70).length;
      const highEvents = values.filter(v => v > 180).length;
      
      // Calculate medication adherence
      const expectedDoses = medicationRegimens.reduce((total, regimen) => {
        return total + (regimen.timesOfDay.length * 7); // 7 days
      }, 0);
      const takenDoses = recentMedicationLogs.length;
      const medicationStatus = expectedDoses > 0 ? (takenDoses / expectedDoses >= 0.8 ? 'good' : 'warning') : 'good';
      
      // Determine status based on TIR and high events
      const getOverallStatus = () => {
        if (inRange < 50 || highEvents > 0) return 'danger';
        if (inRange >= 50 && inRange <= 70) return 'warning';
        return 'good';
      };
      
      return [
        { metric: 'Average Glucose', value: `${avg} mg/dL`, status: avg >= 70 && avg <= 180 ? 'good' : 'warning' },
        { metric: 'Time in Range', value: `${inRange}%`, status: getOverallStatus() },
        { metric: 'Low Events', value: `${lowEvents}`, status: lowEvents > 0 ? 'warning' : 'good' },
        { metric: 'High Events', value: `${highEvents}`, status: highEvents > 0 ? 'danger' : 'good' },
        { metric: 'Meals Logged', value: `${recentMeals.length}`, status: 'good' },
        { metric: 'Medications Taken', value: `${takenDoses} / ${expectedDoses}`, status: medicationStatus },
        { metric: 'Readings Logged', value: `${recentReadings.length}`, status: 'good' }
      ];
    }, [glucoseReadings, meals, medicationRegimens, medicationLogs]);

    const thirtyDaySummary = useMemo(() => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentReadings = glucoseReadings.filter(r => new Date(r.measuredAt) >= thirtyDaysAgo);
      const recentMeals = meals.filter(m => new Date(m.loggedAt) >= thirtyDaysAgo);
      const recentMedicationLogs = medicationLogs.filter(log => new Date(log.takenAt) >= thirtyDaysAgo);
      const values = recentReadings.map(r => Number(r.valueMgdl));
      
      const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      const inRange = values.length > 0 ? Math.round((values.filter(v => v >= 70 && v <= 180).length / values.length) * 100) : 0;
      const lowEvents = values.filter(v => v < 70).length;
      const highEvents = values.filter(v => v > 180).length;
      
      // Calculate medication adherence
      const expectedDoses = medicationRegimens.reduce((total, regimen) => {
        return total + (regimen.timesOfDay.length * 30); // 30 days
      }, 0);
      const takenDoses = recentMedicationLogs.length;
      const medicationStatus = expectedDoses > 0 ? (takenDoses / expectedDoses >= 0.8 ? 'good' : 'warning') : 'good';
      
      // Determine status based on TIR and high events
      const getOverallStatus = () => {
        if (inRange < 50 || highEvents > 0) return 'danger';
        if (inRange >= 50 && inRange <= 70) return 'warning';
        return 'good';
      };
      
      return [
        { metric: 'Average Glucose', value: `${avg} mg/dL`, status: avg >= 70 && avg <= 180 ? 'good' : 'warning' },
        { metric: 'Time in Range', value: `${inRange}%`, status: getOverallStatus() },
        { metric: 'Low Events', value: `${lowEvents}`, status: lowEvents > 0 ? 'warning' : 'good' },
        { metric: 'High Events', value: `${highEvents}`, status: highEvents > 0 ? 'danger' : 'good' },
        { metric: 'Meals Logged', value: `${recentMeals.length}`, status: 'good' },
        { metric: 'Medications Taken', value: `${takenDoses} / ${expectedDoses}`, status: medicationStatus },
        { metric: 'Readings Logged', value: `${recentReadings.length}`, status: 'good' }
      ];
    }, [glucoseReadings, meals, medicationRegimens, medicationLogs]);

    const getRowColor = (status: string) => {
      switch (status) {
        case 'good': return 'bg-green-50';
        case 'warning': return 'bg-yellow-50';
        case 'danger': return 'bg-red-50';
        default: return 'bg-gray-50';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'good': return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
        case 'danger': return <AlertTriangle className="w-5 h-5 text-red-600" />;
        default: return null;
      }
    };

    return (
      <div className="space-y-6">
        {/* Header with notification bell */}
        <div className="relative py-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold">Health Summary</h2>
            <p className="text-gray-600">Your health at a glance</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowNotifications(true)}
            className="absolute top-6 right-0 w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100"
          >
            <Bell className="w-6 h-6 text-blue-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>

        {/* 7-Day Summary Table */}
        <Card className="shadow-lg border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="text-purple-900">7-Day Summary</span>
            </CardTitle>
            <CardDescription>Last 7 days of health data</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-100 border-b-2 border-purple-200">
                    <th className="text-left p-4 text-purple-900">Metric</th>
                    <th className="text-right p-4 text-purple-900">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {sevenDaySummary.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-200 ${getRowColor(row.status)} hover:bg-purple-50 transition-colors`}
                    >
                      <td className="p-4 text-gray-800">{row.metric}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-gray-900">{row.value}</span>
                          {getStatusIcon(row.status)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 30-Day Summary Table */}
        <Card className="shadow-lg border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span className="text-blue-900">30-Day Summary</span>
            </CardTitle>
            <CardDescription>Last 30 days of health data</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100 border-b-2 border-blue-200">
                    <th className="text-left p-4 text-blue-900">Metric</th>
                    <th className="text-right p-4 text-blue-900">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {thirtyDaySummary.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-200 ${getRowColor(row.status)} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="p-4 text-gray-800">{row.metric}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-gray-900">{row.value}</span>
                          {getStatusIcon(row.status)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Note */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-green-900">{getGlucoseTrendMessage()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const HistoryTab = () => (
    <div className="space-y-6">
      {/* Header with notification bell */}
      <div className="relative py-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <HistoryIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold">History</h2>
          <p className="text-gray-600">Past entries</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowNotifications(true)}
          className="absolute top-6 right-0 w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100"
        >
          <Bell className="w-6 h-6 text-blue-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>

      {/* Previous Readings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-red-600" />
            <span>Previous Readings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {previousReadings.map((reading, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getStatusEmoji(reading.status)}</div>
                <div>
                  <div className="font-medium text-gray-900">{reading.date} • {reading.time}</div>
                  <div className="text-sm text-gray-500">{reading.context}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{reading.value}</div>
                <div className="text-sm text-gray-500">mg/dL</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Previous Meals */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-green-600" />
            <span>Previous Meals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {previousMeals.map((meal, index) => (
            <div key={index} className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">{meal.date} • {meal.time}</div>
                  <p className="text-sm text-gray-700 mt-1">{meal.meal}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-green-100 text-green-800">
                  {meal.carbs}g carbs
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

{/* Previous Medications */}
<Card className="shadow-lg">
<CardHeader>
<CardTitle className="flex items-center space-x-2">
<Pill className="w-5 h-5 text-purple-600" />
<span>Medication History</span>
</CardTitle>
</CardHeader>
<CardContent className="space-y-3">
{medicationLogs.length > 0 ? (
medicationLogs.slice(0, 10).map((log) => {
const regimen = medicationRegimens.find(r => r.id === log.regimenId);
return (
<div key={log.id} className="p-4 rounded-xl border bg-purple-50 border-purple-200">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
<Pill className="w-5 h-5 text-purple-600" />
</div>
<div>
<div className="font-medium text-gray-900">{regimen?.medicationName || 'Unknown Medication'}</div>
<div className="text-sm text-gray-600">{formatDate(log.takenAt)} • {formatTime(log.takenAt)}</div>
{regimen && <div className="text-sm text-gray-500">{regimen.dosage}</div>}
</div>
</div>
<Badge className="bg-green-100 text-green-800">
Taken
</Badge>
</div>
</div>
);
})
) : (
<div className="text-center py-8 text-gray-500">
<Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
<p>No medication logs yet</p>
</div>
)}
        </CardContent>
      </Card>

      {/* Symptoms History */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-orange-600" />
            <span>Symptoms History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {symptomNotes.length > 0 ? (
            symptomNotes.slice(0, 10).map((note) => (
              <div key={note.id} className="p-4 rounded-xl border bg-orange-50 border-orange-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{note.symptom}</div>
                    <div className="text-sm text-gray-600 mt-1">{formatDate(note.occurredAt)} • {formatTime(note.occurredAt)}</div>
                    {note.notes && <p className="text-sm text-gray-700 mt-2">{note.notes}</p>}
                  </div>
                  <Badge className={`ml-2 ${
                    note.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                    note.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {note.severity}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No symptoms logged yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const MenuTab = () => (
    <div className="space-y-6">
      {/* Header with notification bell */}
      <div className="relative py-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold">{currentUser?.fullName || 'User'}</h2>
          <p className="text-gray-600">Managing diabetes since 2018</p>
          <Badge className="mt-2 bg-green-100 text-green-800">On track this week</Badge>
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowNotifications(true)}
          className="absolute top-6 right-0 w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100"
        >
          <Bell className="w-6 h-6 text-blue-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardContent className="pt-6 pb-4">
          <Button 
            onClick={onLogout}
            variant="outline" 
            className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span>Sign Out</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Privacy & Legal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-left rounded-xl"
            onClick={() => setShowDataPrivacy(true)}
          >
            <Shield className="w-6 h-6 mr-4 text-indigo-600" />
            <div>
              <div className="font-medium">Data Privacy Notice</div>
              <div className="text-sm text-gray-500">View privacy policy</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Settings & Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-left rounded-xl"
            onClick={() => setShowMedicalProfile(true)}
          >
            <FileText className="w-6 h-6 mr-4 text-blue-600" />
            <div>
              <div className="font-medium">Medical Profile</div>
              <div className="text-sm text-gray-500">Update your health info</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-left rounded-xl"
            onClick={() => alert('Reminder settings are automatically managed based on your medication schedule. The system will send you reminders for your medications at the scheduled times.')}
          >
            <Bell className="w-6 h-6 mr-4 text-purple-600" />
            <div>
              <div className="font-medium">Reminder Settings</div>
              <div className="text-sm text-gray-500">Auto-managed</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-left rounded-xl"
            onClick={() => setShowClinicSchedule(true)}
          >
            <MapPin className="w-6 h-6 mr-4 text-blue-600" />
            <div>
              <div className="font-medium">Clinic Schedule</div>
              <div className="text-sm text-gray-500">View schedule & contact</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-left rounded-xl"
            onClick={() => setShowEducationalResources(true)}
          >
            <BookOpen className="w-6 h-6 mr-4 text-green-600" />
            <div>
              <div className="font-medium">Educational Resources</div>
              <div className="text-sm text-gray-500">Tips & guides</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-left rounded-xl"
            onClick={handleExportReport}
          >
            <Calendar className="w-6 h-6 mr-4 text-orange-600" />
            <div>
              <div className="font-medium">Export Report</div>
              <div className="text-sm text-gray-500">Share with doctor</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // If messaging is open, show it fullscreen
  if (showMessaging) {
    return <PatientMessaging onBack={() => setShowMessaging(false)} />;
  }

  // If clinic schedule is open, show it fullscreen
  if (showClinicSchedule) {
    return <PatientClinicSchedule onClose={() => setShowClinicSchedule(false)} />;
  }

  // If medical profile is open, show it fullscreen
  if (showMedicalProfile) {
    return <PatientMedicalProfile onClose={() => setShowMedicalProfile(false)} />;
  }

  // If educational resources is open, show it fullscreen
  if (showEducationalResources) {
    return <EducationalResources onClose={() => setShowEducationalResources(false)} />;
  }

  // If data privacy is open, show it fullscreen
  if (showDataPrivacy) {
    return <DataPrivacyPage onClose={() => setShowDataPrivacy(false)} />;
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden pt-11">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'trends' && <TrendsTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'menu' && <MenuTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
              activeTab === 'home' 
                ? 'text-blue-600 bg-blue-50 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
              activeTab === 'trends' 
                ? 'text-blue-600 bg-blue-50 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
              activeTab === 'history' 
                ? 'text-blue-600 bg-blue-50 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <HistoryIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">History</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
              activeTab === 'menu' 
                ? 'text-blue-600 bg-blue-50 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MenuIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <QuickLogModal 
        quickLogType={quickLogType}
        setQuickLogType={setQuickLogType}
        glucoseValue={glucoseValue}
        setGlucoseValue={setGlucoseValue}
        glucoseContext={glucoseContext}
        setGlucoseContext={setGlucoseContext}
        mealDescription={mealDescription}
        setMealDescription={setMealDescription}
        carbsValue={carbsValue}
        setCarbsValue={setCarbsValue}
        mealTime={mealTime}
        setMealTime={setMealTime}
        symptomDescription={symptomDescription}
        setSymptomDescription={setSymptomDescription}
        symptomNotesInput={symptomNotesInput}
        setSymptomNotesInput={setSymptomNotesInput}
        medicationRegimens={medicationRegimens}
        medicationLogs={medicationLogs}
        isLoading={isLoading}
        currentUser={currentUser}
        handleSaveGlucose={handleSaveGlucose}
        handleSaveMeal={handleSaveMeal}
        handleLogMedication={handleLogMedication}
        handleSaveSymptom={handleSaveSymptom}
        formatDate={formatDate}
        formatTime={formatTime}
      />
      <NotificationsModal />
    </div>
  );
}