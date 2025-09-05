import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Users, Shield, QrCode, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-restaurant.jpg";

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Customer",
      description: "Browse menu, place orders, and track your dining experience",
      icon: QrCode,
      features: ["QR Code Ordering", "Real-time Tracking", "Contactless Payment"],
      action: () => navigate("/menu"),
      variant: "hero" as const,
    },
    {
      title: "Staff",
      description: "Manage orders, tables, and kitchen operations efficiently",
      icon: Users,
      features: ["Order Management", "Table Status", "Kitchen Display"],
      action: () => navigate("/staff"),
      variant: "secondary" as const,
    },
    {
      title: "Admin",
      description: "Full system control, analytics, and menu management",
      icon: Shield,
      features: ["Menu Control", "Analytics", "Inventory Management"],
      action: () => navigate("/admin"),
      variant: "menu" as const,
    },
  ];

  const highlights = [
    {
      icon: MapPin,
      title: "Indoor & Outdoor",
      description: "Seamless dining experience across all seating areas"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Know exactly when your order will be ready"
    },
    {
      icon: ChefHat,
      title: "Professional Kitchen",
      description: "Streamlined operations for perfect service"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Taste the <span className="text-primary">Future</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience seamless dining with our innovative indoor and outdoor eatery system. 
            From QR code ordering to real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate("/menu")}
              className="text-lg px-8 py-6"
            >
              <QrCode className="mr-2 h-5 w-5" />
              Start Ordering
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/staff")}
              className="text-lg px-8 py-6 bg-background/80 backdrop-blur-sm"
            >
              Staff Access
            </Button>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for modern dining experiences with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-warm transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mb-4">
                    <highlight.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Access Level
            </h2>
            <p className="text-lg text-muted-foreground">
              Each role is designed for optimal efficiency and user experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                    <role.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={role.variant}
                    className="w-full" 
                    onClick={role.action}
                    size="lg"
                  >
                    Access {role.title} Portal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Premium Eatery System. Designed for exceptional dining experiences.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;