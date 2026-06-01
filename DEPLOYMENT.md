# Spandha Deployment Guide

This guide will help you deploy the Spandha matrimonial platform to production.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (recommended)
- Domain name (optional)

## Environment Setup

### 1. Database Setup

#### PostgreSQL Configuration
```sql
-- Create database
CREATE DATABASE spandha;

-- Create user (optional, for better security)
CREATE USER spandha_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE spandha TO spandha_user;
```

#### Prisma Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (for initial setup)
npx prisma db push

# Or run migrations (recommended for production)
npx prisma migrate dev --name init
```

### 2. Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/spandha"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# JWT
JWT_SECRET="your-jwt-secret-key-at-least-32-characters"

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# OTP delivery
OTP_PROVIDER="notify"
NOTIFY_USER_ID="your-notify-user-id"
NOTIFY_API_KEY="your-notify-api-key"
NOTIFY_SENDER_ID="your-notify-sender-id"

# Email OTP via Resend
EMAIL_PROVIDER="resend"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="Spandha <noreply@your-domain.com>"

# Production
NODE_ENV="production"
```

### 3. Vercel Deployment

#### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository

#### Step 2: Configure Environment Variables
In Vercel project settings, add all environment variables from `.env.local`:

```
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
JWT_SECRET
RATE_LIMIT_MAX_REQUESTS
RATE_LIMIT_WINDOW_MS
OTP_PROVIDER
NOTIFY_USER_ID
NOTIFY_API_KEY
NOTIFY_SENDER_ID
EMAIL_PROVIDER
RESEND_API_KEY
RESEND_FROM_EMAIL
NODE_ENV
```

#### Step 3: Deploy
1. Click "Deploy"
2. Vercel will automatically build and deploy your application
3. Your app will be available at `https://your-app-name.vercel.app`

### 4. Domain Configuration (Optional)

#### Custom Domain
1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

#### SSL Certificate
Vercel automatically provides SSL certificates for all deployments.

## Production Services Setup

### 1. SMS Service for OTP

SMS OTP is wired through Notify.lk in `src/lib/services/notification.ts`.
Set these environment variables in production:

```env
OTP_PROVIDER="notify"
NOTIFY_USER_ID="your-notify-user-id"
NOTIFY_API_KEY="your-notify-api-key"
NOTIFY_SENDER_ID="your-notify-sender-id"
```

### 2. Email OTP with Resend

Email OTP is wired through Resend in `src/lib/services/notification.ts`.
Create a Resend API key, verify your sending domain, then set:

```env
EMAIL_PROVIDER="resend"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="Spandha <noreply@your-domain.com>"
```

For local development, leaving `RESEND_API_KEY` unset or set to `your-resend-api-key`
will log the email OTP to the server console instead of sending an email.

Login accepts one identifier: either email or a Sri Lankan phone number. If that identifier
belongs to an existing user with both phone and email saved, the same OTP is sent through
both SMS and Resend. If only one contact exists, the OTP is sent through that available
channel. A successful OTP marks the account as verified.

### 3. Redis for Session Storage

Replace in-memory stores with Redis:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Store OTP
await redis.setex(`otp:${phone}`, 600, otp);

// Store rate limiting
await redis.setex(`rate:${phone}`, 900, attempts.toString());
```

Add to environment variables:
```env
REDIS_URL
```

## Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_profiles_active ON profiles(is_active);
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_interests_from_user ON interests(from_user_id);
CREATE INDEX idx_interests_to_user ON interests(to_user_id);
```

### 2. Caching Strategy

Enable caching in production:

```typescript
// API route caching
export async function GET(request: NextRequest) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
```

### 3. Image Optimization

Ensure all images use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={500}
  height={500}
  priority
/>
```

## Security Considerations

### 1. Database Security

```env
# Use connection pooling
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20"

# Enable SSL
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### 2. API Security

- All API routes have input validation
- Rate limiting implemented
- HTTP-only cookies for sessions
- CORS configured for production

### 3. Environment Security

- Use Vercel's encrypted environment variables
- Never commit `.env.local` to Git
- Regularly rotate secrets

## Monitoring and Analytics

### 1. Error Tracking

Add Sentry for error monitoring:

```bash
npm install @sentry/nextjs
```

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});
```

### 2. Performance Monitoring

Use Vercel Analytics:

1. Enable in Vercel dashboard
2. Add to `next.config.js`:
```javascript
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
};
```

### 3. User Analytics

Add Google Analytics:

```typescript
// in _app.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
      </body>
    </html>
  );
}
```

## Backup Strategy

### 1. Database Backup

```bash
# Daily backup
pg_dump spandha > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/spandha"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump spandha > "$BACKUP_DIR/backup_$DATE.sql"
```

### 2. File Backup

- Store important assets in cloud storage
- Regular backup of user uploads
- Version control for all code

## Scaling Considerations

### 1. Database Scaling

- Read replicas for heavy read operations
- Connection pooling
- Database partitioning for large datasets

### 2. Application Scaling

- Vercel automatically scales
- Edge functions for global distribution
- CDN for static assets

### 3. Monitoring Scaling

- Set up alerts for high traffic
- Monitor database performance
- Track user growth metrics

## Maintenance

### 1. Regular Tasks

- Update dependencies monthly
- Review and rotate secrets
- Monitor database performance
- Check SSL certificates

### 2. Updates

```bash
# Update dependencies
npm update

# Database migrations
npx prisma migrate deploy

# Redeploy
vercel --prod
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Verify database is running
   - Check network connectivity

2. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Regenerate Prisma client: `npx prisma generate`
   - Check TypeScript errors

3. **Performance Issues**
   - Check database indexes
   - Monitor API response times
   - Review caching strategy

### Debug Mode

Enable debug logging:

```env
DEBUG=prisma:*
NODE_ENV=development
```

## Support

For deployment issues:

1. Check Vercel deployment logs
2. Review database connection
3. Verify environment variables
4. Check API endpoint responses

## Post-Deployment Checklist

- [ ] Database connected and migrated
- [ ] All environment variables set
- [ ] SSL certificates active
- [ ] Domain configured
- [ ] Email/SMS services working
- [ ] Monitoring enabled
- [ ] Backup strategy implemented
- [ ] Performance tested
- [ ] Security reviewed
- [ ] Documentation updated

---

Your Spandha matrimonial platform is now ready for production!
