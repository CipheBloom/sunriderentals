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
    <div className="min-h-screen flex items-center justify-center bg-blue-200 p-4">
      <Card className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 border-4 border-black flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-black text-black">ADMIN LOGIN</CardTitle>
          <CardDescription className="text-black font-bold">
            Sign in to manage SunRide Rentals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border-4 border-black flex items-center gap-2 text-red-600 text-sm font-black">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-black font-black">
                <Mail className="w-4 h-4" />
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sunriderentals.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-4 border-black font-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-black font-black">
                <Lock className="w-4 h-4" />
                PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10 border-4 border-black font-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-blue-600 font-black"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
              disabled={isLoading}
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-black font-black hover:text-blue-600 border-2 border-transparent hover:border-blue-300 px-2 py-1 transition-all">
              ← BACK TO HOME
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
