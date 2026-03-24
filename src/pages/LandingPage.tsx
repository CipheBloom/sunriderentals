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
      title: 'Fully Insured',
      description: 'Comprehensive coverage for peace of mind',
      bgColor: 'bg-blue-100',
      iconBg: 'bg-blue-500',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round the clock assistance anytime',
      bgColor: 'bg-yellow-100',
      iconBg: 'bg-yellow-500',
    },
    {
      icon: MapPin,
      title: 'Multiple Locations',
      description: 'Convenient pickup & drop-off points',
      bgColor: 'bg-green-100',
      iconBg: 'bg-green-500',
    },
    {
      icon: Award,
      title: 'Best Rates',
      description: 'Competitive pricing guaranteed',
      bgColor: 'bg-purple-100',
      iconBg: 'bg-purple-500',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      {/* Hero Section - Neobrutalism Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white border-b-4 border-black">
        <div className="absolute inset-0 bg-blue-200 opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border-4 border-black bg-blue-500 text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-sm md:text-base">Premium Scooty Rentals</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 max-w-4xl fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-black tracking-tight leading-tight">
                Ride Your{' '}
                <span className="text-blue-600">
                  Dreams
                </span>
              </h1>
              <p className="text-lg md:text-xl text-black max-w-2xl mx-auto leading-relaxed font-medium px-4">
                Premium scooters for every journey. Find your perfect ride and explore the city with freedom.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 px-4">
              <Link to="/scooty">
                <Button 
                  size="lg" 
                  className="bg-blue-500 text-black hover:bg-blue-400 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Browse Scooters
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Neobrutalism Style */}
      <section className="py-16 md:py-24 bg-white relative border-b-4 border-black">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-3 md:px-4 py-2 border-4 border-black bg-blue-500 text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 text-sm md:text-base">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mt-3">
              Ride with Confidence
            </h2>
            <p className="text-black mt-4 max-w-2xl mx-auto text-base md:text-lg font-medium px-4">
              Experience the best scooter rental service with premium features and unmatched support
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative p-6 md:p-8 border-4 border-black ${feature.bgColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover-lift slide-in-left`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-3 md:p-4 border-4 border-black ${feature.iconBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 md:mb-6`}>
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-black" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-black mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-black font-medium leading-relaxed text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bikes Section - Neobrutalism Style */}
      <section className="py-16 md:py-24 bg-blue-100 relative overflow-hidden border-b-4 border-black">
        <div className="relative z-10 container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <span className="inline-block px-3 md:px-4 py-2 border-4 border-black bg-blue-500 text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 text-sm md:text-base">Our Fleet</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mt-3">
              Featured Scooters
            </h2>
            <p className="text-black mt-4 max-w-2xl mx-auto text-base md:text-lg font-medium px-4">
              Handpicked selection of our most popular and well-maintained rides
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-16">
                <div className="relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-black border-t-blue-500 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
                </div>
                <p className="text-black mt-4 md:mt-6 text-base md:text-lg font-bold">Loading amazing rides...</p>
              </div>
            ) : featuredScooty.length > 0 ? (
              featuredScooty.map((scooty) => (
                <div key={scooty.id} className="group">
                  <ScootyCard scooty={scooty} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="inline-flex p-4 border-4 border-black bg-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <Zap className="h-8 w-8 text-black" />
                </div>
                <p className="text-black text-lg font-bold">No scooters available at the moment.</p>
              </div>
            )}
          </div>

          <div className="mt-8 md:mt-12 text-center px-4">
            <Link to="/scooty">
              <Button 
                variant="outline" 
                size="lg"
                className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 bounce"
              >
                View All Scooters
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Neobrutalism Design */}
      <footer className="bg-white text-black py-12 md:py-16 border-t-4 border-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 border-4 border-black bg-blue-500 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pulse">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl md:text-2xl font-black">SunRide</span>
              </div>
              <p className="text-black max-w-sm leading-relaxed font-medium text-sm md:text-base">
                Your trusted partner for premium scooter rentals. Experience the freedom of two wheels with SunRide.
              </p>
            </div>
            
            <div>
              <h3 className="font-black text-lg mb-4 border-b-4 border-black pb-2 inline-block">Contact</h3>
              <div className="space-y-3 text-black font-medium text-sm md:text-base">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91 7002982736
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Jorhat, Assam
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-black text-lg mb-4 border-b-4 border-black pb-2 inline-block">Hours</h3>
              <p className="text-black leading-relaxed font-medium text-sm md:text-base">
                Open 7 days a week<br />
                8:00 AM - 8:00 PM
              </p>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-black font-bold text-sm md:text-base">
              © 2026 SunRide Rentals. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-black font-bold text-sm md:text-base">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Made with love for riders</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
