import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  items: any;
  total_amount: number;
  status: string;
  order_type: string;
  table_number?: string;
  created_at: string;
  updated_at: string;
}

const Staff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for orders
    const channel = supabase
      .channel('staff-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
        return;
      }

      setOrders((data || []).map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      })));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });

      fetchOrders(); // Refresh the orders
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-500 text-white";
      case "confirmed": return "bg-blue-500 text-white";
      case "preparing": return "bg-orange-500 text-white";
      case "ready": return "bg-green-500 text-white";
      case "completed": return "bg-emerald-600 text-white";
      case "cancelled": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return AlertCircle;
      case "confirmed": return Clock;
      case "preparing": return Clock;
      case "ready": return CheckCircle;
      case "completed": return CheckCircle;
      default: return Clock;
    }
  };

  const getElapsedTime = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    return `${minutes}m ago`;
  };

  const groupedOrders = {
    pending: orders.filter(o => o.status === "pending"),
    confirmed: orders.filter(o => o.status === "confirmed"),
    preparing: orders.filter(o => o.status === "preparing"),
    ready: orders.filter(o => o.status === "ready"),
    completed: orders.filter(o => o.status === "completed"),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Staff Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage orders and kitchen operations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Active Orders</p>
                      <p className="text-2xl font-bold text-primary">{orders.filter(o => o.status !== "completed" && o.status !== "cancelled").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            {Object.entries(groupedOrders).map(([status, statusOrders]) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold capitalize flex items-center">
                    {(() => {
                      const Icon = getStatusIcon(status);
                      return <Icon className="h-5 w-5 mr-2" />;
                    })()}
                    {status} ({statusOrders.length})
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {statusOrders.map((order) => (
                    <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">#{order.id.slice(-8)}</CardTitle>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer_name} • {order.order_type === 'dine-in' && order.table_number ? `Table ${order.table_number}` : order.order_type}
                        </div>
                        <Badge variant="outline" className="w-fit">
                          {order.order_type}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Items:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {order.items.map((item: any, idx: number) => (
                              <li key={idx}>• {item.name} × {item.quantity}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="font-semibold text-primary">${Number(order.total_amount).toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground">{getElapsedTime(order.created_at)}</span>
                        </div>
                        
                        <div className="space-y-2">
                          {order.status === "pending" && (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full"
                              onClick={() => updateOrderStatus(order.id, "confirmed")}
                            >
                              Confirm Order
                            </Button>
                          )}
                          {order.status === "confirmed" && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="w-full"
                              onClick={() => updateOrderStatus(order.id, "preparing")}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button 
                              variant="hero" 
                              size="sm" 
                              className="w-full"
                              onClick={() => updateOrderStatus(order.id, "ready")}
                            >
                              Mark Ready
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full"
                              onClick={() => updateOrderStatus(order.id, "completed")}
                            >
                              Complete Order
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {statusOrders.length === 0 && (
                    <Card className="border-2 border-dashed border-muted">
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No {status} orders</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;