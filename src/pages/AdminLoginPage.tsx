import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { adminAPI } from '@/lib/api';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First try backend validation
      const response = await adminAPI.login(email, password);
      
      if (response.success) {
        // Also update local auth context
        const success = await login(email, password);
        if (success) {
          navigate('/admin/dashboard');
        } else {
          setError('Authentication failed');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      // Fallback to local validation if backend fails
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <Card className="w-full max-w-md border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 border-4 border-black bg-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <CardTitle className="text-2xl font-black text-black">Admin Login</CardTitle>
          <CardDescription className="text-black font-medium">
            Sign in to manage SunRide Rentals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 border-4 border-black bg-red-100 flex items-center gap-2 text-black font-bold">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 font-bold text-black">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sunriderentals.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 font-bold text-black">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-black"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm font-bold text-black hover:text-blue-600">
              ← Back to Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
