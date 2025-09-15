import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAuth } from "@/modules/auth/require-auth";
import { User, Mail, Calendar, Shield, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfilePage = async () => {
  // Menggunakan utility function untuk authentication check
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-2">
                Kelola informasi profil dan pengaturan akun Anda
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Nama Lengkap:</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {session.user.name || "Tidak ada nama"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Email:</span>
                    </div>
                    <p className="text-lg">{session.user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">ID User:</span>
                    </div>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                      {session.user.id}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Status Akun:</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Aktif
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Terverifikasi</span>
                  <Badge variant="default" className="bg-green-500">
                    Ya
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">2FA Aktif</span>
                  <Badge variant="secondary">Tidak</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Terakhir Login</span>
                  <span className="text-sm text-gray-600">Sekarang</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Ubah Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Pengaturan Notifikasi
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privasi & Keamanan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
