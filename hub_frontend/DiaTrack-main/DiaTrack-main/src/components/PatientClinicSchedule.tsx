import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, MapPin, Clock, Phone, Calendar } from 'lucide-react';
import { getCurrentUser } from '../api/auth';
import { getPatientClinicians } from '../api/patient';
import { getClinicianDetails, type ClinicDetails } from '../api/clinic';

interface PatientClinicScheduleProps {
  onClose: () => void;
}

export function PatientClinicSchedule({ onClose }: PatientClinicScheduleProps) {
  const [clinicDetails, setClinicDetails] = useState<ClinicDetails | null>(null);
  const [clinicianName, setClinicianName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        if (user?.id) {
          // Get patient's clinicians
          const clinicians = await getPatientClinicians(user.id);
          
          if (clinicians.length > 0) {
            // Get clinic details for the first clinician
            const firstClinician = clinicians[0];
            setClinicianName(firstClinician.clinicianName);
            
            const details = await getClinicianDetails(firstClinician.clinicianId);
            setClinicDetails(details);
          }
        }
      } catch (error) {
        console.error('Error fetching clinic details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center pt-11">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clinic information...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-gray-500">{clinicianName || 'Your Clinician'}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6 max-w-[375px] mx-auto">
          {/* Clinic Information */}
          {clinicDetails ? (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <span>Clinic Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-white border-2 border-blue-200 shadow-sm">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{clinicDetails.clinicName}</h3>
                  <p className="text-gray-700">{clinicDetails.address}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No clinic information available</p>
              </CardContent>
            </Card>
          )}

          {/* Consulting Schedule */}
          {clinicDetails && (
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <span>Consulting Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-xl bg-white border-2 border-green-200 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{clinicDetails.scheduleDays || 'Schedule not set'}</div>
                      <div className="text-lg text-gray-800 mt-1">{clinicDetails.scheduleHours || 'Hours not set'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {clinicDetails && (
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-6 h-6 text-purple-600" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-5 rounded-xl bg-white border-2 border-purple-200 shadow-sm">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">{clinicDetails.contactPerson || 'Contact Person'}</h3>
                      <p className="text-sm text-gray-600 mb-4">Clinic Contact</p>
                    </div>
                    <div className="space-y-3 text-left">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Phone</p>
                        <a 
                          href={`tel:${clinicDetails.contactPhone}`}
                          className="text-lg font-semibold text-purple-700 hover:text-purple-800"
                        >
                          {clinicDetails.contactPhone || 'Not available'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-100 border border-purple-300 rounded-xl">
                  <p className="text-sm text-gray-700 text-center">
                    💡 <span className="font-medium">For appointments:</span> Please call the clinic contact number
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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