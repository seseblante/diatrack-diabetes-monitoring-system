import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, Shield } from 'lucide-react';
import logoImage from '../assets/logoImage.png';

interface DataPrivacyConsentProps {
  onBack: () => void;
  onAgree: () => void;
}

export function DataPrivacyConsent({ onBack, onAgree }: DataPrivacyConsentProps) {
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (agreed) {
      onAgree();
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logoImage} alt="DiaTrack Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Data Privacy Notice</h1>
          <p className="text-gray-600 mt-2">Please review before continuing</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span>Registration Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  At Diatrack, we are committed to protecting your privacy and handling your personal and health data with care and transparency. By registering an account and using the application, you acknowledge that you have read, understood and accepted the practices described in this notice.
                </p>

                <div>
                  <h3 className="font-semibold text-base mb-2">Information We Collect</h3>
                  <p>
                    When you register, access, and use the app, different categories of information may be collected. These include account and registration data, health-related information such as glucose readings, insulin dosages, meal logs, and medical history, device and usage data, and optional permission-based data if enabled by the user.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">How We Use Your Data</h3>
                  <p>
                    We use your data in order to open and manage your account, provide you with the application's services, improve and maintain the Diatrack's functionality, fix bugs, manage performance, conduct analytics, notify you of updates and reminders, and to protect its users, and our system from fraud, unauthorized access or misuse.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">Data Sharing</h3>
                  <p>
                    We will not share your personal or health information with third parties unless you give your explicit consent or when required by law, regulation or governmental order. Data used for analytics and research purposes are aggregated or de-identified so that it cannot identify you personally.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">Data Retention</h3>
                  <p>
                    We retain your personal, usage and health data for as long as your account remains active, and thereafter for a reasonable period to comply with our legal, security, and business obligations. Usage logs may be retained longer in anonymized or aggregated form. If you request deletion of your account or data, we will erase or anonymize your records as required, unless retention is required by law.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">Your Rights</h3>
                  <p>
                    You have the right to access your personal and health data, update or complete your data if it is inaccurate or incomplete, request deletion or deactivation of your account and associated data, be informed of how your data is processed, and raise a complaint if you believe your rights have been violated.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">Security Measures</h3>
                  <p>
                    We deploy technical and organizational safeguards designed to protect your data from unauthorized access, alteration, disclosure or destruction. Such measures include role-based access controls, regular security audits, secure hosting environment, and incident-response procedures. While we strive for strong security, no system can guarantee absolute protection.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">Updates to This Notice</h3>
                  <p>
                    We may update this Data Privacy Notice from time to time. If you continue using the application after the updated notice is posted, you accept the changes.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-base mb-2 text-blue-900">Legal Compliance</h3>
                  <p className="text-blue-800">
                    Diatrack is committed to complying with the Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and regulations, as well as other applicable Philippine laws. All personal and health data are collected, stored, processed, and shared in accordance with these legal requirements to ensure your privacy, security, and rights are fully respected.
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-base mb-2 text-yellow-900">Your Consent</h3>
                  <p className="text-yellow-800">
                    By tapping "I Agree" or completing registration, you confirm that you have read this notice, that you understand how we collect, use, share, and protect your data; and that you give your consent to the processing described above. If you do not agree with any part of this Notice, please do not proceed with registration or discontinue use of this application.
                  </p>
                </div>
              </div>
            </ScrollArea>

            <div className="pt-6 space-y-4 border-t mt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy-consent"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                />
                <Label
                  htmlFor="privacy-consent"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  I have read and understood the Data Privacy Notice. I agree to the collection, use, sharing, and protection of my personal and health data as described above.
                </Label>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!agreed}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  I Agree - Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
