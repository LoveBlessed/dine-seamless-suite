-- Drop the existing constraint
ALTER TABLE public.orders DROP CONSTRAINT orders_order_type_check;

-- Add updated constraint with correct order types
ALTER TABLE public.orders ADD CONSTRAINT orders_order_type_check 
CHECK (order_type = ANY (ARRAY['dine-in'::text, 'takeaway'::text, 'delivery'::text]));