import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: "new" | "cooking" | "ready" | "completed";
  tableNumber: string;
  location: "indoor" | "outdoor";
  timestamp: Date;
}

const Staff = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "John Doe", 
      items: ["Gourmet Burger", "Garden Fresh Salad"],
      total: 33.98,
      status: "new",
      tableNumber: "A1",
      location: "indoor",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      items: ["Wood-Fired Pizza"],
      total: 22.99,
      status: "cooking",
      tableNumber: "B3",
      location: "outdoor", 
      timestamp: new Date(Date.now() - 15 * 60000),
    },
    {
      id: "ORD-003",
      customerName: "Mike Johnson",
      items: ["Gourmet Burger", "Garden Fresh Salad", "Wood-Fired Pizza"],
      total: 56.97,
      status: "ready",
      tableNumber: "C2",
      location: "indoor",
      timestamp: new Date(Date.now() - 25 * 60000),
    },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "new": return "bg-status-new text-white";
      case "cooking": return "bg-status-cooking text-white";
      case "ready": return "bg-status-ready text-white";
      case "completed": return "bg-status-completed text-white";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "new": return AlertCircle;
      case "cooking": return Clock;
      case "ready": return CheckCircle;
      case "completed": return CheckCircle;
      default: return Clock;
    }
  };

  const getElapsedTime = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    return `${minutes}m ago`;
  };

  const groupedOrders = {
    new: orders.filter(o => o.status === "new"),
    cooking: orders.filter(o => o.status === "cooking"),
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
                      <p className="text-2xl font-bold text-primary">{orders.filter(o => o.status !== "completed").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Order Management Columns */}
        <div className="grid lg:grid-cols-4 gap-6">
          {Object.entries(groupedOrders).map(([status, statusOrders]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold capitalize flex items-center">
                  {(() => {
                    const Icon = getStatusIcon(status as Order["status"]);
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
                        <CardTitle className="text-base">{order.id}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerName} • Table {order.tableNumber}
                      </div>
                      <Badge variant={order.location === "outdoor" ? "secondary" : "outline"} className="w-fit">
                        {order.location}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Items:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="font-semibold text-primary">${order.total.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">{getElapsedTime(order.timestamp)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {order.status === "new" && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full"
                            onClick={() => updateOrderStatus(order.id, "cooking")}
                          >
                            Start Cooking
                          </Button>
                        )}
                        {order.status === "cooking" && (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full"
                            onClick={() => updateOrderStatus(order.id, "ready")}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button 
                            variant="hero" 
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
      </div>
    </div>
  );
};

export default Staff;