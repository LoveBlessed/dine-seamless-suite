-- Drop the existing check constraint that's causing issues
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add a new check constraint with all valid status values
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'));