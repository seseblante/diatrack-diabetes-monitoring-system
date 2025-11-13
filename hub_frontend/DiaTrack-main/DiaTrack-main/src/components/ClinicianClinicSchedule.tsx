import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, MapPin, Clock, Phone, Calendar, Edit } from 'lucide-react';

interface ClinicianClinicScheduleProps {
  onClose: () => void;
}

export function ClinicianClinicSchedule({ onClose }: ClinicianClinicScheduleProps) {
  // Mock clinic data
  const clinics = [
    {
      id: 1,
      name: 'Makati Medical Center',
      address: '2 Amorsolo St, Legaspi Village, Makati City',
      floor: '5th Floor, Diabetes Care Unit',
      phone: '(02) 8888-8000'
    },
    {
      id: 2,
      name: 'St. Luke\'s Medical Center',
      address: '279 E. Rodriguez Sr. Ave, Quezon City',
      floor: '3rd Floor, Endocrinology Department',
      phone: '(02) 7789-7700'
    },
    {
      id: 3,
      name: 'The Medical City',
      address: 'Ortigas Avenue, Pasig City',
      floor: '4th Floor, Metabolic Clinic',
      phone: '(02) 8988-1000'
    }
  ];

  const schedule = [
    { day: 'Monday', time: '9:00 AM - 12:00 PM', location: 'Makati Medical Center', patients: 12 },
    { day: 'Monday', time: '2:00 PM - 5:00 PM', location: 'St. Luke\'s Medical Center', patients: 10 },
    { day: 'Wednesday', time: '9:00 AM - 12:00 PM', location: 'Makati Medical Center', patients: 14 },
    { day: 'Wednesday', time: '2:00 PM - 5:00 PM', location: 'The Medical City', patients: 11 },
    { day: 'Friday', time: '9:00 AM - 12:00 PM', location: 'St. Luke\'s Medical Center', patients: 13 },
    { day: 'Friday', time: '2:00 PM - 5:00 PM', location: 'The Medical City', patients: 9 }
  ];

  const secretary = {
    name: 'Maria Santos',
    phone: '(02) 8888-9999',
    mobile: '+63 917 123 4567',
    email: 'maria.santos@clinic.com',
    hours: 'Monday - Friday, 8:00 AM - 6:00 PM'
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
            <h1 className="text-xl font-semibold">🏥 My Clinics</h1>
            <p className="text-sm text-gray-500">Dr. Maria Rodriguez, MD</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6 max-w-[375px] mx-auto">
          {/* Clinic Locations */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span>Clinic Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clinics.map((clinic) => (
                <div 
                  key={clinic.id} 
                  className="p-4 rounded-xl bg-white border-2 border-blue-200 shadow-sm"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{clinic.name}</h3>
                  <p className="text-gray-700 mb-1">{clinic.address}</p>
                  <p className="text-sm text-blue-700 font-medium mb-2">{clinic.floor}</p>
                  <div className="flex items-center text-gray-600 text-sm mt-2">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${clinic.phone}`} className="hover:text-blue-600">
                      {clinic.phone}
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Consulting Schedule */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-green-600" />
                <span>My Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedule.map((slot, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl bg-white border-2 border-green-200 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Clock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{slot.day}</div>
                        <div className="text-lg text-gray-800 mt-1">{slot.time}</div>
                        <div className="text-sm text-gray-600 mt-1">📍 {slot.location}</div>
                      </div>
                    </div>
                    <div className="ml-2">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {slot.patients} pts
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Secretary Contact */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-6 h-6 text-purple-600" />
                <span>Secretary Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-5 rounded-xl bg-white border-2 border-purple-200 shadow-sm">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">{secretary.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">Clinic Secretary</p>
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Office Phone</p>
                      <a 
                        href={`tel:${secretary.phone}`}
                        className="text-lg font-semibold text-purple-700 hover:text-purple-800"
                      >
                        {secretary.phone}
                      </a>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Mobile Phone</p>
                      <a 
                        href={`tel:${secretary.mobile}`}
                        className="text-lg font-semibold text-purple-700 hover:text-purple-800"
                      >
                        {secretary.mobile}
                      </a>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Email</p>
                      <a 
                        href={`mailto:${secretary.email}`}
                        className="text-sm font-medium text-purple-700 hover:text-purple-800 break-all"
                      >
                        {secretary.email}
                      </a>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Office Hours</p>
                      <p className="text-sm font-medium text-gray-800">{secretary.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-100 border border-purple-300 rounded-xl">
                <p className="text-sm text-gray-700 text-center">
                  💼 <span className="font-medium">Note:</span> Secretary handles appointment scheduling, rescheduling, and general inquiries.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                📞 Call Secretary
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-14 border-2 border-indigo-300 hover:bg-indigo-50 rounded-xl"
              >
                📧 Email Secretary
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-14 border-2 border-indigo-300 hover:bg-indigo-50 rounded-xl"
              >
                🗓️ View Full Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}