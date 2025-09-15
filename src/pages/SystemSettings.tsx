import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings, Store, Bell, Shield, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const SystemSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    restaurantName: "Gourmet Express",
    restaurantAddress: "123 Food Street, Culinary City",
    restaurantPhone: "+1 (555) 123-4567",
    restaurantEmail: "info@gourmetexpress.com",
    enableNotifications: true,
    enableGuestOrders: true,
    enableTableOrders: true,
    maxOrdersPerDay: 100,
    description: "Premium dining experience with fresh, locally sourced ingredients."
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully",
    });
  };

  const settingSections = [
    {
      title: "Restaurant Information",
      icon: Store,
      color: "text-blue-600",
      fields: [
        { key: "restaurantName", label: "Restaurant Name", type: "input" },
        { key: "restaurantAddress", label: "Address", type: "input" },
        { key: "restaurantPhone", label: "Phone", type: "input" },
        { key: "restaurantEmail", label: "Email", type: "input" },
        { key: "description", label: "Description", type: "textarea" },
      ]
    },
    {
      title: "Order Settings",
      icon: Settings,
      color: "text-green-600",
      fields: [
        { key: "enableGuestOrders", label: "Allow Guest Orders", type: "switch" },
        { key: "enableTableOrders", label: "Enable Table Orders", type: "switch" },
        { key: "maxOrdersPerDay", label: "Max Orders Per Day", type: "number" },
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "text-orange-600",
      fields: [
        { key: "enableNotifications", label: "Enable System Notifications", type: "switch" },
      ]
    }
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
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
              <p className="text-sm text-muted-foreground">Configure system preferences and restaurant information</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.type === "input" && (
                      <Input
                        id={field.key}
                        value={settings[field.key as keyof typeof settings] as string}
                        onChange={(e) => setSettings({
                          ...settings,
                          [field.key]: e.target.value
                        })}
                      />
                    )}
                    {field.type === "number" && (
                      <Input
                        id={field.key}
                        type="number"
                        value={settings[field.key as keyof typeof settings] as number}
                        onChange={(e) => setSettings({
                          ...settings,
                          [field.key]: parseInt(e.target.value) || 0
                        })}
                      />
                    )}
                    {field.type === "textarea" && (
                      <Textarea
                        id={field.key}
                        value={settings[field.key as keyof typeof settings] as string}
                        onChange={(e) => setSettings({
                          ...settings,
                          [field.key]: e.target.value
                        })}
                        rows={3}
                      />
                    )}
                    {field.type === "switch" && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={field.key}
                          checked={settings[field.key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            [field.key]: checked
                          })}
                        />
                        <Label htmlFor={field.key} className="text-sm text-muted-foreground">
                          {(settings[field.key as keyof typeof settings] as boolean) ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Security & Database */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security & Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Database Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Connected & Healthy</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Backup Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Auto-backup enabled</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} size="lg">
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;