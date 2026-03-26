import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AlreadyRiderPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="text-center">
            <div className="w-16 h-16 border-4 border-black bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bike className="w-8 h-8 text-black" />
            </div>
            <CardTitle className="text-2xl font-black text-black mb-2">
              You Are Already a Rider!
            </CardTitle>
            <CardDescription className="text-black font-medium">
              Your rider application has been approved. You can start accepting delivery orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-3">
              <div className="p-4 border-4 border-black bg-green-100">
                <h3 className="font-black text-black mb-2">🎉 Congratulations!</h3>
                <p className="text-black font-medium">
                  You are now part of our delivery team and can start earning money.
                </p>
              </div>
              
              <div className="p-4 border-4 border-black bg-blue-100">
                <h3 className="font-black text-black mb-2">📧 Next Steps</h3>
                <p className="text-black font-medium">
                  Check your email for rider guidelines, instructions, and delivery app access.
                </p>
              </div>
              
              <div className="p-4 border-4 border-black bg-yellow-100">
                <h3 className="font-black text-black mb-2">🚀 Ready to Start?</h3>
                <p className="text-black font-medium">
                  Log in to your rider dashboard to view available orders and start delivering.
                </p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => navigate('/')}
                className="w-full h-12 font-black"
              >
                Go to Home
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full h-12 font-black border-4 border-black bg-white hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Previous Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
