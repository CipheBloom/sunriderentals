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
  console.log('🔍 Navbar - isAuthenticated:', isAuthenticated, 'isRider:', user?.isRider);
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

  const handleLogout = async () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { to: '/', label: 'HOME', icon: Home },
    { to: '/scooty', label: 'SCOOTERS', icon: Bike },
    { to: isAuthenticated ? '/profile' : '/login', label: isAuthenticated ? 'PROFILE' : 'LOGIN', icon: UserCircle },
  ];

  if (isAuthenticated && user?.isRider) {
    navItems.splice(2, 0, { to: '/rider', label: 'RIDER', icon: Briefcase });
  }

  const handleMenuItemClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-blue-600 animate-slideDown">
        <div className="container flex h-16 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-3 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <img 
              src="/logo.jpg"
              alt="SunRide Rentals"
              className="h-10 w-auto border-2 border-blue-300 transition-transform duration-300 hover:scale-110"
            />
            <span className="hidden font-black text-xl sm:inline-block text-blue-200 transition-colors duration-300 hover:text-white">
              SunRide Rentals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-between">
            <div className="hidden md:flex items-center space-x-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link to="/" className="text-blue-200 hover:text-white font-black text-lg transition-colors border-2 border-transparent hover:border-blue-300 px-3 py-1 transform transition-transform duration-300 hover:scale-105">
                HOME
              </Link>
              <Link to="/scooty" className="text-blue-200 hover:text-white font-black text-lg transition-colors border-2 border-transparent hover:border-blue-300 px-3 py-1 transform transition-transform duration-300 hover:scale-105">
                SCOOTYS
              </Link>
              {/* Show "Become a Rider" only if not authenticated or not a rider */}
              {(!isAuthenticated || !user?.isRider) && (
                <Link to="/rider-apply" className="text-blue-200 hover:text-white font-black text-lg transition-colors border-2 border-transparent hover:border-blue-300 px-3 py-1 transform transition-transform duration-300 hover:scale-105">
                  BECOME A RIDER
                </Link>
              )}
              {/* Show "Rider" link if user is a rider */}
              {isAuthenticated && user?.isRider && (
                <Link to="/rider" className="text-blue-200 hover:text-white font-black text-lg transition-colors border-2 border-transparent hover:border-blue-300 px-3 py-1 flex items-center gap-2 transform transition-transform duration-300 hover:scale-105">
                  <Bike className="w-5 h-5 text-blue-200 transition-transform duration-300 group-hover:scale-110" />
                  RIDER
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/profile" className="text-blue-200 hover:text-white font-black text-lg transition-colors border-2 border-transparent hover:border-blue-300 px-3 py-1 transform transition-transform duration-300 hover:scale-105">
                  PROFILE
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity border-2 border-blue-300 px-3 py-2 transform transition-transform duration-300 hover:scale-105">
                    <div className="relative">
                      <img
                        src={user?.picture || (user?.email ? getGravatarUrl(user.email) : '')}
                        alt={user?.name}
                        className="h-10 w-10 border-2 border-black transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=64&background=bfdbfe&color=000000`;
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-300 border-2 border-black animate-pulse"></div>
                    </div>
                    <span className="font-black text-blue-200 transition-colors duration-300 hover:text-white">{user?.name}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="bg-blue-300 hover:bg-blue-400 text-black font-black border-2 border-black transition-transform duration-300 hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    LOGOUT
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm" className="bg-blue-300 hover:bg-blue-400 text-black font-black border-2 border-black transition-transform duration-300 hover:scale-105">
                    <User className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    LOGIN
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Beautiful Mobile Menu Button */}
          <button
            className="md:hidden ml-auto relative w-12 h-12 flex items-center justify-center bg-blue-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 transform hover:scale-110 hover:rotate-12 animate-bounce"
            onClick={handleMenuToggle}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <MoreVertical className={`h-6 w-6 text-black transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`absolute h-6 w-6 text-black transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Beautiful Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-70'}`}
          onClick={handleMenuToggle}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-full bg-blue-200 border-l-4 border-black transform transition-all duration-500 ease-in-out ${
          isAnimating ? 'translate-x-full' : 'translate-x-0'
        } ${isMobileMenuOpen ? 'animate-slideInRight' : ''}`}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center p-4 border-b-4 border-black bg-blue-600 animate-slideDown">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpg"
                  alt="SunRide Rentals"
                  className="h-10 w-auto border-2 border-blue-300 transition-transform duration-300 hover:scale-110"
                />
                <span className="font-black text-xl text-blue-200">SunRide Rentals</span>
              </div>
            </div>

            {/* User Profile Section */}
            {isAuthenticated && (
              <div className="p-4 border-b-4 border-black bg-white animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user?.picture || (user?.email ? getGravatarUrl(user.email) : '')}
                      alt={user?.name}
                      className="h-14 w-14 border-4 border-black transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=64&background=bfdbfe&color=000000`;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 border-2 border-black animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-black text-lg transition-colors duration-300 hover:text-blue-600">{user?.name}</p>
                    <p className="font-bold text-gray-700">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                <Link
                  to="/"
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-3 p-4 bg-white border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group animate-fadeInUp"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div className="w-12 h-12 bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Home className="h-6 w-6 text-blue-200" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-black text-lg transition-colors duration-300 group-hover:text-blue-600">HOME</p>
                    <p className="font-bold text-gray-600">Return to homepage</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-black group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/scooty"
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-3 p-4 bg-white border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="w-12 h-12 bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Bike className="h-6 w-6 text-blue-200" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-black text-lg">SCOOTYS</p>
                    <p className="font-bold text-gray-600">Browse our fleet</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-black group-hover:text-blue-300 transition-colors" />
                </Link>

                {/* Show Profile only if authenticated */}
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-4 bg-white border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group animate-fadeInUp"
                    style={{ animationDelay: '0.4s' }}
                  >
                    <div className="w-12 h-12 bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <UserCircle className="h-6 w-6 text-blue-200" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black text-lg transition-colors duration-300 group-hover:text-blue-600">PROFILE</p>
                      <p className="font-bold text-gray-600">Manage your account</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-black group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-1" />
                  </Link>
                )}

                {/* Show "Become a Rider" only if not authenticated or not a rider */}
                {(!isAuthenticated || !user?.isRider) && (
                  <Link
                    to="/rider-apply"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-4 bg-white border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group animate-fadeInUp"
                    style={{ animationDelay: '0.5s' }}
                  >
                    <div className="w-12 h-12 bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Briefcase className="h-6 w-6 text-blue-200" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black text-lg transition-colors duration-300 group-hover:text-blue-600">BECOME A RIDER</p>
                      <p className="font-bold text-gray-600">Apply for delivery jobs</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-black group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-1" />
                  </Link>
                )}

                {/* Show "Rider" link if user is a rider */}
                {isAuthenticated && user?.isRider && (
                  <Link
                    to="/rider"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-4 bg-white border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group animate-fadeInUp"
                    style={{ animationDelay: '0.6s' }}
                  >
                    <div className="w-12 h-12 bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Bike className="h-6 w-6 text-blue-200" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black text-lg transition-colors duration-300 group-hover:text-blue-600">RIDER</p>
                      <p className="font-bold text-gray-600">View rider dashboard</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-black group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t-4 border-black bg-white animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full justify-center gap-2 h-14 font-black text-lg bg-red-500 hover:bg-red-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 transform hover:scale-105"
                >
                  <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  LOGOUT
                </Button>
              ) : (
                <Link to="/login" onClick={handleMenuItemClick}>
                  <Button variant="default" className="w-full justify-center gap-2 h-14 font-black text-lg bg-blue-300 hover:bg-blue-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 transform hover:scale-105">
                    <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    LOGIN
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
