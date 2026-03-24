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
      }, 500); // Match the CSS transition duration
    } else {
      setIsMobileMenuOpen(true);
      setIsAnimating(false); // Don't wait, let animation start immediately
    }
  };

  const handleMenuItemClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsAnimating(false);
    }, 500); // Match the CSS transition duration
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img 
              src="/logo.jpg"
              alt="SunRide Rentals"
              className="h-10 w-auto max-h-10 border-2 border-black"
            />
            <span className="hidden font-black text-lg sm:inline-block text-black">
              SunRide Rentals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-between">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-black hover:text-blue-600 font-bold transition-colors duration-300 hover-lift">
                Home
              </Link>
              <Link to="/scooty" className="text-black hover:text-blue-600 font-bold transition-colors duration-300 hover-lift">
                Scootys
              </Link>
              {/* Show "Become a Rider" only if not authenticated or not a rider */}
              {(!isAuthenticated || !user?.isRider) && (
                <Link to="/rider-apply" className="text-black hover:text-blue-600 font-bold transition-colors duration-300 hover-lift">
                  Become a Rider
                </Link>
              )}
              {/* Show "Rider" link if user is a rider */}
              {isAuthenticated && user?.isRider && (
                <Link to="/rider" className="text-black hover:text-blue-600 font-bold transition-colors duration-300 hover-lift flex items-center gap-1">
                  <Bike className="w-4 h-4 text-blue-500" />
                  Rider
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/profile" className="text-black hover:text-blue-600 font-bold transition-colors duration-300 hover-lift">
                  Profile
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 hover-lift">
                    <img
                      src={user?.picture || (user?.email ? getGravatarUrl(user.email) : '')}
                      alt={user?.name}
                      className="h-8 w-8 border-2 border-black"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=64&background=3b82f6&color=000`;
                      }}
                    />
                    <span className="text-sm font-bold text-black">{user?.name}</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="btn-press"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm" className="btn-press">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Neobrutalism Mobile Menu Button */}
          <button
            className="md:hidden ml-auto relative w-12 h-12 flex items-center justify-center bg-blue-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            onClick={handleMenuToggle}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <MoreVertical className={`h-6 w-6 transition-all duration-500 ease-out ${isMobileMenuOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`absolute transition-all duration-500 ease-out ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Neobrutalism Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-all duration-500 ease-out ${isAnimating ? 'opacity-0' : 'opacity-60'}`}
          onClick={handleMenuToggle}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-full bg-white border-l-4 border-black shadow-[-8px_0_0px_0px_rgba(0,0,0,1)] transform transition-all duration-500 ease-out ${isAnimating ? 'translate-x-full' : 'translate-x-0'} ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center p-4 border-b-4 border-black bg-blue-500">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpg"
                  alt="SunRide Rentals"
                  className="h-10 w-auto border-2 border-black"
                />
                <span className="font-black text-black">SunRide Rentals</span>
              </div>
            </div>

            {/* User Profile Section */}
            {isAuthenticated && (
              <div className="p-4 border-b-4 border-black bg-blue-100">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.picture || (user?.email ? getGravatarUrl(user.email) : '')}
                    alt={user?.name}
                    className="h-12 w-12 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=64&background=3b82f6&color=000`;
                    }}
                  />
                  <div>
                    <p className="font-black text-black">{user?.name}</p>
                    <p className="text-sm font-bold text-black">{user?.email}</p>
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
                  className="flex items-center gap-3 p-3 border-2 border-black bg-white hover:bg-blue-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group transform hover:translate-x-1 opacity-0 translate-x-4"
                  style={{ 
                    animation: 'slideInLeft 0.6s ease-out forwards',
                    animationDelay: '0.1s'
                  }}
                >
                  <div className="w-10 h-10 border-2 border-black bg-blue-100 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200">
                    <Home className="h-5 w-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-black">Home</p>
                    <p className="text-sm font-bold text-black">Return to homepage</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/scooty"
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-3 p-3 border-2 border-black bg-white hover:bg-blue-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group transform hover:translate-x-1 opacity-0 translate-x-4"
                  style={{ 
                    animation: 'slideInLeft 0.6s ease-out forwards',
                    animationDelay: '0.2s'
                  }}
                >
                  <div className="w-10 h-10 border-2 border-black bg-blue-100 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200">
                    <Bike className="h-5 w-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-black">Scootys</p>
                    <p className="text-sm font-bold text-black">Browse our fleet</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                {/* Show Profile only if authenticated */}
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-3 border-2 border-black bg-white hover:bg-blue-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group transform hover:translate-x-1 opacity-0 translate-x-4"
                    style={{ 
                      animation: 'slideInLeft 0.6s ease-out forwards',
                      animationDelay: '0.3s'
                    }}
                  >
                    <div className="w-10 h-10 border-2 border-black bg-blue-100 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200">
                      <UserCircle className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black">Profile</p>
                      <p className="text-sm font-bold text-black">Manage your account</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}

                {/* Show "Become a Rider" only if not authenticated or not a rider */}
                {(!isAuthenticated || !user?.isRider) && (
                  <Link
                    to="/rider-apply"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-3 border-2 border-black bg-white hover:bg-blue-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group transform hover:translate-x-1 opacity-0 translate-x-4"
                    style={{ 
                      animation: 'slideInLeft 0.6s ease-out forwards',
                      animationDelay: '0.4s'
                    }}
                  >
                    <div className="w-10 h-10 border-2 border-black bg-blue-100 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200">
                      <Briefcase className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black">Become a Rider</p>
                      <p className="text-sm font-bold text-black">Apply for delivery jobs</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}

                {/* Show "Rider" link if user is a rider */}
                {isAuthenticated && user?.isRider && (
                  <Link
                    to="/rider"
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-3 border-2 border-black bg-white hover:bg-blue-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group transform hover:translate-x-1 opacity-0 translate-x-4"
                    style={{ 
                      animation: 'slideInLeft 0.6s ease-out forwards',
                      animationDelay: '0.5s'
                    }}
                  >
                    <div className="w-10 h-10 border-2 border-black bg-blue-100 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200">
                      <Bike className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black">Rider</p>
                      <p className="text-sm font-bold text-black">Access rider dashboard</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t-4 border-black bg-blue-100 opacity-0 translate-y-4" style={{ animation: 'fadeIn 0.8s ease-out forwards', animationDelay: '0.6s' }}>
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full justify-center gap-2 h-12 font-black transition-all duration-300 transform hover:scale-105"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Link to="/login" onClick={handleMenuItemClick}>
                  <Button variant="default" className="w-full justify-center gap-2 h-12 font-black transition-all duration-300 transform hover:scale-105">
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
