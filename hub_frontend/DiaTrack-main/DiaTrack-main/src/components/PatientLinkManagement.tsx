import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, UserPlus, CheckCircle } from 'lucide-react';
import { searchPatients, type PatientDetail } from '../api/patient';
import { createPatientClinicianLink } from '../api/clinician';

interface PatientLinkManagementProps {
  clinicianId: string;
  onClose: () => void;
}

export function PatientLinkManagement({ clinicianId, onClose }: PatientLinkManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PatientDetail[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [linkedPatients, setLinkedPatients] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search term');
      return;
    }
    
    try {
      setIsSearching(true);
      console.log('Searching for:', searchQuery);
      const results = await searchPatients(searchQuery);
      console.log('Search results:', results);
      setSearchResults(results);
      
      if (results.length === 0) {
        alert(`No patients found matching "${searchQuery}". Try searching by full name or email.`);
      }
    } catch (error: any) {
      console.error('Error searching patients:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to search patients: ${errorMessage}\n\nPlease check the console for details.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLinkPatient = async (patientId: string) => {
    try {
      await createPatientClinicianLink(patientId, clinicianId);
      setLinkedPatients(prev => new Set(prev).add(patientId));
      alert('Patient linked successfully!');
    } catch (error) {
      console.error('Error linking patient:', error);
      alert('Failed to link patient. They may already be linked.');
    }
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
            <h1 className="text-xl font-semibold text-gray-900">Link Patients</h1>
            <p className="text-sm text-gray-500">Search and connect with patients</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Search Bar */}
        <Card className="mb-6 shadow-lg border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Search Patients</span>
            </CardTitle>
            <CardDescription>
              Search by patient email address
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter patient email..."
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {searchResults.length} patient(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {searchResults.map((patient) => {
                  const isLinked = linkedPatients.has(patient.id);
                  
                  return (
                    <Card 
                      key={patient.id}
                      className="border-2 hover:border-blue-300 transition-colors"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {patient.fullName}
                            </h3>
                            <p className="text-sm text-gray-600">{patient.email}</p>
                            {patient.phone && (
                              <p className="text-sm text-gray-500">{patient.phone}</p>
                            )}
                          </div>
                          
                          {isLinked ? (
                            <Badge className="bg-green-600 flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Linked</span>
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => handleLinkPatient(patient.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Link Patient
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isSearching && searchResults.length === 0 && searchQuery && (
          <Card className="shadow-lg">
            <CardContent className="pt-6 pb-6 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No patients found matching "{searchQuery}"</p>
              <p className="text-sm text-gray-500 mt-2">
                Try searching with a different name or email
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isSearching && (
          <Card className="shadow-lg">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for patients...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
