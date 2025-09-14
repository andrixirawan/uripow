# Environment Variables Example

Copy the content below to your `.env.local` file and fill in your values.

```env
# Environment Configuration Example
# Copy this content to .env.local and fill in your values

# ===== DATABASE CONFIGURATION =====
# Production database URL
DATABASE_URL=mongodb://localhost:27017/whatsapp-rotator

# Development database URL (optional - will fallback to DATABASE_URL if not set)
DATABASE_URL_DEV=mongodb://localhost:27017/whatsapp-rotator-dev

# ===== BETTER AUTH CONFIGURATION =====
# Secret key for Better Auth (required)
BETTER_AUTH_SECRET=your-secret-key-here-change-this-in-production

# Base URL for Better Auth (default: http://localhost:3000)
BETTER_AUTH_URL=http://localhost:3000

# ===== OAUTH PROVIDERS =====
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# ===== NEXT.JS CONFIGURATION =====
# Public app URL (default: http://localhost:3000)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Public API URL (default: http://localhost:3000/api)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ===== API CONFIGURATION (OPTIONAL) =====
# API timeout in milliseconds (default: 30000)
API_TIMEOUT=30000

# API retry attempts (default: 3)
API_RETRY_ATTEMPTS=3

# API retry delay in milliseconds (default: 1000)
API_RETRY_DELAY=1000

# ===== LOGGING CONFIGURATION (OPTIONAL) =====
# Log level: debug, info, warn, error (default: debug in dev, info in prod)
LOG_LEVEL=debug

# Enable console logging (default: true in dev, false in prod)
LOG_ENABLE_CONSOLE=true

# Enable file logging (default: false in dev, true in prod)
LOG_ENABLE_FILE=false

# ===== SECURITY CONFIGURATION (OPTIONAL) =====
# CORS origin (default: *)
CORS_ORIGIN=*

# Rate limit window in milliseconds (default: 15 minutes)
RATE_LIMIT_WINDOW=900000

# Rate limit max requests per window (default: 100)
RATE_LIMIT_MAX=100

# ===== FEATURE FLAGS (OPTIONAL) =====
# Enable analytics (default: true)
FEATURE_ANALYTICS=true

# Enable caching (default: false in dev, true in prod)
FEATURE_CACHING=false

# Enable rate limiting (default: false in dev, true in prod)
FEATURE_RATE_LIMIT=false

# Enable debug mode (default: true in dev, false in prod)
FEATURE_DEBUG_MODE=true
```

## Setup Instructions

1. **Copy the content above** to a new file called `.env.local` in your project root
2. **Fill in your actual values** for each environment variable
3. **Required variables**:
   - `DATABASE_URL` (or `DATABASE_URL_DEV` for development)
   - `BETTER_AUTH_SECRET`
   - OAuth provider credentials (Google, GitHub)
4. **Optional variables** have defaults and can be omitted

## Environment-Specific Setup

### Development

```env
DATABASE_URL_DEV=mongodb://localhost:27017/whatsapp-rotator-dev
BETTER_AUTH_SECRET=dev-secret-key
GOOGLE_CLIENT_ID=your-dev-google-client-id
GOOGLE_CLIENT_SECRET=your-dev-google-client-secret
```

### Production

```env
DATABASE_URL=mongodb://your-production-db-url
BETTER_AUTH_SECRET=your-production-secret-key
GOOGLE_CLIENT_ID=your-prod-google-client-id
GOOGLE_CLIENT_SECRET=your-prod-google-client-secret
```

## Security Notes

- **Never commit** `.env.local` to version control
- **Use strong secrets** for `BETTER_AUTH_SECRET` in production
- **Use different OAuth apps** for development and production
- **Use different databases** for development and production
