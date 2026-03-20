import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, X, Home, Bike, UserCircle, ChevronRight, MoreVertical, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

// Simple MD5 for Gravatar fallback
function md5(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

function getGravatarUrl(email: string): string {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=64`;
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMenuToggle = () => {
    if (isMobileMenuOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  const handleMenuItemClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsAnimating(false);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-transparent md:border-b md:bg-background bg-white">
        <div className="container flex h-14 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img 
              src="/logo.jpg"
              alt="SunRide Rentals"
              className="h-8 w-auto max-h-8"
            />
            <span className="hidden font-bold sm:inline-block">
              SunRide Rentals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-between">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/scooty" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Scootys
              </Link>
              {/* Show "Become a Rider" only if not authenticated or not a rider */}
              {(!isAuthenticated || !user?.isRider) && (
                <Link to="/rider-apply" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Become a Rider
                </Link>
              )}
              {/* Show "Rider" link if user is a rider */}
              {isAuthenticated && user?.isRider && (
                <Link to="/rider" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                  <Bike className="w-4 h-4 text-green-600" />
                  Rider
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Profile
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img
                      src={user?.picture || (user?.email ? getGravatarUrl(user.email) : '')}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full border-2 border-orange-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=64&background=f97316&color=fff`;
                      }}
                    />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Beautiful Mobile Menu Button */}
          <button
            className="md:hidden ml-auto relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={handleMenuToggle}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <MoreVertical className={`h-6 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Beautiful Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-50'}`}
          onClick={handleMenuToggle}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl transform transition-all duration-300 ease-in-out ${isAnimating ? 'translate-x-full' : 'translate-x-0'}`}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpg"
                  alt="SunRide Rentals"
                  className="h-8 w-auto"
                />
                <span className="font-bold">SunRide Rentals</span>
              </div>
            </div>

            {/* User Profile Section */}
            {isAuthenticated && (
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.picture || (user?.email ? getGravatarUrl(user.email) : '')}
                    alt={user?.name}
                    className="h-12 w-12 rounded-full border-3 border-blue-300 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=64&background=3b82f6&color=fff`;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <Link
                  to="/"
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Home</p>
                    <p className="text-sm text-gray-500">Return to homepage</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>

                <Link
                  to="/scooty"
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Bike className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Scootys</p>
                    <p className="text-sm text-gray-500">Browse our fleet</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </Link>

                {/* Show Profile only if authenticated */}
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <UserCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Profile</p>
                      <p className="text-sm text-gray-500">Manage your account</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </Link>
                )}

                {/* Show "Become a Rider" only if not authenticated or not a rider */}
                {(!isAuthenticated || !user?.isRider) && (
                  <Link
                    to="/rider-apply"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Become a Rider</p>
                      <p className="text-sm text-gray-500">Apply for delivery jobs</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </Link>
                )}

                {/* Show "Rider" link if user is a rider */}
                {isAuthenticated && user?.isRider && (
                  <Link
                    to="/rider"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Bike className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Rider</p>
                      <p className="text-sm text-gray-500">Access rider dashboard</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </Link>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-gray-50">
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full justify-center gap-2 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Link to="/login" onClick={handleMenuItemClick}>
                  <Button variant="default" className="w-full justify-center gap-2 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <User className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
