-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_name TEXT NOT NULL DEFAULT 'Oliver Tweest',
  restaurant_address TEXT NOT NULL DEFAULT 'Uyo, Akwa Ibom State',
  restaurant_phone TEXT NOT NULL DEFAULT '+234 (800) 123-4567',
  restaurant_email TEXT NOT NULL DEFAULT 'info@olivertweest.com',
  description TEXT NOT NULL DEFAULT 'Premium dining experience with fresh, locally sourced ingredients.',
  enable_notifications BOOLEAN NOT NULL DEFAULT true,
  enable_guest_orders BOOLEAN NOT NULL DEFAULT true,
  enable_table_orders BOOLEAN NOT NULL DEFAULT true,
  max_orders_per_day INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system settings (only admin can manage)
CREATE POLICY "Admin can view system settings" 
ON public.system_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can update system settings" 
ON public.system_settings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can insert system settings" 
ON public.system_settings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.system_settings (restaurant_name, restaurant_address, restaurant_phone, restaurant_email, description)
VALUES ('Oliver Tweest', 'Uyo, Akwa Ibom State', '+234 (800) 123-4567', 'info@olivertweest.com', 'Premium dining experience with fresh, locally sourced ingredients.');