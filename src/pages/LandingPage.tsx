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
      color: 'from-emerald-400 to-teal-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round the clock assistance anytime',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: MapPin,
      title: 'Multiple Locations',
      description: 'Convenient pickup & drop-off points',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Award,
      title: 'Best Rates',
      description: 'Competitive pricing guaranteed',
      color: 'from-violet-500 to-fuchsia-500',
      bgColor: 'bg-violet-50',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Modern Gradient with Animation */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-violet-950">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/15 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-medium shadow-lg shadow-white/5">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Premium Scooty Rentals</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-tight drop-shadow-2xl">
                Ride Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-lg">
                  Dreams
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Premium scooters for every journey. Find your perfect ride and explore the city with freedom.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/scooty">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-900 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
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
                    className="border-2 border-white/40 text-white hover:bg-white/15 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/60"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 text-white/80">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
                <div className="text-sm text-white/60">Scooters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">10K+</div>
                <div className="text-sm text-white/60">Happy Riders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">4.9</div>
                <div className="text-sm text-white/60">Rating</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Glassmorphism Cards */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white relative">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">
              Ride with Confidence
            </h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
              Experience the best scooter rental service with premium features and unmatched support
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-2xl ${feature.bgColor} border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bikes Section - Modern Dark Cards */}
      <section className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-slate-950 to-slate-950"></div>
        
        <div className="relative z-10 container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Our Fleet</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
              Featured Scooters
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
              Handpicked selection of our most popular and well-maintained rides
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin delay-75"></div>
                </div>
                <p className="text-slate-400 mt-6 text-lg">Loading amazing rides...</p>
              </div>
            ) : featuredScooty.length > 0 ? (
              featuredScooty.map((scooty) => (
                <div key={scooty.id} className="group">
                  <ScootyCard scooty={scooty} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="inline-flex p-4 rounded-full bg-slate-800 mb-4">
                  <Zap className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-400 text-lg">No scooters available at the moment.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link to="/scooty">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
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

      {/* Footer - Modern Dark Design */}
      <footer className="bg-slate-950 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SunRide</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Your trusted partner for premium scooter rentals. Experience the freedom of two wheels with SunRide.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <div className="space-y-3 text-slate-400">
                <p className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  +91 7002982736
                </p>
                <p className="flex items-center gap-2 hover:text-white transition-colors">
                  <MapPin className="h-4 w-4" />
                  Jorhat, Assam

                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Hours</h3>
              <p className="text-slate-400 leading-relaxed">
                Open 7 days a week<br />
                8:00 AM - 8:00 PM
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 SunRide Rentals. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-sm">Made with love for riders</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
