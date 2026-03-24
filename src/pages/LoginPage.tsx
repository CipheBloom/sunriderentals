import { GoogleLogin } from '@react-oauth/google';
import { Bike, Shield, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 border-4 border-black bg-blue-500 text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Bike className="w-5 h-5" />
            <span>SunRide Rentals</span>
          </div>
          <h1 className="text-3xl font-black text-black">Welcome Back</h1>
          <p className="text-black font-medium mt-2">Sign in to continue your journey</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="p-6">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    login({ credential: credentialResponse.credential });
                  }
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
                theme="outline"
                size="large"
                width="300"
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-black font-medium text-sm">
                New here?{' '}
                <span className="text-blue-600 font-bold">
                  Sign up automatically with Google
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-10 h-10 border-2 border-black bg-blue-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-bold text-black">Secure Login</p>
              <p className="text-sm text-black font-medium">Your data is protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-10 h-10 border-2 border-black bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-bold text-black">Quick Access</p>
              <p className="text-sm text-black font-medium">Book scooters in seconds</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-10 h-10 border-2 border-black bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-bold text-black">Easy Pickup</p>
              <p className="text-sm text-black font-medium">Find scooters near you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
