import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAuth } from "@/modules/auth/require-auth";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { Suspense } from "react";

// Loading component untuk session check
const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

// Component untuk menampilkan informasi user
const UserInfo = ({
  user,
}: {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}) => (
  <Card className="w-full max-w-2xl">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Informasi User
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Nama:</span>
          </div>
          <p className="text-lg font-semibold">
            {user.name || "Tidak ada nama"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Email:</span>
          </div>
          <p className="text-lg">{user.email}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">ID User:</span>
          </div>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded">{user.id}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Status:</span>
          </div>
          <Badge variant="default" className="bg-green-500">
            Terautentikasi
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardPage = async () => {
  // Menggunakan utility function untuk authentication check
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Selamat datang di WhatsApp Rotator Dashboard
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">
                Halo, {session.user.name || session.user.email}! 👋
              </h2>
              <p className="text-gray-600">
                Anda berhasil login ke sistem. Dashboard ini menampilkan
                informasi akun Anda dan akan menjadi pusat kontrol untuk fitur
                WhatsApp Rotator.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Information */}
        <Suspense fallback={<DashboardLoading />}>
          <UserInfo user={session.user} />
        </Suspense>

        {/* Future Features Placeholder */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Fitur yang Akan Datang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Group Management</h3>
                  <p className="text-sm text-gray-600">
                    Kelola grup WhatsApp dan agen rotasi
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600">
                    Lihat statistik dan performa rotasi
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Settings</h3>
                  <p className="text-sm text-gray-600">
                    Konfigurasi rotasi dan notifikasi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
