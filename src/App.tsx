import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/pages/LandingPage';
import { ScootyPage } from '@/pages/ScootyPage';
import { LoginPage } from '@/pages/LoginPage';
import { Dashboard } from '@/pages/Dashboard';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { RiderApplicationPage } from '@/pages/RiderApplicationPage';

const GOOGLE_CLIENT_ID = '369730187778-3q3ndvcj7s80ltu4dtno5k35t1vaaj9n.apps.googleusercontent.com'; // Replace with actual client ID

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route
                  path="/*"
                  element={
                    <>
                      <Navbar />
                      <main className="container mx-auto px-4 py-8">
                        <Routes>
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/scooty" element={<ScootyPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/rider-apply" element={<RiderApplicationPage />} />
                        </Routes>
                      </main>
                    </>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
