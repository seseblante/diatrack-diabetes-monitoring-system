import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, User, Pill, Plus, Trash2, Check, Edit2, Save } from 'lucide-react';
import { getCurrentUser } from '../api/auth';
import { getCurrentUserProfile, PatientDetail, updatePatientProfile, PatientUpdateRequest } from '../api/patient';
import { getMedicationRegimens, MedicationRegimen } from '../api/medications';

interface PatientMedicalProfileProps {
  onClose: () => void;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export function PatientMedicalProfile({ onClose }: PatientMedicalProfileProps) {
  const currentUser = getCurrentUser();
  const [patientData, setPatientData] = useState<PatientDetail | null>(null);
  const [medications, setMedications] = useState<MedicationRegimen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch patient data and medications from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;
      
      try {
        const [profileData, medicationData] = await Promise.all([
          getCurrentUserProfile(),
          getMedicationRegimens(currentUser.id)
        ]);
        
        setPatientData(profileData);
        setMedications(medicationData);
        setEditedPhone(profileData.phone || '');
        setEditedEmail(profileData.email || '');
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser?.id]);
  
  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPhone(patientData?.phone || '');
    setEditedEmail(patientData?.email || '');
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;
    
    setIsSaving(true);
    try {
      const updateRequest: PatientUpdateRequest = {
        phone: editedPhone,
      };
      
      const updatedProfile = await updatePatientProfile(currentUser.id, updateRequest);
      setPatientData(updatedProfile);
      setIsEditing(false);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col pt-11">
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
            <h1 className="text-xl font-semibold">📋 Medical Profile</h1>
            <p className="text-sm text-gray-500">Manage your health information</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6 max-w-[375px] mx-auto">
          {/* Personal Information */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-6 h-6 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block font-medium mb-2 text-gray-700">Full Name</label>
                <Input 
                  placeholder="Full Name" 
                  className="h-14 border-2 border-blue-300 rounded-xl bg-white"
                  value={patientData?.fullName || ''}
                  readOnly
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Email</label>
                <Input 
                  placeholder="Email" 
                  className="h-14 border-2 border-blue-300 rounded-xl bg-white"
                  value={patientData?.email || ''}
                  readOnly
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Phone Number</label>
                <Input 
                  placeholder="Phone Number" 
                  className="h-14 border-2 border-blue-300 rounded-xl bg-white"
                  value={isEditing ? editedPhone : (patientData?.phone || '')}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  readOnly={!isEditing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Age</label>
                  <Input 
                    type="number" 
                    placeholder="Age" 
                    className="h-14 border-2 border-blue-300 rounded-xl bg-white"
                    value={patientData?.dob ? calculateAge(patientData.dob) : ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Sex</label>
                  <Input 
                    placeholder="Sex" 
                    className="h-14 border-2 border-blue-300 rounded-xl bg-white"
                    value={patientData?.sex || ''}
                    readOnly
                  />
                </div>
              </div>
              {!isEditing ? (
                <Button 
                  onClick={handleEdit}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Contact Info
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medication Schedule */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="w-6 h-6 text-purple-600" />
                <span>Current Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications.length > 0 ? (
                medications.map((medication) => (
                  <div key={medication.id} className="p-4 bg-white rounded-xl border-2 border-purple-200">
                    <div className="space-y-2">
                      <div className="font-semibold text-lg text-gray-900">{medication.medicationName}</div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dosage:</span> {medication.doseAmount} {medication.doseUnit}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span> {medication.frequencyValue}x {medication.frequencyType.toLowerCase()}
                        </div>
                      </div>
                      {medication.instructions && (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Instructions:</span> {medication.instructions}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No medications prescribed</p>
                  <p className="text-sm">Contact your doctor to add medications</p>
                </div>
              )}
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Medications are managed by your healthcare provider. 
                  Contact your doctor if you need changes to your medication regimen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
                  Your medical profile has been saved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
