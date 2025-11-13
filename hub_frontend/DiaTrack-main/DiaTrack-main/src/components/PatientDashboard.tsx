import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { PatientMessaging } from './PatientMessaging';
import { PatientClinicSchedule } from './PatientClinicSchedule';
import { PatientMedicalProfile } from './PatientMedicalProfile';
import logoImage from '../assets/logoImage.png';
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
  MapPin
} from 'lucide-react';

interface PatientDashboardProps {
  onLogout: () => void;
}

type MobileTab = 'home' | 'trends' | 'history' | 'menu';
type QuickLogType = 'glucose' | 'meal' | 'medication' | 'symptoms' | null;

export function PatientDashboard({ onLogout }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [quickLogType, setQuickLogType] = useState<QuickLogType>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMedicalProfile, setShowMedicalProfile] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showClinicSchedule, setShowClinicSchedule] = useState(false);
  const [glucoseValue, setGlucoseValue] = useState('');
  const [mealDescription, setMealDescription] = useState('');
  const [carbsValue, setCarbsValue] = useState('');

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

  // Mock data - Current date is October 1, 2025
  const todaysReadings = [
    { time: '7:30 AM', value: 125, status: 'good', context: 'Fasting' },
    { time: '12:15 PM', value: 180, status: 'high', context: 'After Meal' },
    { time: '6:45 PM', value: 110, status: 'good', context: 'Before Meal' }
  ];

  const previousReadings = [
    { date: 'Sep 30', time: '8:00 AM', value: 118, status: 'good', context: 'Fasting' },
    { date: 'Sep 30', time: '1:00 PM', value: 165, status: 'high', context: 'After Meal' },
    { date: 'Sep 30', time: '7:00 PM', value: 112, status: 'good', context: 'Before Meal' },
    { date: 'Sep 29', time: '7:45 AM', value: 122, status: 'good', context: 'Fasting' },
    { date: 'Sep 29', time: '12:30 PM', value: 175, status: 'high', context: 'After Meal' },
    { date: 'Sep 29', time: '7:15 PM', value: 108, status: 'good', context: 'Bedtime' },
    { date: 'Sep 28', time: '8:15 AM', value: 130, status: 'good', context: 'Fasting' },
    { date: 'Sep 28', time: '2:00 PM', value: 195, status: 'high', context: 'After Meal' },
  ];

  const previousMeals = [
    { date: 'Sep 30', time: '12:30 PM', meal: 'Grilled chicken salad with vinaigrette', carbs: 35 },
    { date: 'Sep 30', time: '7:00 AM', meal: 'Oatmeal with berries and almonds', carbs: 42 },
    { date: 'Sep 29', time: '6:30 PM', meal: 'Baked salmon with quinoa and vegetables', carbs: 38 },
    { date: 'Sep 29', time: '12:00 PM', meal: 'Turkey sandwich on whole grain bread', carbs: 45 },
    { date: 'Sep 28', time: '6:00 PM', meal: 'Grilled chicken with steamed broccoli', carbs: 28 },
  ];

  const previousMedications = [
    { date: 'Oct 5', time: '8:00 PM', medication: 'Insulin (Long-acting)', dose: '20 units', status: 'taken' },
    { date: 'Oct 5', time: '8:00 AM', medication: 'Metformin 500mg', dose: '1 tablet', status: 'taken' },
    { date: 'Oct 4', time: '8:00 PM', medication: 'Insulin (Long-acting)', dose: '20 units', status: 'taken' },
    { date: 'Oct 4', time: '8:00 AM', medication: 'Metformin 500mg', dose: '1 tablet', status: 'missed' },
  ];

  const weeklyStats = {
    averageGlucose: 142,
    timeInRange: 68,
    lowEvents: 2,
    highEvents: 5,
    loggedMeals: 18,
    missedMeds: 1,
    streak: 7
  };

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

  const messages = [
    { id: 1, from: 'Dr. Maria Santos', content: 'Great job with your readings!', time: '2:30 PM', date: 'Today', read: false },
    { id: 2, from: 'Dr. Maria Santos', content: 'Check your glucose today', time: '10:15 AM', date: 'Today', read: false },
    { id: 3, from: 'Dr. Maria Santos', content: 'Excellent work this week!', time: '4:45 PM', date: 'Yesterday', read: true },
  ];

  const unreadMessagesCount = messages.filter(m => !m.read).length;

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

  const handleSaveGlucose = () => {
    if (glucoseValue) {
      console.log('Saving glucose:', glucoseValue);
      setGlucoseValue('');
      setQuickLogType(null);
    }
  };

  const handleSaveMeal = () => {
    if (mealDescription) {
      console.log('Saving meal:', { description: mealDescription, carbs: carbsValue });
      setMealDescription('');
      setCarbsValue('');
      setQuickLogType(null);
    }
  };

  const NotificationsModal = () => {
    if (!showNotifications) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end justify-center">
        <div className="bg-white w-full max-w-[375px] rounded-t-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl">
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
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex items-start space-x-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        !message.read 
                          ? 'bg-indigo-50 border-indigo-300 shadow-md' 
                          : 'bg-white border-indigo-200'
                      }`}
                      onClick={() => setShowMessaging(true)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">{message.from}</p>
                          {!message.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-700 mb-1">{message.content}</p>
                        <p className="text-sm text-gray-500">{message.date} • {message.time}</p>
                      </div>
                    </div>
                  ))}
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

  const QuickLogModal = () => {
    if (!quickLogType) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end justify-center">
        <div className="bg-white w-full max-w-[375px] rounded-t-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl">
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
                          type="number" 
                          placeholder="120"
                          value={glucoseValue}
                          onChange={(e) => setGlucoseValue(e.target.value)}
                          className="w-32 h-16 text-4xl text-center border-2 border-blue-300 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white shadow-lg"
                          inputMode="numeric"
                        />
                        <span className="text-xl text-gray-700 font-medium">mg/dL</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-center text-gray-600 font-medium">When was this taken?</p>
                      <div className="grid grid-cols-1 gap-3">
                        <Button variant="outline" className="h-12 rounded-xl border-2 hover:bg-blue-50">
                          Fasting
                        </Button>
                        <Button variant="outline" className="h-12 rounded-xl border-2 hover:bg-blue-50">
                          Before Meal
                        </Button>
                        <Button variant="outline" className="h-12 rounded-xl border-2 hover:bg-blue-50">
                          After Meal
                        </Button>
                        <Button variant="outline" className="h-12 rounded-xl border-2 hover:bg-blue-50">
                          Bedtime
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSaveGlucose}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg"
                      disabled={!glucoseValue}
                    >
                      {glucoseValue ? `Save Reading: ${glucoseValue} mg/dL` : 'Enter Reading First'}
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
                        value={mealDescription}
                        onChange={(e) => setMealDescription(e.target.value)}
                        className="w-full h-20 p-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-white shadow-lg resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-semibold mb-2 text-gray-800">Time eaten 🕐</label>
                      <Input 
                        type="time" 
                        className="h-12 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-300 bg-white shadow-lg"
                        defaultValue={new Date().toTimeString().slice(0, 5)}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSaveMeal}
                      className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg"
                      disabled={!mealDescription}
                    >
                      {mealDescription ? '✅ Log This Meal' : 'Describe Your Meal First'}
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
                      <Button 
                        variant="outline" 
                        className="w-full h-16 justify-between text-left rounded-xl border-2 border-purple-300 bg-white hover:bg-purple-50 shadow-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Pill className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold">Metformin 500mg</div>
                            <div className="text-sm text-gray-500">Morning dose</div>
                          </div>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-16 justify-between text-left rounded-xl border-2 border-purple-300 bg-white hover:bg-purple-50 shadow-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Pill className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold">Insulin (Long-acting)</div>
                            <div className="text-sm text-gray-500">Evening dose</div>
                          </div>
                        </div>
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      </Button>
                    </div>
                    
                    <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl shadow-lg">
                      💊 Update Medications
                    </Button>
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
                        className="w-full h-24 p-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-500 bg-white shadow-lg resize-none"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <p className="font-semibold text-gray-800">Quick options:</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="h-12 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 shadow-lg"
                        >
                          😴 Tired
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-12 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 shadow-lg"
                        >
                          🤢 Nauseous
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-12 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 shadow-lg"
                        >
                          😵‍💫 Dizzy
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-12 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 shadow-lg"
                        >
                          🤒 Unwell
                        </Button>
                      </div>
                    </div>
                    
                    <Button className="w-full h-14 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-xl shadow-lg">
                      📝 Log Symptoms
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
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
            <h1 className="text-2xl font-semibold text-gray-900">{getGreeting()}, Juan! 👋</h1>
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
    // Mock data for summaries
    const sevenDaySummary = [
      { metric: 'Average Glucose', value: '142 mg/dL', status: 'good' },
      { metric: 'Time in Range', value: '68%', status: 'good' },
      { metric: 'Low Events', value: '2', status: 'warning' },
      { metric: 'High Events', value: '5', status: 'warning' },
      { metric: 'Meals Logged', value: '18', status: 'good' },
      { metric: 'Medications Taken', value: '13 / 14', status: 'good' },
      { metric: 'Readings Logged', value: '21', status: 'good' }
    ];

    const thirtyDaySummary = [
      { metric: 'Average Glucose', value: '145 mg/dL', status: 'good' },
      { metric: 'Time in Range', value: '65%', status: 'good' },
      { metric: 'Low Events', value: '8', status: 'warning' },
      { metric: 'High Events', value: '18', status: 'warning' },
      { metric: 'Meals Logged', value: '72', status: 'good' },
      { metric: 'Medications Taken', value: '56 / 60', status: 'good' },
      { metric: 'Readings Logged', value: '87', status: 'good' }
    ];

    const getRowColor = (status: string) => {
      switch (status) {
        case 'good': return 'bg-green-50';
        case 'warning': return 'bg-yellow-50';
        default: return 'bg-gray-50';
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
                      <td className="p-4 text-right text-gray-900">{row.value}</td>
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
                      <td className="p-4 text-right text-gray-900">{row.value}</td>
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
                <p className="text-green-900">Great progress! Your glucose levels are trending well. Keep up the good work with your meal logging and medication adherence.</p>
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
            <span>Previous Medications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {previousMedications.map((med, index) => (
            <div key={index} className={`p-4 rounded-xl border ${
              med.status === 'taken' 
                ? 'bg-purple-50 border-purple-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    med.status === 'taken' ? 'bg-purple-100' : 'bg-red-100'
                  }`}>
                    <Pill className={`w-5 h-5 ${
                      med.status === 'taken' ? 'text-purple-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{med.medication}</div>
                    <div className="text-sm text-gray-600">{med.date} • {med.time}</div>
                    <div className="text-sm text-gray-500">{med.dose}</div>
                  </div>
                </div>
                <Badge className={
                  med.status === 'taken' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }>
                  {med.status === 'taken' ? '✓ Taken' : '✗ Missed'}
                </Badge>
              </div>
            </div>
          ))}
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
          <h2 className="text-2xl font-semibold">Juan Dela Cruz</h2>
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
          <Button variant="outline" className="w-full h-16 justify-start text-left rounded-xl">
            <Bell className="w-6 h-6 mr-4 text-purple-600" />
            <div>
              <div className="font-medium">Reminder Settings</div>
              <div className="text-sm text-gray-500">3 times daily</div>
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
          <Button variant="outline" className="w-full h-16 justify-start text-left rounded-xl">
            <BookOpen className="w-6 h-6 mr-4 text-green-600" />
            <div>
              <div className="font-medium">Educational Resources</div>
              <div className="text-sm text-gray-500">Tips & guides</div>
            </div>
          </Button>
          <Button variant="outline" className="w-full h-16 justify-start text-left rounded-xl">
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
      <QuickLogModal />
      <NotificationsModal />
    </div>
  );
}