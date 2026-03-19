import { useState } from 'react';
import { CalendarIcon, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Bike, Booking } from '@/types';
import { EmailService } from '@/lib/emailService';

interface BookingDialogProps {
  bike: Bike;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDialog({ bike, isOpen, onClose }: BookingDialogProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const today = startOfDay(new Date());

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateTotalDays();
  const totalPrice = totalDays * bike.pricePerDay;

  const validatePhone = (value: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    if (!value.trim()) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setPhoneError(validatePhone(value));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!startDate || !endDate) return;

    const phoneValidationError = validatePhone(phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking in MongoDB
      const bookingId = 'booking_' + Date.now();
      const booking = {
        id: bookingId,
        userId: user?.id || '',
        userName: user?.name || '',
        userEmail: user?.email || '',
        userPhone: phone,
        vehicleId: bike.id,
        vehicleName: bike.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: totalPrice,
        status: 'pending' as const
      };

      await bookingAPI.create(booking);
      console.log('✅ Booking saved to MongoDB');

      setBookingId(bookingId);

      // Send confirmation emails (optional - can fail silently)
      try {
        await EmailService.sendBookingConfirmation({
          id: bookingId,
          userName: user?.name || 'Guest User',
          userEmail: user?.email || '',
          userPhone: phone,
          bikeName: bike.name,
          bikeCategory: bike.category,
          startDate: startDate,
          endDate: endDate,
          totalPrice: totalPrice,
          createdAt: new Date(),
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      setIsSubmitting(false);
      setBookingConfirmed(true);
    } catch (error) {
      console.error('❌ Failed to save booking:', error);
      setIsSubmitting(false);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleClose = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setPhone('');
    setPhoneError('');
    setShowLoginPrompt(false);
    setBookingConfirmed(false);
    onClose();
  };

  if (bookingConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription>
              Your scooty has been successfully booked.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                ✅ Booking Confirmed
              </p>
              <p className="text-sm text-green-700 mt-1">
                Your booking has been confirmed and is ready for pickup.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                � WhatsApp Notifications
              </p>
              <p className="text-sm text-green-700 mt-1">
                Confirmation messages are being sent via WhatsApp to you and our team.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                💳 Payment Required
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Please complete the payment at the time of pickup.
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Booking ID: <span className="font-mono font-medium">{bookingId}</span>
              </p>
              <p className="text-xs text-gray-500">
                Please save this booking ID for future reference.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (showLoginPrompt) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in with your Google account to complete your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm text-gray-500 text-center">
              You need to be logged in to book a bike. Click below to sign in.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)} className="flex-1">
              Back
            </Button>
            <Button onClick={() => navigate('/login')} className="flex-1">
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book {bike.name}</DialogTitle>
          <DialogDescription>
            Select your rental dates and provide your contact details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Start Date */}
          <div className="grid gap-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <CalendarIcon className="h-4 w-4 text-blue-500" />
              Start Date
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
              min={format(today, 'yyyy-MM-dd')}
              className="w-full"
            />
          </div>

          {/* End Date */}
          <div className="grid gap-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <CalendarIcon className="h-4 w-4 text-blue-500" />
              End Date
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
              min={startDate ? format(startDate, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd')}
              disabled={!startDate}
              className="w-full"
            />
          </div>

          {/* Phone Number */}
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
              <Phone className="h-4 w-4 text-blue-500" />
              Phone Number
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={handlePhoneChange}
              className={cn(
                'border-2 focus:border-blue-500 focus:ring-blue-500',
                phoneError && 'border-red-500 focus:border-red-500'
              )}
            />
            {phoneError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {phoneError}
              </p>
            )}
          </div>

          {/* Price Summary */}
          {startDate && endDate && (
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 p-4 space-y-2">
              <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                <span className="text-lg">💰</span> Price Summary
              </h4>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Rental Period</span>
                <span className="font-medium">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Rate per day</span>
                <span className="font-medium">₹{bike.pricePerDay}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-blue-800">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!startDate || !endDate || !phone || !!phoneError || isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isSubmitting ? 'Processing...' : isAuthenticated ? 'Confirm Booking' : 'Sign In to Book'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
