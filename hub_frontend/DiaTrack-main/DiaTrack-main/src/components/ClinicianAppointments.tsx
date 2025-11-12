import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowLeft, Calendar, Clock, User, Phone, AlertCircle, X, Check } from 'lucide-react';

interface ClinicianAppointmentsProps {
  onClose: () => void;
}

export function ClinicianAppointments({ onClose }: ClinicianAppointmentsProps) {
  const [rescheduleAppointment, setRescheduleAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [rescheduledPatientName, setRescheduledPatientName] = useState('');

  const appointments = [
    {
      id: 1,
      patientName: 'Arianne Acosta',
      date: 'October 3, 2025',
      time: '2:00 PM',
      type: 'Follow-up Consultation',
      status: 'urgent',
      notes: 'Needs medication adjustment',
      phone: '(555) 345-6789'
    },
    {
      id: 2,
      patientName: 'Sheianne Seblante',
      date: 'October 5, 2025',
      time: '3:30 PM',
      type: 'Regular Check-up',
      status: 'scheduled',
      notes: 'Review recent glucose trends',
      phone: '(555) 123-4567'
    },
    {
      id: 3,
      patientName: 'Jose Reyes',
      date: 'October 12, 2025',
      time: '10:00 AM',
      type: 'Routine Follow-up',
      status: 'scheduled',
      notes: 'Quarterly review',
      phone: '(555) 234-5678'
    },
    {
      id: 4,
      patientName: 'Joy Arellano',
      date: 'October 15, 2025',
      time: '4:00 PM',
      type: 'Regular Check-up',
      status: 'scheduled',
      notes: 'Discuss exercise routine',
      phone: '(555) 456-7890'
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'urgent') {
      return <Badge className="bg-red-500 text-white">Urgent</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>;
  };

  const handleReschedule = (appointment: any) => {
    setRescheduleAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
  };

  const handleSaveReschedule = () => {
    if (rescheduleAppointment && newDate && newTime) {
      // Save patient name before clearing the appointment
      setRescheduledPatientName(rescheduleAppointment.patientName);
      
      // Show success message that appointment was rescheduled and patient was notified
      setRescheduleAppointment(null);
      setNewDate('');
      setNewTime('');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
            <h1 className="text-xl font-semibold">Upcoming Appointments</h1>
            <p className="text-sm text-gray-500">{appointments.length} appointments scheduled</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-4 max-w-[375px] mx-auto">
          {appointments.map((appointment) => (
            <Card 
              key={appointment.id} 
              className={`shadow-lg ${
                appointment.status === 'urgent' 
                  ? 'border-2 border-red-300 bg-gradient-to-r from-red-50 to-rose-50' 
                  : 'border-2 border-blue-200'
              }`}
            >
              <CardHeader className={
                appointment.status === 'urgent'
                  ? 'bg-gradient-to-r from-red-100 to-rose-100'
                  : 'bg-gradient-to-r from-blue-50 to-cyan-50'
              }>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className={`w-5 h-5 ${
                      appointment.status === 'urgent' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <span className="text-lg">{appointment.patientName}</span>
                  </CardTitle>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Date & Time */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointment.time}
                    </p>
                  </div>
                </div>

                {/* Appointment Type */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500">Appointment Type</p>
                  <p className="font-medium text-gray-900">{appointment.type}</p>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className={`p-3 rounded-xl border ${
                    appointment.status === 'urgent'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {appointment.status === 'urgent' && (
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className={`font-medium ${
                          appointment.status === 'urgent' ? 'text-red-700' : 'text-gray-900'
                        }`}>{appointment.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 border-2 hover:bg-green-50 hover:border-green-300"
                  >
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 border-2 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => handleReschedule(appointment)}
                  >
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Reschedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[350px]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-t-2xl border-b border-blue-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Reschedule Appointment</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRescheduleAppointment(null)}
                  className="rounded-full hover:bg-gray-100 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Patient Info */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600">Patient</p>
                <p className="font-semibold text-gray-900">{rescheduleAppointment.patientName}</p>
              </div>

              {/* New Date */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-blue-200 rounded-xl bg-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* New Time */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-blue-200 rounded-xl bg-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Info Message */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    Patient will be automatically notified via message about the new appointment schedule.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 pb-6 flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 h-12 border-2 hover:bg-gray-50"
                onClick={() => setRescheduleAppointment(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={handleSaveReschedule}
                disabled={!newDate || !newTime}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-[340px]">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold mb-1">Appointment Rescheduled</p>
                <p className="text-sm text-green-100">
                  {rescheduledPatientName} has been notified about the new schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}