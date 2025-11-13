import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, User, Pill, Plus, Trash2, Check } from 'lucide-react';

interface PatientMedicalProfileProps {
  onClose: () => void;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export function PatientMedicalProfile({ onClose }: PatientMedicalProfileProps) {
  const [fullName, setFullName] = useState('Juan Dela Cruz');
  const [age, setAge] = useState('45');
  const [diagnosisYear, setDiagnosisYear] = useState('2018');
  const [medications, setMedications] = useState<Medication[]>([
    { name: 'Metformin', dosage: '500 mg', frequency: 'Morning' },
    { name: 'Insulin (Long-acting)', dosage: '20 units', frequency: 'Evening' },
  ]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSave = () => {
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

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
                  placeholder="Juan Dela Cruz" 
                  className="h-14 border-2 border-blue-300 rounded-xl bg-white"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Age</label>
                  <Input 
                    type="number" 
                    placeholder="45" 
                    className="h-14 border-2 border-blue-300 rounded-xl bg-white"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Diagnosis Year</label>
                  <Input 
                    type="number" 
                    placeholder="2018" 
                    className="h-14 border-2 border-blue-300 rounded-xl bg-white"
                    value={diagnosisYear}
                    onChange={(e) => setDiagnosisYear(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medication Schedule */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="w-6 h-6 text-purple-600" />
                  <span>Medication Schedule</span>
                </CardTitle>
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 h-10"
                  onClick={addMedication}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications.map((medication, index) => (
                <div key={index} className="p-4 bg-white rounded-xl border-2 border-purple-200 relative">
                  <div className="space-y-3">
                    <Input 
                      placeholder="Medication name (e.g., Metformin)" 
                      className="h-12 border-2 border-purple-300 rounded-xl"
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input 
                        placeholder="Dosage" 
                        className="h-12 border-2 border-purple-300 rounded-xl"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      />
                      <Input 
                        placeholder="Frequency" 
                        className="h-12 border-2 border-purple-300 rounded-xl"
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      />
                    </div>
                  </div>
                  {medications.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-red-100"
                      onClick={() => removeMedication(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
            onClick={handleSave}
          >
            <Check className="w-5 h-5 mr-2" />
            Save Medical Profile
          </Button>
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
