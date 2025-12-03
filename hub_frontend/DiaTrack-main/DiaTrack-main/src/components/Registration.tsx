import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, UserPlus, Stethoscope, User as UserIcon } from 'lucide-react';
import logoImage from '../assets/logoImage.png';
import { register as apiRegister } from '../api/auth';

interface RegistrationProps {
  onBack: () => void;
}

type UserRole = 'PATIENT' | 'CLINICIAN';

export function Registration({ onBack }: RegistrationProps) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    sex: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password || !formData.fullName || !formData.dateOfBirth) {
      setError('Please fill in all required fields, including date of birth');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await apiRegister({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        role: role || 'PATIENT',
        isConsentGiven: true,
        dob: formData.dateOfBirth || null,
        sex: formData.sex || null,
      });

      // Success - show message and redirect to login
      alert(
        `Registration successful! ${
          role === 'CLINICIAN'
            ? 'Please wait for admin approval before logging in.'
            : 'You can now log in.'
        }`
      );
      onBack();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logoImage} alt="DiaTrack Logo" className="h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Choose your account type</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-400"
              onClick={() => setRole('PATIENT')}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">Patient</h3>
                    <p className="text-sm text-gray-600">Track your diabetes and connect with clinicians</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-400"
              onClick={() => setRole('CLINICIAN')}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">Clinician</h3>
                    <p className="text-sm text-gray-600">Monitor and manage your patients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full mt-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logoImage} alt="DiaTrack Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            {role === 'PATIENT' ? 'Patient' : 'Clinician'} Registration
          </h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-6 h-6" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sex (Optional)
                </label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select sex</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="X">Prefer not to say / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  required
                  className="h-12"
                />
              </div>

              {role === 'CLINICIAN' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Clinician accounts require admin approval before you can log in.
                    You will be notified once your account is approved.
                  </p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setRole(null)}
                  variant="outline"
                  className="flex-1 h-12"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Button
          onClick={onBack}
          variant="ghost"
          className="w-full mt-4"
        >
          Already have an account? Log in
        </Button>
      </div>
    </div>
  );
}
