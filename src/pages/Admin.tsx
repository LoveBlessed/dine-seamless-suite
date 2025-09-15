import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Settings, Package, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivity {
  id: string;
  type: 'order' | 'menu' | 'user';
  title: string;
  description: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    todaysSales: 0,
    activeOrders: 0,
    totalCustomers: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch today's sales
      const today = new Date().toISOString().split('T')[0];
      const { data: salesData } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', today)
        .eq('status', 'completed');

      const todaysSales = salesData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Fetch active orders
      const { data: activeOrdersData } = await supabase
        .from('orders')
        .select('id')
        .neq('status', 'completed')
        .neq('status', 'cancelled');

      // Fetch total customers
      const { data: customersData } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'customer');

      // Fetch total orders
      const { data: totalOrdersData } = await supabase
        .from('orders')
        .select('id');

      setStats({
        todaysSales,
        activeOrders: activeOrdersData?.length || 0,
        totalCustomers: customersData?.length || 0,
        totalOrders: totalOrdersData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, customer_name, total_amount, created_at, table_number')
        .order('created_at', { ascending: false })
        .limit(10);

      // Transform orders into activity items
      const orderActivities: RecentActivity[] = (ordersData || []).map(order => ({
        id: order.id,
        type: 'order' as const,
        title: 'New order received',
        description: `${order.customer_name} - $${Number(order.total_amount).toFixed(2)}${order.table_number ? ` (Table ${order.table_number})` : ''}`,
        created_at: order.created_at
      }));

      setRecentActivity(orderActivities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const statsCards = [
    {
      title: "Today's Sales",
      value: loading ? "Loading..." : `$${stats.todaysSales.toFixed(2)}`,
      change: "+12.5%",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Active Orders",
      value: loading ? "Loading..." : stats.activeOrders.toString(),
      change: "+5",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "Total Customers",
      value: loading ? "Loading..." : stats.totalCustomers.toString(),
      change: "+8.2%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: loading ? "Loading..." : stats.totalOrders.toString(),
      change: "All time",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Menu Management",
      description: "Add, edit, or remove menu items",
      action: () => navigate('/menu-management'),
      variant: "hero" as const,
    },
    {
      title: "View All Orders",
      description: "View all orders and their status",
      action: () => navigate('/staff'),
      variant: "secondary" as const,
    },
    {
      title: "Customer Management",
      description: "View and manage customer accounts",
      action: () => navigate('/customer-management'),
      variant: "menu" as const,
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      action: () => navigate('/system-settings'),
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">System management and analytics</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="border border-border hover:shadow-md transition-all duration-200 cursor-pointer" onClick={action.action}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {action.description}
                    </p>
                    <Button variant={action.variant} className="w-full" size="sm">
                      Access
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity found
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;