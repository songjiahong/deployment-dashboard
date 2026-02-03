# Deployment Guide

## Environment Configuration

This application uses Next.js environment variable loading:

- **Development**: Uses `.env` and `.env.local` (if exists)
- **Production**: Uses `.env.production`

### How It Works

Next.js automatically loads the correct environment file based on `NODE_ENV`:

1. When `NODE_ENV=production`, Next.js loads `.env.production`
2. When `NODE_ENV=development`, Next.js loads `.env` or `.env.local`

## Production Deployment

### 1. Configure Production Environment

Edit `.env.production` with your production values:

```bash
BITBUCKET_CLIENT_ID=your_production_client_id
BITBUCKET_CLIENT_SECRET=your_production_client_secret
NEXTAUTH_URL=https://deployments.capay.com
NEXTAUTH_SECRET=your_production_secret
```

**Important**: Update the OAuth callback URL in Bitbucket:
- Go to Bitbucket workspace settings → OAuth consumers
- Update callback URL to: `https://deployments.capay.com/api/auth/callback/bitbucket`

### 2. Build for Production

```bash
npm run build
```

This command:
- Sets `NODE_ENV=production`
- Loads variables from `.env.production`
- Creates optimized production build in `.next/` directory

### 3. Start Production Server

```bash
npm run start:prod
```

Or using PM2 (recommended for production):

```bash
pm2 start npm --name "deployment-dashboard" -- run start:prod
pm2 save
pm2 startup
```

### 4. Verify Environment Variables

After starting, verify the correct environment is loaded:
- Check that `NEXTAUTH_URL` points to your production domain
- Test OAuth login redirects to production URL
- Verify Bitbucket API calls work with production credentials

## Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

Build and run:

```bash
docker build -t deployment-dashboard .
docker run -p 3000:3000 --env-file .env.production deployment-dashboard
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `BITBUCKET_CLIENT_ID` | Yes | OAuth consumer key from Bitbucket |
| `BITBUCKET_CLIENT_SECRET` | Yes | OAuth consumer secret from Bitbucket |
| `NEXTAUTH_URL` | Yes | Full URL of your application (e.g., https://deployments.capay.com) |
| `NEXTAUTH_SECRET` | Yes | Random secret for session encryption (generate with `openssl rand -base64 32`) |

## Troubleshooting

### Environment variables not loading

1. Verify `NODE_ENV=production` is set
2. Check `.env.production` file exists and has correct values
3. Restart the application after changing environment files
4. For Next.js, environment variables are loaded at build time - rebuild after changes

### OAuth callback errors

1. Ensure `NEXTAUTH_URL` matches your production domain exactly
2. Update Bitbucket OAuth consumer callback URL to match
3. Check that the callback URL includes the protocol (https://)

### Session expires immediately

1. Verify `NEXTAUTH_SECRET` is set and is a strong random value
2. Check that cookies are allowed in the browser
3. Ensure the application is served over HTTPS in production
