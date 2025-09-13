# WhatsApp Rotator - Setup Guide

## Overview

Aplikasi WhatsApp Rotator untuk distribusi kontak yang cerdas dengan sistem grup untuk tim support yang terorganisir.

## Prerequisites

- Node.js 18+
- pnpm
- MongoDB

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Setup environment variables:
   Buat file `.env` di root directory dengan konfigurasi berikut:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/whatsapp-rotator"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

3. Generate Prisma client:

```bash
pnpm prisma generate
```

4. Push schema ke database:

```bash
pnpm prisma db push
```

5. Run development server:

```bash
pnpm dev
```

## Database Schema

Aplikasi menggunakan MongoDB dengan schema berikut:

### Models:

- **Agent**: Representasi agen WhatsApp dengan nomor telepon
- **Group**: Grup agen dengan strategi rotasi tertentu
- **AgentGroup**: Relasi many-to-many antara Agent dan Group
- **Click**: Log klik untuk analytics
- **RotationSettings**: Pengaturan strategi rotasi global

### Features:

- ✅ Sistem rotasi agen (round-robin, random, weighted)
- ✅ Manajemen grup agen
- ✅ Analytics dan tracking klik
- ✅ API endpoints untuk rotasi
- ✅ Dashboard admin yang lengkap

## API Endpoints

- `GET /api/agents` - Daftar semua agen
- `POST /api/agents` - Tambah agen baru
- `GET /api/groups` - Daftar semua grup
- `POST /api/groups` - Tambah grup baru
- `GET /api/rotate` - Rotasi agen utama
- `GET /api/rotate/[groupSlug]` - Rotasi agen berdasarkan grup
- `GET /api/analytics` - Data analytics
- `GET /api/settings` - Pengaturan rotasi

## Usage

1. Tambah agen melalui tab "Agents"
2. Buat grup dan tambahkan agen ke grup melalui tab "Groups"
3. Atur strategi rotasi di tab "Settings"
4. Gunakan URL rotator untuk redirect ke WhatsApp:
   - Main rotator: `/api/rotate`
   - Group rotator: `/api/rotate/[groupSlug]`
