y# Kingdom Runners

## Image Upload Implementation

This application uses two methods for uploading images to Firebase Storage:

1. **Direct Firebase Storage Upload** (primary method)
2. **API Route Upload** (fallback method)

### How It Works

The `uploadActivityImage` function in `lib/storage/uploadImage.ts` attempts to upload images directly to Firebase Storage first. If that fails (often due to CORS issues), it automatically falls back to using the Next.js API route.

### Configuring CORS for Direct Uploads

For direct uploads to work, you need to configure CORS for your Firebase Storage bucket. We've provided a script to do this:

```bash
npm run configure-cors
```

This script applies the CORS configuration from `cors.json` to your Firebase Storage bucket, allowing direct uploads from your application's domains.

### Troubleshooting

If you encounter CORS errors when uploading images:

1. Run the CORS configuration script:
   ```bash
   npm run configure-cors
   ```

2. Check that your domain is included in the `cors.json` file:
   ```json
   [
     {
       "origin": ["http://localhost:3000", "https://kingdomrunners.app"],
       "method": ["GET", "POST", "PUT", "DELETE"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

3. If you're still having issues, the application will automatically fall back to using the API route for uploads, which should work regardless of CORS settings.

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Deployment

```bash
# Build and deploy
npm run deploy

# Deploy only Firestore and Storage rules
npm run deploy:rules
