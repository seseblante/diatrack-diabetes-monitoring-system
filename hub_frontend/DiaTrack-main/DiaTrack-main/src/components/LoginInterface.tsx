import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Heart, Eye, EyeOff } from 'lucide-react';
import logoImage from '../assets/logoImage.png';
import { login } from '../api/auth';

interface LoginInterfaceProps {
  onLogin: (userType: 'patient' | 'clinician') => void;
  onCreateAccount: () => void;
}

export function LoginInterface({ onLogin, onCreateAccount }: LoginInterfaceProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check for saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError(null);
    
    // Save credentials if Remember Me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }
    
    try {
      const response = await login(email, password);
      // Use the role from backend response to determine which dashboard to show
      const userRole = response.user.role.toLowerCase();
      if (userRole === 'patient' || userRole === 'clinician') {
        onLogin(userRole as 'patient' | 'clinician');
      } else {
        setLoginError('Invalid user role. Please contact support.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col overflow-hidden pt-11">
      {/* Header with Logo */}
      <div className="flex-1 flex flex-col justify-center px-6 py-4">
        <div className="space-y-4">
          {/* App Logo & Branding */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 flex items-center justify-center mx-auto">
              <img src={logoImage} alt="DiaTrack Logo" className="w-16 h-16 rounded-xl" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">DiaTrack</h1>
              <p className="text-gray-600">Your health companion</p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg">Welcome Back</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Login Form */}
              <div className="space-y-3">
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-white border-gray-200 rounded-xl"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-white border-gray-200 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
              </div>

              {/* Regular Login Button */}
              <Button
                onClick={handleLogin}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Error Message */}
              {loginError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {loginError}
                </div>
              )}

              {/* Help Links */}
              <div className="flex justify-center text-sm">
                <button className="text-gray-500 hover:underline">Need help?</button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600">New to DiaTrack?</p>
            <Button 
              variant="link" 
              className="text-blue-600 p-0 h-auto"
              onClick={onCreateAccount}
            >
              Create account - it's free!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}