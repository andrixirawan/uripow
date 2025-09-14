# Authentication Implementation Guide

## Overview

Implementasi authentication check dari server untuk WhatsApp Rotator menggunakan Better Auth.

## Files yang Dibuat/Dimodifikasi

### 1. Dashboard Page (`src/app/dashboard/page.tsx`)

- **Fitur**: Server-side authentication check dengan UI yang lengkap
- **Komponen**:
  - Loading state dengan Suspense
  - Informasi user yang detail
  - Sign out button
  - Placeholder untuk fitur masa depan

### 2. Sign Out Button (`src/components/sign-out-button.tsx`)

- **Fitur**: Client component untuk sign out
- **Usage**: Dapat digunakan di berbagai halaman

### 3. Auth Utils (`src/lib/auth-utils.ts`)

- **Fungsi**:
  - `requireAuth()`: Mengecek auth dan redirect jika tidak login
  - `getSession()`: Mendapatkan session tanpa redirect
  - `isAuthenticated()`: Cek status login (boolean)

### 4. Profile Page (`src/app/profile/page.tsx`)

- **Fitur**: Contoh halaman lain yang menggunakan authentication
- **UI**: Layout yang responsive dengan sidebar

## Cara Penggunaan

### Server Component (Recommended)

```typescript
import { requireAuth } from "@/lib/auth-utils";

const MyPage = async () => {
  const session = await requireAuth(); // Auto redirect jika tidak login

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
    </div>
  );
};
```

### Client Component

```typescript
"use client";
import { useSession } from "@/lib/auth-client";

const MyComponent = () => {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;

  return <div>Welcome {session.user.name}!</div>;
};
```

## Authentication Flow

1. **User mengakses protected route**
2. **Server component memanggil `requireAuth()`**
3. **Jika tidak ada session → redirect ke `/sign-in`**
4. **Jika ada session → tampilkan konten**

## Best Practices

1. **Gunakan `requireAuth()` untuk server components**
2. **Gunakan `useSession()` untuk client components**
3. **Tambahkan loading states untuk UX yang baik**
4. **Handle error dengan try-catch atau error boundaries**

## Security Notes

- Session disimpan di HTTP-only cookies
- Server-side validation lebih aman daripada client-side
- Redirect otomatis mencegah akses unauthorized
- Setiap halaman yang memerlukan auth harus menggunakan `requireAuth()`
