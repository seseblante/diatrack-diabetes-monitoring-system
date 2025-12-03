import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import logoImage from '../assets/logoImage.png';
import { post } from '../api/client';
import { register } from '../api/auth';


interface RegistrationPageProps {
  onBack: () => void;
  onRegister: () => void;
}

export function RegistrationPage({ onBack, onRegister }: RegistrationPageProps) {
  const [step, setStep] = useState<'form' | 'consent'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
    accountType: '',
    sex: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToConsent = () => {
    if (validateForm()) {
      setStep('consent');
    }
  };

  const handleRegister = async () => {
  if (!consentGiven) {
    return;
  }

  if (!validateForm()) {
    return;
  }

  setSubmitError(null);
  setIsSubmitting(true);

  try {
    const payload = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      role: formData.accountType === 'patient' ? 'PATIENT' : 'CLINICIAN',
      isConsentGiven: true,
      dob: formData.dateOfBirth || null,
      sex: formData.sex || null,
};

    await register(payload);
    onRegister();
  } catch (err: any) {
    setSubmitError(err.message || 'Registration failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
  };

  if (step === 'consent') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center space-x-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep('form')}
            className="rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Informed Consent</h2>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto min-h-0">
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Terms and Consent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <h3 className="font-semibold text-base mb-2">Purpose of Data Collection</h3>
                    <p>
                      DiaTrack collects and processes your health data to help you manage your 
                      diabetes effectively. This includes blood glucose readings, meal information, 
                      medication records, and other health-related data you choose to provide.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">How We Use Your Data</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Track and analyze your blood glucose trends</li>
                      <li>Provide personalized insights and recommendations</li>
                      <li>Enable communication with your healthcare providers</li>
                      <li>Generate reports for medical consultations</li>
                      <li>Send reminders and alerts for your health management</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Data Privacy and Security</h3>
                    <p>
                      Your health information is encrypted and stored securely. We follow industry 
                      best practices and comply with healthcare privacy regulations. Your data will 
                      never be sold to third parties. Only authorized healthcare providers you 
                      explicitly grant access to can view your information.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Sharing with Healthcare Providers</h3>
                    <p>
                      By registering, you authorize the sharing of your health data with clinicians 
                      and healthcare providers you explicitly connect with through the platform. You 
                      can revoke access at any time through your account settings.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Your Rights</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Access your data at any time</li>
                      <li>Request correction or deletion of your data</li>
                      <li>Export your data in a portable format</li>
                      <li>Withdraw consent and delete your account</li>
                      <li>Control who has access to your information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Limitations</h3>
                    <p>
                      DiaTrack is a health management tool and does not replace professional 
                      medical advice, diagnosis, or treatment. Always consult with your healthcare 
                      provider regarding your diabetes management. In case of medical emergencies, 
                      contact emergency services immediately.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Age Requirement</h3>
                    <p>
                      You must be at least 18 years old to create an account. For users under 18, 
                      a parent or legal guardian must create and manage the account.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-base mb-2 text-blue-900">Important Notice</h3>
                    <p className="text-blue-800">
                      This platform is designed for general diabetes management and education. It is 
                      not intended for collecting sensitive personally identifiable information (PII) 
                      beyond what is necessary for account creation and health tracking. Do not enter 
                      financial information, social security numbers, or other sensitive data not 
                      related to diabetes management.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              <div className="pt-4 border-t space-y-4">
                {submitError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={consentGiven}
                    onCheckedChange={(checked) => setConsentGiven(checked === true)}
                  />
                  <Label
                    htmlFor="consent"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I have read and understand the terms above. I consent to the collection, 
                    processing, and sharing of my health data as described. I understand that 
                    this tool does not replace medical advice and I will consult healthcare 
                    professionals for medical decisions.
                  </Label>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={!consentGiven || isSubmitting}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg"
                >
                  {isSubmitting ? 'Completing...' : 'Complete Registration'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center space-x-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Create Account</h2>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto min-h-0">
        <div className="space-y-6 pb-8">
          {/* App Logo */}
          <div className="text-center">
            <div className="w-20 h-20 flex items-center justify-center mx-auto">
              <img src={logoImage} alt="DiaTrack Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Join DiaTrack</h1>
            <p className="text-gray-600">Start managing your health today</p>
          </div>

          {/* Registration Form */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="pt-6 space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`h-14 text-lg bg-white border-gray-200 rounded-xl ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`h-14 text-lg bg-white border-gray-200 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className={`h-14 text-lg bg-white border-gray-200 rounded-xl ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Sex */}
              <div className="space-y-2">
                <Label htmlFor="sex">Sex (Optional)</Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => setFormData({ ...formData, sex: value })}
                >
                  <SelectTrigger className="h-14 text-lg bg-white border-gray-200 rounded-xl">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="X">Prefer not to say / Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`h-14 text-lg bg-white border-gray-200 rounded-xl ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type *</Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                >
                  <SelectTrigger className={`h-14 text-lg bg-white border-gray-200 rounded-xl ${errors.accountType ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="clinician">Healthcare Provider / Clinician</SelectItem>
                  </SelectContent>
                </Select>
                {errors.accountType && (
                  <p className="text-sm text-red-500">{errors.accountType}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`h-14 text-lg bg-white border-gray-200 rounded-xl pr-12 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`h-14 text-lg bg-white border-gray-200 rounded-xl pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Info Alert */}
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Your information is encrypted and stored securely. We never share your data without your consent.
                </AlertDescription>
              </Alert>

              {/* Continue Button */}
              <Button
                onClick={handleContinueToConsent}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg"
              >
                Continue to Consent
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}