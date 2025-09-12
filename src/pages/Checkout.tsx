import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [orderData, setOrderData] = useState({
    orderType: 'dine-in',
    tableNumber: '',
    deliveryAddress: '',
    paymentMethod: 'card',
    specialInstructions: '',
  });

  // Mock cart data - in real app this would come from context/state
  const mockCart = [
    { id: '1', name: 'Gourmet Burger', price: 18.99, quantity: 2, image: '/placeholder.jpg' },
    { id: '2', name: 'Garden Fresh Salad', price: 14.99, quantity: 1, image: '/placeholder.jpg' },
  ];

  const subtotal = mockCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderPayload = {
        customer_name: profile?.full_name || 'Guest',
        customer_email: user?.email || '',
        user_id: user?.id,
        items: mockCart,
        total_amount: total,
        status: 'pending',
        order_type: orderData.orderType,
        table_number: orderData.orderType === 'dine-in' ? orderData.tableNumber : null,
        payment_status: 'pending'
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderPayload]);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed. You'll receive updates soon.",
      });
      
      navigate('/order-history');
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to complete your order.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/menu')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
              <p className="text-sm text-muted-foreground">Complete your order</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select 
                    value={orderData.orderType} 
                    onValueChange={(value) => setOrderData(prev => ({ ...prev, orderType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dine-in">Dine In</SelectItem>
                      <SelectItem value="takeaway">Takeaway</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orderData.orderType === 'dine-in' && (
                  <div className="space-y-2">
                    <Label htmlFor="tableNumber">Table Number</Label>
                    <Input
                      id="tableNumber"
                      value={orderData.tableNumber}
                      onChange={(e) => setOrderData(prev => ({ ...prev, tableNumber: e.target.value }))}
                      placeholder="Enter table number"
                    />
                  </div>
                )}

                {orderData.orderType === 'delivery' && (
                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      value={orderData.deliveryAddress}
                      onChange={(e) => setOrderData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      placeholder="Enter delivery address"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Input
                    id="specialInstructions"
                    value={orderData.specialInstructions}
                    onChange={(e) => setOrderData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Any special requests?"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={orderData.paymentMethod} 
                  onValueChange={(value) => setOrderData(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="digital">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Estimated Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">25-30 minutes</p>
                <p className="text-sm text-muted-foreground">
                  {orderData.orderType === 'delivery' ? 'Delivery time' : 'Preparation time'}
                </p>
              </CardContent>
            </Card>

            <form onSubmit={handlePlaceOrder}>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={isLoading}
              >
                {isLoading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;