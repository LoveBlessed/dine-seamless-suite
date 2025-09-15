import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Staff & Admin Login</h1>
              <p className="text-sm text-muted-foreground">Secure access for team members</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-8">
        <Card className="border-0 shadow-warm bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl mb-2">Staff & Admin Portal</CardTitle>
            <p className="text-muted-foreground">Secure access for authorized personnel</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h3 className="font-semibold text-accent-foreground mb-2">Test Credentials</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Staff:</strong> staff@bistro.com / staff123
                </div>
                <div>
                  <strong>Admin:</strong> admin@bistro.com / admin123
                </div>
              </div>
            </div> */}
            
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter staff email"
                  value={signInData.email}
                  onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-background/60 border-accent/20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signInData.password}
                  onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-background/60 border-accent/20"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                <Shield className="h-5 w-5 mr-2" />
                {isLoading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;