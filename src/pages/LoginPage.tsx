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
    <div className="container flex h-screen w-screen flex-col items-center justify-center px-4 md:px-6 bg-blue-200">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Bike className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-black">WELCOME TO SUNRIDE</h1>
          <p className="text-sm text-black font-bold bg-blue-100 p-3 border-4 border-black">
            Sign in with your Google account to book bikes and manage your rentals
          </p>
        </div>

        <div className="grid gap-4">
          <div className="flex justify-center py-4">
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
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-4 border-black"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-blue-200 px-2 text-black font-black">
                WHY SIGN IN?
              </span>
            </div>
          </div>

          <div className="grid gap-4 text-sm">
            <div className="flex items-center gap-3 bg-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-black text-black">SECURE BOOKING MANAGEMENT</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-black text-black">TRACK YOUR RENTAL HISTORY</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-black text-black">EASY PICKUP AND DROP-OFF</span>
            </div>
          </div>
        </div>

        <p className="px-8 text-center text-sm text-black font-bold">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline underline-offset-4 hover:text-blue-600 border-2 border-transparent hover:border-blue-300 px-1 transition-all">
            TERMS OF SERVICE
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-4 hover:text-blue-600 border-2 border-transparent hover:border-blue-300 px-1 transition-all">
            PRIVACY POLICY
          </a>
          .
        </p>
      </div>
    </div>
  );
}
