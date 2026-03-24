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
      <div className="min-h-screen bg-blue-200 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-600 border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2 text-black">APPLICATION SUBMITTED!</h2>
              <p className="text-black font-bold mb-6 bg-blue-100 p-4 border-4 border-black">
                Thank you for applying to become a delivery rider. Our team will review your application and contact you shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/')} className="border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  BACK TO HOME
                </Button>
                <Button onClick={() => navigate('/profile')} className="bg-blue-600 hover:bg-blue-700 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
                  VIEW PROFILE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-200 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4 border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO HOME
          </Button>
          <h1 className="text-4xl font-black mb-2 text-black">BECOME A DELIVERY RIDER</h1>
          <p className="text-black font-bold bg-blue-100 p-4 border-4 border-black">
            Join our network of delivery partners. Fill out the form below to apply.
          </p>
        </div>

        <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-black text-black">
              <div className="p-2 bg-blue-600 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Bike className="w-5 h-5 text-white" />
              </div>
              RIDER APPLICATION FORM
            </CardTitle>
            <CardDescription className="text-black font-bold">
              Please provide accurate information to help us process your application faster.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-100 border-4 border-black flex items-center gap-2 text-red-600 font-black">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="border-4 border-black p-4 space-y-4 bg-blue-100">
                <h3 className="font-black flex items-center gap-2 text-black text-lg">
                  <div className="p-1 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  PERSONAL INFORMATION
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-black font-black">FULL NAME *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="border-4 border-black font-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-black font-black">AGE *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      placeholder="Enter your age"
                      required
                      min="18"
                      max="60"
                      className="border-4 border-black font-black"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-black font-black">
                    <Phone className="w-4 h-4" />
                    PHONE NUMBER *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="border-4 border-black font-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadharNumber" className="flex items-center gap-2 text-black font-black">
                      <IdCard className="w-4 h-4" />
                      AADHAR CARD NUMBER *
                    </Label>
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => handleChange('aadharNumber', e.target.value)}
                      placeholder="12 digit Aadhar number"
                      required
                      maxLength={12}
                      minLength={12}
                      className="border-4 border-black font-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber" className="flex items-center gap-2 text-black font-black">
                      <CreditCard className="w-4 h-4" />
                      PAN CARD NUMBER *
                    </Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      required
                      maxLength={10}
                      minLength={10}
                      className="border-4 border-black font-black"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2 text-black font-black">
                    <MapPin className="w-4 h-4" />
                    CITY/LOCATION *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Enter your city"
                    required
                    className="border-4 border-black font-black"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="border-4 border-black p-4 space-y-4 bg-blue-100">
                <h3 className="font-black flex items-center gap-2 text-black text-lg">
                  <div className="p-1 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Bike className="w-4 h-4 text-white" />
                  </div>
                  VEHICLE INFORMATION
                </h3>
                
                <div className="space-y-2">
                  <Label className="text-black font-black">VEHICLE TYPE *</Label>
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
                        <span className="capitalize text-black font-black">{type}</span>
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
                  <Label htmlFor="hasLicense" className="cursor-pointer text-black font-black">
                    I have a valid driver's license
                  </Label>
                </div>

                {formData.hasLicense && (
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-black font-black">LICENSE NUMBER</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleChange('licenseNumber', e.target.value)}
                      placeholder="Enter your license number"
                      className="border-4 border-black font-black"
                    />
                  </div>
                )}
              </div>

              {/* Work Preferences */}
              <div className="border-4 border-black p-4 space-y-4 bg-blue-100">
                <h3 className="font-black flex items-center gap-2 text-black text-lg">
                  <div className="p-1 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  WORK PREFERENCES
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-black font-black">EXPERIENCE (YEARS)</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    placeholder="e.g., 2 years"
                    className="border-4 border-black font-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredWorkArea" className="text-black font-black">PREFERRED WORK AREA</Label>
                  <Input
                    id="preferredWorkArea"
                    value={formData.preferredWorkArea}
                    onChange={(e) => handleChange('preferredWorkArea', e.target.value)}
                    placeholder="e.g., Downtown, North City, etc."
                    className="border-4 border-black font-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-black font-black">AVAILABILITY *</Label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => handleChange('availability', e.target.value)}
                    className="w-full h-10 px-3 border-4 border-black bg-white text-black font-black"
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
              <div className="border-4 border-black p-4 space-y-4 bg-blue-100">
                <h3 className="font-black flex items-center gap-2 text-black text-lg">
                  <div className="p-1 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  ADDITIONAL INFORMATION
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-black font-black">TELL US ABOUT YOURSELF</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleChange('additionalInfo', e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    rows={4}
                    className="border-4 border-black font-black"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
                disabled={isSubmitting || !isAuthenticated}
              >
                {isSubmitting ? 'SUBMITTING...' : isAuthenticated ? 'SUBMIT APPLICATION' : 'PLEASE LOGIN FIRST'}
              </Button>

              {!isAuthenticated && (
                <p className="text-center text-sm text-black font-bold">
                  Please <button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:underline border-2 border-transparent hover:border-blue-300 px-1 transition-all">login</button> to submit your application
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
