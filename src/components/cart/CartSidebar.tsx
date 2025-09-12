import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartSidebarProps {
  cart: {[key: string]: number};
  menuItems: MenuItem[];
  onAddToCart: (itemId: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  menuItems,
  onAddToCart,
  onRemoveFromCart,
  onClearCart
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, count]) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item ? item.price * count : 0);
    }, 0);
  };

  const getCartItems = () => {
    return Object.entries(cart)
      .filter(([_, count]) => count > 0)
      .map(([itemId, count]) => {
        const item = menuItems.find(i => i.id === itemId);
        return item ? { ...item, quantity: count } : null;
      })
      .filter(Boolean);
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in or sign up to place your order.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  const totalItems = getTotalItems();
  const cartItems = getCartItems();

  if (totalItems === 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="hero" className="relative">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart ({totalItems})
          <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
            {totalItems}
          </Badge>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({totalItems} items)
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full mt-6">
          <div className="flex-1 overflow-y-auto space-y-4">
            {cartItems.map((item) => (
              <Card key={item!.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={item!.image}
                      alt={item!.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item!.name}</h4>
                      <p className="text-primary font-bold">${item!.price}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onRemoveFromCart(item!.id)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-semibold w-8 text-center">
                            {item!.quantity}
                          </span>
                          <Button
                            variant="default"
                            size="icon"
                            onClick={() => onAddToCart(item!.id)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Clear this item completely
                            for (let i = 0; i < item!.quantity; i++) {
                              onRemoveFromCart(item!.id);
                            }
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleCheckout}
                className="w-full" 
                size="lg"
              >
                Proceed to Checkout
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onClearCart}
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;