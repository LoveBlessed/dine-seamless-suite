import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Settings, Package, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  const statsCards = [
    {
      title: "Today's Sales",
      value: "$2,847.50",
      change: "+12.5%",
      icon: BarChart3,
      color: "text-status-ready",
    },
    {
      title: "Active Orders",
      value: "23",
      change: "+5",
      icon: Package,
      color: "text-status-cooking",
    },
    {
      title: "Total Customers",
      value: "156",
      change: "+8.2%",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "System Status",
      value: "Online",
      change: "All systems operational",
      icon: Settings,
      color: "text-status-ready",
    },
  ];

  const quickActions = [
    {
      title: "Menu Management",
      description: "Add, edit, or remove menu items",
      action: () => console.log("Menu management"),
      variant: "hero" as const,
    },
    {
      title: "Analytics Dashboard",
      description: "View detailed reports and insights",
      action: () => console.log("Analytics"),
      variant: "secondary" as const,
    },
    {
      title: "Inventory Control",
      description: "Manage stock levels and suppliers",
      action: () => console.log("Inventory"),
      variant: "menu" as const,
    },
    {
      title: "Staff Management",
      description: "User roles and permissions",
      action: () => console.log("Staff"),
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
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">New order received</p>
                  <p className="text-sm text-muted-foreground">Table A1 - $33.98</p>
                </div>
                <p className="text-sm text-muted-foreground">2 minutes ago</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Menu item updated</p>
                  <p className="text-sm text-muted-foreground">Gourmet Burger - Price changed</p>
                </div>
                <p className="text-sm text-muted-foreground">15 minutes ago</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Staff login</p>
                  <p className="text-sm text-muted-foreground">Kitchen staff member logged in</p>
                </div>
                <p className="text-sm text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;