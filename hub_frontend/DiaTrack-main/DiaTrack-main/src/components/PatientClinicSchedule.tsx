import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, MapPin, Clock, Phone, Calendar } from 'lucide-react';

interface PatientClinicScheduleProps {
  onClose: () => void;
}

export function PatientClinicSchedule({ onClose }: PatientClinicScheduleProps) {
  // Mock clinic data
  const clinics = [
    {
      id: 1,
      name: 'Makati Medical Center',
      address: '2 Amorsolo St, Legaspi Village, Makati City',
      floor: '5th Floor, Diabetes Care Unit'
    },
    {
      id: 2,
      name: 'St. Luke\'s Medical Center',
      address: '279 E. Rodriguez Sr. Ave, Quezon City',
      floor: '3rd Floor, Endocrinology Department'
    },
    {
      id: 3,
      name: 'The Medical City',
      address: 'Ortigas Avenue, Pasig City',
      floor: '4th Floor, Metabolic Clinic'
    }
  ];

  const schedule = [
    { day: 'Monday', time: '9:00 AM - 12:00 PM', location: 'Makati Medical Center' },
    { day: 'Monday', time: '2:00 PM - 5:00 PM', location: 'St. Luke\'s Medical Center' },
    { day: 'Wednesday', time: '9:00 AM - 12:00 PM', location: 'Makati Medical Center' },
    { day: 'Wednesday', time: '2:00 PM - 5:00 PM', location: 'The Medical City' },
    { day: 'Friday', time: '9:00 AM - 12:00 PM', location: 'St. Luke\'s Medical Center' },
    { day: 'Friday', time: '2:00 PM - 5:00 PM', location: 'The Medical City' }
  ];

  const secretary = {
    name: 'Maria Santos',
    phone: '(02) 8888-9999',
    mobile: '+63 917 123 4567',
    email: 'maria.santos@clinic.com'
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
            <h1 className="text-xl font-semibold">🏥 Clinic Information</h1>
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
                  <p className="text-sm text-blue-700 font-medium">{clinic.floor}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Consulting Schedule */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-green-600" />
                <span>Consulting Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedule.map((slot, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl bg-white border-2 border-green-200 shadow-sm"
                >
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{slot.day}</div>
                      <div className="text-lg text-gray-800 mt-1">{slot.time}</div>
                      <div className="text-sm text-gray-600 mt-1">📍 {slot.location}</div>
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
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-100 border border-purple-300 rounded-xl">
                <p className="text-sm text-gray-700 text-center">
                  💡 <span className="font-medium">For appointments:</span> Please call during office hours (Mon-Fri, 8AM-6PM)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚕️</span>
                  <p className="text-gray-700">Bring your glucose monitor and medication list to each appointment.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🆘</span>
                  <p className="text-gray-700">For emergencies, go directly to the nearest hospital emergency room.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}