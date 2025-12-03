import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, MapPin, Clock, Phone, Mail, User, Save, Plus, Trash2, Check } from 'lucide-react';
import { Badge } from './ui/badge';
import { getMyClinicDetails, updateMyClinicDetails, ClinicDetails } from '../api/clinic';
import { getCurrentUser } from '../api/auth';

interface ClinicSettingsProps {
  onClose: () => void;
}

interface ClinicSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export function ClinicSettings({ onClose }: ClinicSettingsProps) {
  // Clinic details from backend
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [scheduleDays, setScheduleDays] = useState('');
  const [scheduleHours, setScheduleHours] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Main Clinic Schedule
  const [mainClinicSchedule, setMainClinicSchedule] = useState<ClinicSchedule[]>([
    { day: 'Monday', startTime: '14:00', endTime: '18:00' },
    { day: 'Wednesday', startTime: '14:00', endTime: '18:00' },
    { day: 'Friday', startTime: '14:00', endTime: '18:00' },
  ]);

  // Second Clinic Schedule
  const [secondClinicSchedule, setSecondClinicSchedule] = useState<ClinicSchedule[]>([
    { day: 'Tuesday', startTime: '09:00', endTime: '12:00' },
    { day: 'Thursday', startTime: '09:00', endTime: '12:00' },
  ]);

  // Success message state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Add Schedule Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'main' | 'second'>('main');
  const [newScheduleDay, setNewScheduleDay] = useState('Monday');
  const [newScheduleStartTime, setNewScheduleStartTime] = useState('09:00');
  const [newScheduleEndTime, setNewScheduleEndTime] = useState('17:00');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch clinic details on mount
  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        setIsLoading(true);
        const details = await getMyClinicDetails();
        setClinicName(details.clinicName || '');
        setAddress(details.address || '');
        setPhone(details.contactPhone || '');
        setContactPerson(details.contactPerson || '');
        setContactPhone(details.contactPhone || '');
        setScheduleDays(details.scheduleDays || '');
        setScheduleHours(details.scheduleHours || '');
      } catch (error) {
        console.error('Error fetching clinic details:', error);
        // If no details exist yet, that's okay - user can create them
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicDetails();
  }, []);

  const openAddMainModal = () => {
    setAddModalType('main');
    setNewScheduleDay('Monday');
    setNewScheduleStartTime('09:00');
    setNewScheduleEndTime('17:00');
    setShowAddModal(true);
  };

  const openAddSecondModal = () => {
    setAddModalType('second');
    setNewScheduleDay('Monday');
    setNewScheduleStartTime('09:00');
    setNewScheduleEndTime('17:00');
    setShowAddModal(true);
  };

  const handleConfirmAdd = () => {
    const newSchedule = {
      day: newScheduleDay,
      startTime: newScheduleStartTime,
      endTime: newScheduleEndTime,
    };

    if (addModalType === 'main') {
      setMainClinicSchedule([...mainClinicSchedule, newSchedule]);
      setSuccessMessage('New time slot added to Main Clinic Hours!');
    } else {
      setSecondClinicSchedule([...secondClinicSchedule, newSchedule]);
      setSuccessMessage('New time slot added to Second Clinic Hours!');
    }

    setShowAddModal(false);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewScheduleDay('Monday');
    setNewScheduleStartTime('09:00');
    setNewScheduleEndTime('17:00');
  };

  const removeMainSchedule = (index: number) => {
    setMainClinicSchedule(mainClinicSchedule.filter((_, i) => i !== index));
  };

  const updateMainSchedule = (index: number, field: keyof ClinicSchedule, value: string) => {
    const updated = [...mainClinicSchedule];
    updated[index][field] = value;
    setMainClinicSchedule(updated);
  };

  const removeSecondSchedule = (index: number) => {
    setSecondClinicSchedule(secondClinicSchedule.filter((_, i) => i !== index));
  };

  const updateSecondSchedule = (index: number, field: keyof ClinicSchedule, value: string) => {
    const updated = [...secondClinicSchedule];
    updated[index][field] = value;
    setSecondClinicSchedule(updated);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Combine schedules into strings for backend
      const mainScheduleStr = mainClinicSchedule.map(s => `${s.day}: ${s.startTime}-${s.endTime}`).join('; ');
      const secondScheduleStr = secondClinicSchedule.map(s => `${s.day}: ${s.startTime}-${s.endTime}`).join('; ');
      const combinedScheduleDays = [mainScheduleStr, secondScheduleStr].filter(s => s).join(' | ');
      
      await updateMyClinicDetails({
        clinicName,
        address,
        scheduleDays: combinedScheduleDays,
        scheduleHours: scheduleHours || '9:00 AM - 5:00 PM',
        contactPerson,
        contactPhone
      });
      
      setSuccessMessage('Clinic settings saved successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error('Error saving clinic settings:', error);
      setSuccessMessage('Failed to save clinic settings. Please try again.');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col pt-11">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 border-b">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Clinic Settings</h1>
            <p className="text-sm text-gray-500">Configure your clinic information</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6 max-w-[375px] mx-auto">
          {/* Main Clinic Location */}
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span>Main Clinic Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block font-medium mb-2 text-gray-700">Clinic Name</label>
                <Input 
                  placeholder="St. Mary's Medical Center"
                  className="h-12 border-2 border-blue-200 rounded-xl"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Address</label>
                <Input 
                  placeholder="123 Health Street"
                  className="h-12 border-2 border-blue-200 rounded-xl"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Phone</label>
                <Input 
                  placeholder="(02) 8123-4567"
                  className="h-12 border-2 border-blue-200 rounded-xl"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Main Clinic Schedule */}
          <Card className="shadow-lg border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <span>Main Clinic Hours</span>
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={openAddMainModal}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {mainClinicSchedule.map((schedule, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-gray-700">Day of Week</label>
                      {mainClinicSchedule.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMainSchedule(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <select
                      value={schedule.day}
                      onChange={(e) => updateMainSchedule(index, 'day', e.target.value)}
                      className="w-full h-12 px-4 border-2 border-purple-300 rounded-xl bg-white"
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium mb-2 text-gray-700 text-sm">Start Time</label>
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => updateMainSchedule(index, 'startTime', e.target.value)}
                          className="w-full h-12 px-4 border-2 border-purple-300 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2 text-gray-700 text-sm">End Time</label>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => updateMainSchedule(index, 'endTime', e.target.value)}
                          className="w-full h-12 px-4 border-2 border-purple-300 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Second Clinic Location */}
          <Card className="shadow-lg border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-green-600" />
                <span>Second Clinic Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block font-medium mb-2 text-gray-700">Clinic Name</label>
                <Input 
                  placeholder="Philippine Heart Center"
                  className="h-12 border-2 border-green-200 rounded-xl"
                  defaultValue="Philippine Heart Center"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Address</label>
                <Input 
                  placeholder="East Avenue, Quezon City"
                  className="h-12 border-2 border-green-200 rounded-xl"
                  defaultValue="East Avenue, Quezon City"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Phone</label>
                <Input 
                  placeholder="(02) 8925-2401"
                  className="h-12 border-2 border-green-200 rounded-xl"
                  defaultValue="(02) 8925-2401"
                />
              </div>
            </CardContent>
          </Card>

          {/* Second Clinic Schedule */}
          <Card className="shadow-lg border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <span>Second Clinic Hours</span>
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={openAddSecondModal}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {secondClinicSchedule.map((schedule, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-gray-700">Day of Week</label>
                      {secondClinicSchedule.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSecondSchedule(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <select
                      value={schedule.day}
                      onChange={(e) => updateSecondSchedule(index, 'day', e.target.value)}
                      className="w-full h-12 px-4 border-2 border-orange-300 rounded-xl bg-white"
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium mb-2 text-gray-700 text-sm">Start Time</label>
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => updateSecondSchedule(index, 'startTime', e.target.value)}
                          className="w-full h-12 px-4 border-2 border-orange-300 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2 text-gray-700 text-sm">End Time</label>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => updateSecondSchedule(index, 'endTime', e.target.value)}
                          className="w-full h-12 px-4 border-2 border-orange-300 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Secretary Contact Information */}
          <Card className="shadow-lg border-2 border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-6 h-6 text-indigo-600" />
                <span>Secretary Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block font-medium mb-2 text-gray-700">Name</label>
                <Input 
                  placeholder="Maria Santos"
                  className="h-12 border-2 border-indigo-200 rounded-xl"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Phone</label>
                <Input 
                  placeholder="+63 917 123 4567"
                  className="h-12 border-2 border-indigo-200 rounded-xl"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl shadow-lg" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Clinic Settings'}
          </Button>

          {/* Success Popup */}
          {showSuccessPopup && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
              <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-[340px]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold mb-0.5">Success!</p>
                    <p className="text-sm text-green-100">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[350px]">
            {/* Modal Header */}
            <div className={`px-6 py-4 rounded-t-2xl border-b ${
              addModalType === 'main' 
                ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' 
                : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Add {addModalType === 'main' ? 'Main' : 'Second'} Clinic Hours
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelAdd}
                  className="rounded-full hover:bg-gray-100 h-8 w-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Day Selection */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">Day of Week</label>
                <select
                  value={newScheduleDay}
                  onChange={(e) => setNewScheduleDay(e.target.value)}
                  className={`w-full h-12 px-4 border-2 rounded-xl bg-white focus:outline-none ${
                    addModalType === 'main' 
                      ? 'border-purple-200 focus:border-purple-400' 
                      : 'border-orange-200 focus:border-orange-400'
                  }`}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={newScheduleStartTime}
                    onChange={(e) => setNewScheduleStartTime(e.target.value)}
                    className={`w-full h-12 px-4 border-2 rounded-xl bg-white focus:outline-none ${
                      addModalType === 'main' 
                        ? 'border-purple-200 focus:border-purple-400' 
                        : 'border-orange-200 focus:border-orange-400'
                    }`}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={newScheduleEndTime}
                    onChange={(e) => setNewScheduleEndTime(e.target.value)}
                    className={`w-full h-12 px-4 border-2 rounded-xl bg-white focus:outline-none ${
                      addModalType === 'main' 
                        ? 'border-purple-200 focus:border-purple-400' 
                        : 'border-orange-200 focus:border-orange-400'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 pb-6 flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 h-12 border-2 hover:bg-gray-50"
                onClick={handleCancelAdd}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 h-12 text-white ${
                  addModalType === 'main'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                }`}
                onClick={handleConfirmAdd}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}