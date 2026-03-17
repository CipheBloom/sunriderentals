import { MapPin, Phone, Clock, Shield, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScootyCard } from '@/components/ScootyCard';
import type { Scooty } from '@/types';
import { useState, useEffect } from 'react';

export function LandingPage() {
  const [scooty, setScooty] = useState<Scooty[]>([]);

  useEffect(() => {
    loadScootys();
  }, []);

  const loadScootys = () => {
    try {
      const data = localStorage.getItem('sunride_scootys');
      setScooty(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Error loading scootys:', error);
      setScooty([]);
    }
  };

  const featuredScooty: Scooty[] = scooty.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 lg:py-40 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Ride Your Dreams with
                <span className="text-blue-500"> SunRide</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Premium scooty rentals for every journey. Find your perfect ride and explore the open road.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/scooty">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  Browse scooty
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In to Book
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">Fully Insured</h3>
              <p className="text-sm text-gray-500">All scooty come with comprehensive insurance coverage</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-500">Round the clock assistance for your peace of mind</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-3 rounded-full bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">Multiple Locations</h3>
              <p className="text-sm text-gray-500">Pick up and drop off at convenient locations</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Star className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">Best Rates</h3>
              <p className="text-sm text-gray-500">Competitive pricing with no hidden charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bikes Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Featured scooty
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500">
              Handpicked selection of our most popular rides
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredScooty.map((scooty) => (
              <ScootyCard key={scooty.id} scooty={scooty} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/scooty">
              <Button variant="outline" size="lg">
                View All scooty
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-500">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-white">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Ready to Hit the Road?
            </h2>
            <p className="mx-auto max-w-[600px] text-blue-100">
              Sign up now and get 10% off on your first booking. Experience the freedom of two wheels.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="bg-white text-blue-500 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">SunRide Rentals</h3>
              <p className="text-sm text-gray-500">
                Your trusted partner for premium scooty rentals. Ride safe, ride free.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <div className="space-y-1 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +918471909282
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  123 Ritom Street, City
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Hours</h3>
              <p className="text-sm text-gray-500">
                Open 7 days a week<br />
                8:00 AM - 8:00 PM
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            © 2026 SunRide Rentals. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
