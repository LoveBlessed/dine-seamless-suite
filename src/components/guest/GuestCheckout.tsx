import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GuestCheckoutProps {
  onGuestCheckout: (name: string, email?: string) => void;
  onLoginRedirect: () => void;
}

const GuestCheckout: React.FC<GuestCheckoutProps> = ({ onGuestCheckout, onLoginRedirect }) => {
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
  });
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }

    onGuestCheckout(guestData.name, guestData.email || undefined);
    setIsOpen(false);
    
    toast({
      title: "Welcome!",
      description: `Hello ${guestData.name}, you can now place your order.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <User className="h-5 w-5 mr-2" />
          Continue as Guest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guest Information</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleGuestSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest-name">Name *</Label>
            <Input
              id="guest-name"
              type="text"
              placeholder="Enter your name"
              value={guestData.name}
              onChange={(e) => setGuestData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guest-email">Email (Optional)</Label>
            <Input
              id="guest-email"
              type="email"
              placeholder="Enter your email for receipt"
              value={guestData.email}
              onChange={(e) => setGuestData(prev => ({ ...prev, email: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              We'll send your receipt and order updates here
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 pt-4">
            <Button type="submit" className="w-full">
              Continue to Menu
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onLoginRedirect();
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Sign in for order history
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckout;