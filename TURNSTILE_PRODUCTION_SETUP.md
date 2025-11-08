# Cloudflare Turnstile Production Setup

## Current Setup (Development)

The app is currently using **Cloudflare Turnstile test keys** for development:
- Site Key: `1x00000000000000000000AA`
- Secret Key: `1x0000000000000000000000000000000AA`

These keys work with the real Cloudflare API but are for testing purposes only.

## Production Setup

When you're ready to deploy to production, follow these steps:

### 1. Create Production Turnstile Widget

1. Go to https://dash.cloudflare.com/
2. Navigate to **Turnstile** in the left menu
3. Click **"Add widget"**
4. Fill in the details:
   - **Widget name**: PezkuwiChain Mobile
   - **Domains**: Add your production domain(s)
     - Example: `pezkuwichain.io`
     - Example: `app.pezkuwichain.io`
   - **Widget Mode**: **Managed** (recommended)
5. Click **"Create"**
6. Copy the **Site Key** and **Secret Key**

### 2. Update Backend Configuration

Update `/app/backend/.env`:

```env
TURNSTILE_SECRET_KEY=your_production_secret_key_here
```

### 3. Update Frontend Configuration

Update the site key in `/app/frontend/src/screens/HumanVerificationScreen.tsx`:

```typescript
// Change this line:
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

// To:
const TURNSTILE_SITE_KEY = 'your_production_site_key_here';
```

### 4. Testing

After updating the keys:
1. Test the human verification flow
2. Verify that the widget loads correctly
3. Confirm that verification succeeds after completing the challenge

## Security Notes

- **NEVER** commit production keys to git
- Store production keys in environment variables
- The secret key should ONLY be used on the backend
- The site key can be public (used in frontend)

## Troubleshooting

If verification fails in production:
- Check that your domain is added to Cloudflare Turnstile widget settings
- Verify keys are correctly copied (no extra spaces)
- Check backend logs for Cloudflare API responses
- Ensure your domain has proper HTTPS certificate

## Cost

Cloudflare Turnstile is **completely free** with no usage limits for legitimate traffic.
