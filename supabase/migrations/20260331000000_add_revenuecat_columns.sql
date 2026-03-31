-- Add RevenueCat columns to user_subscriptions for mobile IAP support
ALTER TABLE user_subscriptions
  ADD COLUMN platform TEXT,
  ADD COLUMN app_store_transaction_id TEXT,
  ADD COLUMN revenuecat_id TEXT;

CREATE INDEX idx_subscriptions_revenuecat ON user_subscriptions (revenuecat_id)
  WHERE revenuecat_id IS NOT NULL;
