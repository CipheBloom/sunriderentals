import { MapPin, Phone, Clock, Shield, ArrowRight, Zap, Heart, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScootyCard } from '@/components/ScootyCard';
import { vehicleAPI, type VehicleData } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [scooty, setScooty] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScootys();
  }, []);

  const loadScootys = async () => {
    try {
      setLoading(true);
      const vehicles = await vehicleAPI.getAvailable();
      setScooty(vehicles);
    } catch (error) {
      console.error('❌ Error loading vehicles:', error);
      setScooty([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredScooty = scooty.slice(0, 3);

  const features = [
    {
      icon: Shield,
      title: 'FULLY INSURED',
      description: 'Comprehensive coverage for peace of mind',
      bgColor: 'bg-blue-300',
      borderColor: 'border-black',
    },
    {
      icon: Clock,
      title: '24/7 SUPPORT',
      description: 'Round the clock assistance anytime',
      bgColor: 'bg-blue-300',
      borderColor: 'border-black',
    },
    {
      icon: MapPin,
      title: 'MULTIPLE LOCATIONS',
      description: 'Convenient pickup & drop-off points',
      bgColor: 'bg-blue-300',
      borderColor: 'border-black',
    },
    {
      icon: Award,
      title: 'BEST RATES',
      description: 'Competitive pricing guaranteed',
      bgColor: 'bg-blue-300',
      borderColor: 'border-black',
    },
  ];

  return (
    <div className="min-h-screen bg-blue-200 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-blue-600 animate-slideDown">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 animate-bounce">
              <Sparkles className="w-5 h-5 text-black" />
              <span className="font-black text-black text-sm uppercase tracking-wider">Premium Scooty Rentals</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-fadeInUp">
              RIDE YOUR{' '}
              <span className="block bg-blue-300 px-4 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-2 my-4">
                DREAMS
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-blue-100 mb-8 font-bold animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Premium scooters for every journey. Find your perfect ride and explore the city with freedom.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <Link to="/scooty">
                <Button 
                  size="lg" 
                  className="bg-blue-300 hover:bg-blue-400 text-black font-black text-lg px-8 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
                >
                  Browse Scooters
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white hover:bg-gray-100 text-black font-black text-lg px-8 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 text-blue-200 fill-current" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section - Neobrutalism Cards */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-300 border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1 animate-bounce">
              <span className="font-black text-black text-sm uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-6 animate-fadeInUp">
              RIDE WITH CONFIDENCE
            </h2>
            <p className="text-black font-bold mt-6 max-w-2xl mx-auto text-lg bg-blue-100 p-4 border-4 border-black animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Experience the best scooter rental service with premium features and unmatched support
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group p-8 ${feature.bgColor} border-4 ${feature.borderColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 transform hover:scale-105 animate-fadeInUp ${
                  index % 2 === 1 ? '-rotate-1' : 'rotate-1'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-4 bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-8 w-8 text-blue-200" />
                </div>
                <h3 className="text-xl font-black text-black mb-3 transition-colors duration-300 group-hover:text-blue-600">{feature.title}</h3>
                <p className="text-black font-bold leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bikes Section - Neobrutalism Style */}
      <section className="py-24 bg-blue-100 border-b-4 border-black">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block bg-blue-600 border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce">
              <span className="font-black text-blue-200 text-sm uppercase tracking-wider">Our Fleet</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-black mt-6 animate-fadeInUp">
              FEATURED SCOOTERS
            </h2>
            <p className="text-black font-bold mt-6 max-w-2xl mx-auto text-lg bg-white p-4 border-4 border-black animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Handpicked selection of our most popular and well-maintained rides
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 animate-fadeIn">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-black border-t-blue-300 rounded-full animate-spin"></div>
                </div>
                <p className="text-black font-black mt-6 text-lg bg-blue-300 px-4 py-2 border-4 border-black animate-pulse">Loading amazing rides...</p>
              </div>
            ) : featuredScooty.length > 0 ? (
              featuredScooty.map((scooty, index) => (
                <div key={scooty.id} className={`group ${index % 2 === 1 ? '-rotate-1' : 'rotate-1'} animate-fadeInUp`} style={{ animationDelay: `${index * 0.15}s` }}>
                  <ScootyCard scooty={scooty} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 animate-bounceIn">
                <div className="inline-block p-6 bg-blue-600 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4 animate-pulse">
                  <Zap className="h-12 w-12 text-blue-200" />
                </div>
                <p className="text-black font-black text-xl bg-blue-300 px-6 py-3 border-4 border-black inline-block">No scooters available at the moment.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <Link to="/scooty">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-blue-200 font-black text-lg px-8 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 transform hover:scale-105 uppercase"
              >
                View All Scooters
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section
      <section className="py-16 md:py-24 bg-blue-500">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-white">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Ready to Hit the Road?
            </h2>
            <p className="mx-auto max-w-[600px] text-blue-100">
              {!isAuthenticated 
                ? "Sign up now and get 10% off on your first booking. Experience the freedom of two wheels."
                : "Welcome back! Book your next ride and continue exploring."
              }
            </p>
            {!isAuthenticated && (
              <Link to="/login">
                <Button size="lg" variant="secondary" className="bg-white text-blue-500 hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section> */}

      {/* Footer - Neobrutalism Design */}
      <footer className="bg-blue-600 text-blue-200 py-16 border-t-4 border-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-300 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Zap className="w-7 h-7 text-black" />
                </div>
                <span className="text-3xl font-black">SunRide</span>
              </div>
              <p className="text-blue-100 max-w-sm leading-relaxed font-bold bg-blue-700 p-4 border-4 border-black">
                Your trusted partner for premium scooter rentals. Experience the freedom of two wheels with SunRide.
              </p>
            </div>
            
            <div>
              <h3 className="font-black text-xl mb-4 bg-blue-300 px-3 py-1 border-4 border-black inline-block">CONTACT</h3>
              <div className="space-y-3 text-blue-100">
                <p className="flex items-center gap-3 font-bold bg-blue-700 p-3 border-4 border-black">
                  <Phone className="h-5 w-5" />
                  +91 7002982736
                </p>
                <p className="flex items-center gap-3 font-bold bg-blue-700 p-3 border-4 border-black">
                  <MapPin className="h-5 w-5" />
                  Jorhat, Assam
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-black text-xl mb-4 bg-blue-300 px-3 py-1 border-4 border-black inline-block">HOURS</h3>
              <div className="bg-blue-700 p-4 border-4 border-black">
                <p className="text-blue-100 font-bold leading-relaxed">
                  Open 7 days a week<br />
                  8:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t-4 border-blue-300 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-100 font-black text-sm">
              © 2026 SunRide Rentals. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-blue-100 font-black bg-blue-700 px-4 py-2 border-4 border-black">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <span className="text-sm">Made with love for riders</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
