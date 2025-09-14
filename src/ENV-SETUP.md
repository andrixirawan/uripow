# Environment Setup Guide

## Quick Fix for Runtime Error

Jika Anda mendapat error "Environment variable DATABASE_URL is required", ikuti langkah berikut:

### 1. Buat File .env.local

Buat file `.env.local` di root project dengan konten berikut:

```env
# Environment Configuration for WhatsApp Rotator
# This file contains environment variables for development

# ===== DATABASE CONFIGURATION =====
# Development database URL
DATABASE_URL_DEV=mongodb://localhost:27017/whatsapp-rotator-dev

# Production database URL (fallback)
DATABASE_URL=mongodb://localhost:27017/whatsapp-rotator

# ===== BETTER AUTH CONFIGURATION =====
# Secret key for Better Auth (change this in production)
BETTER_AUTH_SECRET=dev-secret-key-change-in-production-12345

# Base URL for Better Auth
BETTER_AUTH_URL=http://localhost:3000

# ===== OAUTH PROVIDERS (OPTIONAL) =====
# Google OAuth (leave empty if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth (leave empty if not using)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# ===== NEXT.JS CONFIGURATION =====
# Public app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Public API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ===== API CONFIGURATION (OPTIONAL) =====
# API timeout in milliseconds
API_TIMEOUT=30000

# API retry attempts
API_RETRY_ATTEMPTS=3

# API retry delay in milliseconds
API_RETRY_DELAY=1000

# ===== LOGGING CONFIGURATION (OPTIONAL) =====
# Log level: debug, info, warn, error
LOG_LEVEL=debug

# Enable console logging
LOG_ENABLE_CONSOLE=true

# Enable file logging
LOG_ENABLE_FILE=false

# ===== SECURITY CONFIGURATION (OPTIONAL) =====
# CORS origin
CORS_ORIGIN=*

# Rate limit window in milliseconds
RATE_LIMIT_WINDOW=900000

# Rate limit max requests per window
RATE_LIMIT_MAX=100

# ===== FEATURE FLAGS (OPTIONAL) =====
# Enable analytics
FEATURE_ANALYTICS=true

# Enable caching
FEATURE_CACHING=false

# Enable rate limiting
FEATURE_RATE_LIMIT=false

# Enable debug mode
FEATURE_DEBUG_MODE=true
```

### 2. Restart Development Server

Setelah membuat file `.env.local`, restart development server:

```bash
pnpm dev
```

## Environment Variables Explanation

### Required Variables

- **DATABASE_URL_DEV**: MongoDB URL untuk development
- **DATABASE_URL**: MongoDB URL untuk production (fallback)
- **BETTER_AUTH_SECRET**: Secret key untuk Better Auth

### Optional Variables

- **GOOGLE_CLIENT_ID/SECRET**: Untuk Google OAuth (kosongkan jika tidak digunakan)
- **GITHUB_CLIENT_ID/SECRET**: Untuk GitHub OAuth (kosongkan jika tidak digunakan)
- **NEXT_PUBLIC_APP_URL**: URL aplikasi (default: http://localhost:3000)
- **NEXT_PUBLIC_API_URL**: URL API (default: http://localhost:3000/api)

### Development vs Production

- **Development**: Menggunakan fallback values jika environment variables tidak ada
- **Production**: Strict validation untuk required variables

## Troubleshooting

### Error: "Environment variable DATABASE_URL is required"

**Solusi**: Buat file `.env.local` dengan konten di atas.

### Error: "MongoDB connection failed"

**Solusi**: 
1. Pastikan MongoDB berjalan di localhost:27017
2. Atau ubah DATABASE_URL_DEV ke MongoDB URL yang benar

### Error: "Better Auth secret is required"

**Solusi**: Pastikan BETTER_AUTH_SECRET ada di `.env.local`

## Security Notes

- **Jangan commit** file `.env.local` ke version control
- **Gunakan secret yang kuat** untuk BETTER_AUTH_SECRET di production
- **Gunakan database yang berbeda** untuk development dan production
