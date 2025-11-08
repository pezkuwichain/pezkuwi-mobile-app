-- Add wallet_address column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Add comment to column
COMMENT ON COLUMN public.users.wallet_address IS 'Polkadot/Substrate wallet address for blockchain transactions';
