import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Pill,
  Clock,
  Calendar,
  Save,
  X
} from 'lucide-react';
import { 
  getMedicationRegimens, 
  createMedicationRegimen, 
  updateMedicationRegimen,
  type MedicationRegimen,
  type MedicationRegimenRequest
} from '../api/medications';

interface ClinicianMedicationManagementProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
}

export function ClinicianMedicationManagement({ 
  patientId, 
  patientName, 
  onClose 
}: ClinicianMedicationManagementProps) {
  const [medications, setMedications] = useState<MedicationRegimen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<MedicationRegimen | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<MedicationRegimenRequest>({
    medicationName: '',
    doseAmount: 0,
    doseUnit: 'mg',
    frequencyType: 'DAILY',
    frequencyValue: 1,
    timesOfDay: ['08:00']
  });

  useEffect(() => {
    fetchMedications();
  }, [patientId]);

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      const data = await getMedicationRegimens(patientId);
      setMedications(data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingMedication) {
        await updateMedicationRegimen(patientId, editingMedication.id, formData);
      } else {
        await createMedicationRegimen(patientId, formData);
      }
      
      // Reset form and refresh
      setFormData({
        medicationName: '',
        doseAmount: 0,
        doseUnit: 'mg',
        frequencyType: 'DAILY',
        frequencyValue: 1,
        timesOfDay: ['08:00']
      });
      setShowAddForm(false);
      setEditingMedication(null);
      await fetchMedications();
    } catch (error) {
      console.error('Error saving medication:', error);
      alert('Failed to save medication. Please try again.');
    }
  };

  const handleEdit = (medication: MedicationRegimen) => {
    setEditingMedication(medication);
    setFormData({
      medicationName: medication.medicationName,
      doseAmount: medication.doseAmount,
      doseUnit: medication.doseUnit,
      frequencyType: medication.frequencyType,
      frequencyValue: medication.frequencyValue,
      timesOfDay: medication.timesOfDay
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingMedication(null);
    setFormData({
      medicationName: '',
      doseAmount: 0,
      doseUnit: 'mg',
      frequencyType: 'DAILY',
      frequencyValue: 1,
      timesOfDay: ['08:00']
    });
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timesOfDay: [...formData.timesOfDay, '12:00']
    });
  };

  const removeTimeSlot = (index: number) => {
    setFormData({
      ...formData,
      timesOfDay: formData.timesOfDay.filter((_, i) => i !== index)
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimes = [...formData.timesOfDay];
    newTimes[index] = value;
    setFormData({
      ...formData,
      timesOfDay: newTimes
    });
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden pt-11">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="w-10 h-10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Medication Management</h1>
            <p className="text-sm text-gray-500">{patientName}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Add Medication Button */}
        {!showAddForm && (
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Medication
          </Button>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6 border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <span>{editingMedication ? 'Edit Medication' : 'New Medication'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label htmlFor="medicationName">Medication Name</Label>
                <Input
                  id="medicationName"
                  value={formData.medicationName}
                  onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                  placeholder="e.g., Metformin"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doseAmount">Dose Amount</Label>
                  <Input
                    id="doseAmount"
                    type="number"
                    value={formData.doseAmount}
                    onChange={(e) => setFormData({ ...formData, doseAmount: parseFloat(e.target.value) })}
                    placeholder="500"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="doseUnit">Unit</Label>
                  <select
                    id="doseUnit"
                    value={formData.doseUnit}
                    onChange={(e) => setFormData({ ...formData, doseUnit: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                  >
                    <option value="mg">mg</option>
                    <option value="mcg">mcg</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequencyType">Frequency</Label>
                  <select
                    id="frequencyType"
                    value={formData.frequencyType}
                    onChange={(e) => setFormData({ ...formData, frequencyType: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="AS_NEEDED">As Needed</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="frequencyValue">Times per {formData.frequencyType === 'DAILY' ? 'day' : 'week'}</Label>
                  <Input
                    id="frequencyValue"
                    type="number"
                    min="1"
                    value={formData.frequencyValue}
                    onChange={(e) => setFormData({ ...formData, frequencyValue: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Times of Day</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={addTimeSlot}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.timesOfDay.map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="flex-1"
                      />
                      {formData.timesOfDay.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingMedication ? 'Update' : 'Save'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medications List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>
              {medications.filter(m => m.isActive).length} active medication(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading medications...</p>
              </div>
            ) : medications.length === 0 ? (
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No medications added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medications.map((medication) => (
                  <Card 
                    key={medication.id} 
                    className={`border-2 ${medication.isActive ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {medication.medicationName}
                            </h3>
                            <Badge variant={medication.isActive ? 'default' : 'secondary'}>
                              {medication.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-gray-700 font-medium">
                            {medication.doseAmount} {medication.doseUnit}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(medication)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {medication.frequencyValue}x {medication.frequencyType.toLowerCase()}
                          </span>
                        </div>
                        
                        {medication.timesOfDay && medication.timesOfDay.length > 0 && (
                          <div className="flex items-start space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 mt-0.5" />
                            <div className="flex flex-wrap gap-2">
                              {medication.timesOfDay.map((time, index) => (
                                <Badge key={index} variant="outline" className="bg-white">
                                  {time}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
