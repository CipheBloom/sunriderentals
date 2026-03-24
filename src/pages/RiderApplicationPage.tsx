import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bike, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  IdCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { riderApplicationAPI } from '@/lib/api';

export function RiderApplicationPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    aadharNumber: '',
    panNumber: '',
    age: '',
    city: '',
    vehicleType: 'scooter',
    hasLicense: false,
    licenseNumber: '',
    experience: '',
    preferredWorkArea: '',
    availability: 'full-time',
    additionalInfo: '',
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!isAuthenticated || !user) {
      setError('Please login to apply as a rider');
      setIsSubmitting(false);
      return;
    }

    try {
      await riderApplicationAPI.create({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: formData.phone,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber,
        fullName: formData.fullName,
        age: parseInt(formData.age) || 0,
        city: formData.city,
        vehicleType: formData.vehicleType,
        hasLicense: formData.hasLicense,
        licenseNumber: formData.licenseNumber,
        experience: formData.experience,
        preferredWorkArea: formData.preferredWorkArea,
        availability: formData.availability,
        additionalInfo: formData.additionalInfo,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to submit application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-blue-100 py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 border-4 border-black bg-green-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-black">Application Submitted!</h2>
              <p className="text-black font-medium mb-6">
                Thank you for applying to become a delivery rider. Our team will review your application and contact you shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/')} className="font-bold">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button onClick={() => navigate('/profile')} className="font-bold">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4 font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-black mb-2 text-black">Become a Delivery Rider</h1>
          <p className="text-black font-medium">
            Join our network of delivery partners. Fill out the form below to apply.
          </p>
        </div>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-black text-black">
              <div className="w-8 h-8 border-2 border-black bg-blue-100 flex items-center justify-center">
                <Bike className="w-4 h-4 text-black" />
              </div>
              Rider Application Form
            </CardTitle>
            <CardDescription className="text-black font-medium">
              Please provide accurate information to help us process your application faster.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 border-4 border-black bg-red-100 flex items-center gap-2 text-black font-bold">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="border-4 border-black p-4 space-y-4">
                <h3 className="font-black flex items-center gap-2 text-black">
                  <div className="w-6 h-6 border-2 border-black bg-blue-100 flex items-center justify-center">
                    <User className="w-3 h-3 text-black" />
                  </div>
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-bold text-black">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="font-bold text-black">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      placeholder="Enter your age"
                      required
                      min="18"
                      max="60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 font-bold text-black">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadharNumber" className="flex items-center gap-2 font-bold text-black">
                      <IdCard className="w-4 h-4" />
                      Aadhar Card Number *
                    </Label>
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => handleChange('aadharNumber', e.target.value)}
                      placeholder="12 digit Aadhar number"
                      required
                      maxLength={12}
                      minLength={12}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber" className="flex items-center gap-2 font-bold text-black">
                      <CreditCard className="w-4 h-4" />
                      PAN Card Number *
                    </Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      required
                      maxLength={10}
                      minLength={10}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2 font-bold text-black">
                    <MapPin className="w-4 h-4" />
                    City/Location *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Enter your city"
                    required
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="border-4 border-black p-4 space-y-4">
                <h3 className="font-black flex items-center gap-2 text-black">
                  <div className="w-6 h-6 border-2 border-black bg-blue-100 flex items-center justify-center">
                    <Bike className="w-3 h-3 text-black" />
                  </div>
                  Vehicle Information
                </h3>
                
                <div className="space-y-2">
                  <Label className="font-bold text-black">Vehicle Type *</Label>
                  <div className="flex flex-wrap gap-3">
                    {['scooter', 'motorcycle', 'bicycle'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="vehicleType"
                          value={type}
                          checked={formData.vehicleType === type}
                          onChange={(e) => handleChange('vehicleType', e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="capitalize font-bold text-black">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasLicense"
                    checked={formData.hasLicense}
                    onCheckedChange={(checked: boolean) => handleChange('hasLicense', checked === true)}
                  />
                  <Label htmlFor="hasLicense" className="cursor-pointer font-bold text-black">
                    I have a valid driver's license
                  </Label>
                </div>

                {formData.hasLicense && (
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="font-bold text-black">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleChange('licenseNumber', e.target.value)}
                      placeholder="Enter your license number"
                    />
                  </div>
                )}
              </div>

              {/* Work Preferences */}
              <div className="border-4 border-black p-4 space-y-4">
                <h3 className="font-black flex items-center gap-2 text-black">
                  <div className="w-6 h-6 border-2 border-black bg-blue-100 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-black" />
                  </div>
                  Work Preferences
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="font-bold text-black">Experience (Years)</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    placeholder="e.g., 2 years"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredWorkArea" className="font-bold text-black">Preferred Work Area</Label>
                  <Input
                    id="preferredWorkArea"
                    value={formData.preferredWorkArea}
                    onChange={(e) => handleChange('preferredWorkArea', e.target.value)}
                    placeholder="e.g., Downtown, North City, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability" className="font-bold text-black">Availability *</Label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => handleChange('availability', e.target.value)}
                    className="w-full h-12 px-3 border-4 border-black bg-white text-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                    required
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="evenings">Evenings Only</option>
                  </select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-4 border-black p-4 space-y-4">
                <h3 className="font-black flex items-center gap-2 text-black">
                  <div className="w-6 h-6 border-2 border-black bg-blue-100 flex items-center justify-center">
                    <FileText className="w-3 h-3 text-black" />
                  </div>
                  Additional Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="font-bold text-black">Tell us about yourself</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleChange('additionalInfo', e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    rows={4}
                    className="border-4 border-black bg-white text-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 font-black"
                disabled={isSubmitting || !isAuthenticated}
              >
                {isSubmitting ? 'Submitting...' : isAuthenticated ? 'Submit Application' : 'Please Login First'}
              </Button>

              {!isAuthenticated && (
                <p className="text-center text-sm font-bold text-black">
                  Please <button type="button" onClick={() => navigate('/login')} className="text-blue-600 underline">login</button> to submit your application
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
