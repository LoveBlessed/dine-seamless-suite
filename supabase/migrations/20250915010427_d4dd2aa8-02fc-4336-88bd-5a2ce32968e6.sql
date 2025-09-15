-- Create menu_items table for menu management
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Mains',
  dietary TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu items
CREATE POLICY "Anyone can view available menu items" 
ON public.menu_items 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Staff and admin can view all menu items" 
ON public.menu_items 
FOR SELECT 
USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can insert menu items" 
ON public.menu_items 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can update menu items" 
ON public.menu_items 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can delete menu items" 
ON public.menu_items 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default menu items
INSERT INTO public.menu_items (name, description, price, category, dietary, is_popular) VALUES
('Gourmet Burger', 'Premium beef patty with artisanal cheese, crispy bacon, and fresh vegetables on a brioche bun', 18.99, 'Mains', '{"Gluten-Free Available"}', true),
('Garden Fresh Salad', 'Mixed greens, cherry tomatoes, cucumber, avocado, and feta cheese with house vinaigrette', 14.99, 'Salads', '{"Vegetarian", "Gluten-Free"}', false),
('Wood-Fired Pizza', 'Authentic Italian pizza with fresh mozzarella, basil, and San Marzano tomatoes', 22.99, 'Mains', '{"Vegetarian"}', true),
('Grilled Salmon', 'Fresh Atlantic salmon with lemon herb butter, served with seasonal vegetables', 26.99, 'Mains', '{"Gluten-Free", "Keto-Friendly"}', true),
('Chicken Caesar Wrap', 'Grilled chicken, romaine lettuce, parmesan cheese, and Caesar dressing in a tortilla wrap', 16.99, 'Mains', '{"High-Protein"}', false),
('Mushroom Risotto', 'Creamy arborio rice with wild mushrooms, truffle oil, and fresh herbs', 19.99, 'Mains', '{"Vegetarian", "Gluten-Free"}', false),
('Greek Salad', 'Fresh tomatoes, cucumber, olives, red onion, and feta cheese with olive oil dressing', 12.99, 'Salads', '{"Vegetarian", "Gluten-Free"}', false),
('BBQ Ribs', 'Slow-cooked pork ribs with our signature BBQ sauce, served with coleslaw', 24.99, 'Mains', '{"Gluten-Free"}', true),
('Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 8.99, 'Desserts', '{"Vegetarian"}', false),
('Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream', 7.99, 'Desserts', '{"Vegetarian"}', false),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'Beverages', '{"Vegan", "Gluten-Free"}', false),
('Espresso', 'Rich and bold Italian espresso', 3.99, 'Beverages', '{"Vegan", "Gluten-Free"}', false);