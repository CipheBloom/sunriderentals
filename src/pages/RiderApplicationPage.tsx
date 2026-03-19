import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bike, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for applying to become a delivery rider. Our team will review your application and contact you shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button onClick={() => navigate('/profile')}>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold mb-2">Become a Delivery Rider</h1>
          <p className="text-gray-600">
            Join our network of delivery partners. Fill out the form below to apply.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bike className="w-5 h-5" />
              Rider Application Form
            </CardTitle>
            <CardDescription>
              Please provide accurate information to help us process your application faster.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
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
                  <Label htmlFor="phone" className="flex items-center gap-2">
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
                    <Label htmlFor="aadharNumber" className="flex items-center gap-2">
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
                    <Label htmlFor="panNumber" className="flex items-center gap-2">
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
                  <Label htmlFor="city" className="flex items-center gap-2">
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
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bike className="w-4 h-4" />
                  Vehicle Information
                </h3>
                
                <div className="space-y-2">
                  <Label>Vehicle Type *</Label>
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
                        <span className="capitalize">{type}</span>
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
                  <Label htmlFor="hasLicense" className="cursor-pointer">
                    I have a valid driver's license
                  </Label>
                </div>

                {formData.hasLicense && (
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
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
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Work Preferences
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    placeholder="e.g., 2 years"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredWorkArea">Preferred Work Area</Label>
                  <Input
                    id="preferredWorkArea"
                    value={formData.preferredWorkArea}
                    onChange={(e) => handleChange('preferredWorkArea', e.target.value)}
                    placeholder="e.g., Downtown, North City, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability *</Label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => handleChange('availability', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
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
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Additional Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Tell us about yourself</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleChange('additionalInfo', e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    rows={4}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || !isAuthenticated}
              >
                {isSubmitting ? 'Submitting...' : isAuthenticated ? 'Submit Application' : 'Please Login First'}
              </Button>

              {!isAuthenticated && (
                <p className="text-center text-sm text-gray-500">
                  Please <button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:underline">login</button> to submit your application
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
