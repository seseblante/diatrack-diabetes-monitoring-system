import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, MapPin, Clock, Phone, Calendar, Edit, Save, X } from 'lucide-react';
import { getMyClinicDetails, updateMyClinicDetails, type ClinicDetails } from '../api/clinic';
import { getCurrentUser } from '../api/auth';

interface ClinicianClinicScheduleProps {
  onClose: () => void;
  onNavigateToSettings?: () => void;
}

export function ClinicianClinicSchedule({ onClose, onNavigateToSettings }: ClinicianClinicScheduleProps) {
  const [clinicDetails, setClinicDetails] = useState<ClinicDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        const details = await getMyClinicDetails();
        setClinicDetails(details);
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
          <p className="text-gray-600">Loading clinic details...</p>
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
          <div className="flex-1">
            <h1 className="text-xl font-semibold">🏥 My Clinic</h1>
            <p className="text-sm text-gray-500">{currentUser?.name || 'Clinician'}</p>
          </div>
          {onNavigateToSettings && (
            <Button
              onClick={onNavigateToSettings}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6 max-w-[375px] mx-auto">
          {/* Clinic Information */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span>Clinic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-white border-2 border-blue-200 shadow-sm space-y-3">
                <h3 className="font-semibold text-lg text-gray-900">{clinicDetails?.clinicName || 'Not set'}</h3>
                <p className="text-gray-700">{clinicDetails?.address || 'No address provided'}</p>
              </div>
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
              <div className="p-4 rounded-xl bg-white border-2 border-green-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">{clinicDetails?.scheduleDays || 'Not set'}</div>
                    <div className="text-gray-700 mt-1">{clinicDetails?.scheduleHours || 'No hours provided'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-6 h-6 text-purple-600" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-5 rounded-xl bg-white border-2 border-purple-200 shadow-sm">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">{clinicDetails?.contactPerson || 'Not set'}</h3>
                    <p className="text-sm text-gray-600 mb-4">Contact Person</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Phone</p>
                    <a 
                      href={`tel:${clinicDetails?.contactPhone}`}
                      className="text-lg font-semibold text-purple-700 hover:text-purple-800"
                    >
                      {clinicDetails?.contactPhone || 'No phone provided'}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {clinicDetails && onNavigateToSettings && (
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                  onClick={() => window.location.href = `tel:${clinicDetails.contactPhone}`}
                  disabled={!clinicDetails.contactPhone}
                >
                  📞 Call Contact
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-14 border-2 border-indigo-300 hover:bg-indigo-50 rounded-xl"
                  onClick={onNavigateToSettings}
                >
                  ✏️ Edit Clinic Details
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}