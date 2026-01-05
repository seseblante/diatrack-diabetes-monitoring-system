import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowLeft, Calendar, Clock, User, Phone, AlertCircle, X, Check } from 'lucide-react';
import { getClinicianAppointments, updateNextAppointment, type Appointment } from '../api/clinician';
import { getCurrentUser } from '../api/auth';

interface ClinicianAppointmentsProps {
  onClose: () => void;
}

export function ClinicianAppointments({ onClose }: ClinicianAppointmentsProps) {
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [rescheduledPatientName, setRescheduledPatientName] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = await getCurrentUser();
        if (user?.id) {
          const appointmentsData = await getClinicianAppointments(user.id);
          setAppointments(appointmentsData);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'URGENT') {
      return <Badge className="bg-red-500 text-white">Urgent</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>;
  };

  const isUrgent = (appointmentDate: string) => {
    const now = new Date();
    const apptDate = new Date(appointmentDate);
    const diffDays = Math.ceil((apptDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const handleReschedule = (appointment: Appointment) => {
    setRescheduleAppointment(appointment);
    const apptDate = new Date(appointment.nextAppointmentAt);
    setNewDate(apptDate.toISOString().split('T')[0]);
    setNewTime(apptDate.toTimeString().slice(0, 5));
  };

  const handleSaveReschedule = async () => {
    if (rescheduleAppointment && newDate && newTime) {
      try {
        const appointmentDateTime = new Date(`${newDate}T${newTime}:00`).toISOString();
        await updateNextAppointment(rescheduleAppointment.id, appointmentDateTime);
        
        setAppointments(prev => prev.map(appt => 
          appt.id === rescheduleAppointment.id 
            ? { ...appt, nextAppointmentAt: appointmentDateTime }
            : appt
        ));
        
        setRescheduledPatientName(rescheduleAppointment.patientName);
        setRescheduleAppointment(null);
        setNewDate('');
        setNewTime('');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 4000);
      } catch (error) {
        console.error('Error rescheduling appointment:', error);
        alert('Failed to reschedule appointment');
      }
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
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No appointments scheduled</p>
              <p className="text-gray-500 text-sm mt-2">Appointments will appear here once scheduled</p>
            </div>
          </div>
        ) : (
        <div className="space-y-4 max-w-[375px] mx-auto">
          {appointments.map((appointment) => {
            const appointmentDate = new Date(appointment.nextAppointmentAt);
            const isAppointmentUrgent = isUrgent(appointment.nextAppointmentAt);
            return (
            <Card 
              key={appointment.id} 
              className={`shadow-lg ${
                isAppointmentUrgent
                  ? 'border-2 border-red-300 bg-gradient-to-r from-red-50 to-rose-50' 
                  : 'border-2 border-blue-200'
              }`}
            >
              <CardHeader className={
                isAppointmentUrgent
                  ? 'bg-gradient-to-r from-red-100 to-rose-100'
                  : 'bg-gradient-to-r from-blue-50 to-cyan-50'
              }>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className={`w-5 h-5 ${
                      isAppointmentUrgent ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <span className="text-lg">{appointment.patientName}</span>
                  </CardTitle>
                  {getStatusBadge(isAppointmentUrgent ? 'URGENT' : appointment.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Date & Time */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {appointmentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointmentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                </div>

                {/* Patient Contact */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500">Patient Contact</p>
                  <p className="font-medium text-gray-900">{appointment.patientPhone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{appointment.patientEmail || 'N/A'}</p>
                </div>

                {/* Urgency Warning */}
                {isAppointmentUrgent && (
                  <div className="p-3 rounded-xl border bg-red-50 border-red-200">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium text-red-700">Upcoming appointment within 3 days</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 border-2 hover:bg-green-50 hover:border-green-300"
                    onClick={() => {
                      if (appointment.patientPhone) {
                        window.location.href = `tel:${appointment.patientPhone}`;
                      }
                    }}
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
          );})}
        </div>
        )}
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