"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import {
  Shield,
  Smartphone,
  Key,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Trash2,
  Plus,
  Lock,
  Globe,
  Monitor,
  Clock,
  MapPin,
  Settings,
  User,
  Bell,
  Fingerprint,
  QrCode,
} from "lucide-react";

interface SecurityDevice {
  id: string;
  name: string;
  type: "mobile" | "desktop" | "tablet";
  lastUsed: string;
  location: string;
  current: boolean;
}

interface BackupCode {
  id: string;
  code: string;
  used: boolean;
}

export default function ProfileSecurityPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [passwordlessEnabled, setPasswordlessEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Demo data
  const [trustedDevices] = useState<SecurityDevice[]>([
    {
      id: "1",
      name: "Chrome on MacBook Pro",
      type: "desktop",
      lastUsed: "2 minutes ago",
      location: "San Francisco, CA",
      current: true,
    },
    {
      id: "2",
      name: "Safari on iPhone 15",
      type: "mobile",
      lastUsed: "1 hour ago",
      location: "San Francisco, CA",
      current: false,
    },
    {
      id: "3",
      name: "Chrome on iPad",
      type: "tablet",
      lastUsed: "3 days ago",
      location: "San Francisco, CA",
      current: false,
    },
  ]);

  const [backupCodes] = useState<BackupCode[]>([
    { id: "1", code: "ABC123DE", used: false },
    { id: "2", code: "FGH456IJ", used: true },
    { id: "3", code: "KLM789NO", used: false },
    { id: "4", code: "PQR012ST", used: false },
    { id: "5", code: "UVW345XY", used: false },
  ]);

  const [recentActivity] = useState([
    {
      id: "1",
      action: "Password changed",
      time: "2 hours ago",
      ip: "192.168.1.100",
    },
    { id: "2", action: "Signed in", time: "5 hours ago", ip: "192.168.1.100" },
    { id: "3", action: "2FA enabled", time: "1 day ago", ip: "192.168.1.100" },
    {
      id: "4",
      action: "Signed in from new device",
      time: "3 days ago",
      ip: "10.0.0.15",
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Please fill in all password fields");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }
      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
      }

      // Demo API call
      console.log("Changing password...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySettingChange = async (
    setting: string,
    value: boolean
  ) => {
    setError("");
    setSuccess("");

    try {
      console.log(`${setting} ${value ? "enabled" : "disabled"}`);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      switch (setting) {
        case "twoFactor":
          setTwoFactorEnabled(value);
          setSuccess(
            `Two-factor authentication ${value ? "enabled" : "disabled"}`
          );
          break;
        case "loginAlerts":
          setLoginAlerts(value);
          setSuccess(`Login alerts ${value ? "enabled" : "disabled"}`);
          break;
        case "passwordless":
          setPasswordlessEnabled(value);
          setSuccess(`Passwordless login ${value ? "enabled" : "disabled"}`);
          break;
      }
    } catch (err) {
      setError("Failed to update security setting");
    }
  };

  const handleDeviceRevoke = async (deviceId: string) => {
    console.log("Revoking device:", deviceId);
    setSuccess("Device access revoked successfully");
  };

  const handleGenerateBackupCodes = async () => {
    console.log("Generating new backup codes...");
    setSuccess("New backup codes generated successfully");
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="animate-pulse">
          <Card className="w-full max-w-4xl">
            <CardHeader className="space-y-4">
              <div className="h-16 w-16 bg-gray-200 rounded-2xl mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded mx-auto w-64"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-80"></div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 px-4 py-12">
      <div className="max-w-4xl mx-auto animate-in fade-in-0 duration-500">
        {/* Header */}
        <Card className="mb-8 backdrop-blur-sm bg-white/90 border-0 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-r from-slate-600 via-gray-700 to-zinc-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent font-bold">
                  Security Settings
                </CardTitle>
                <CardDescription className="text-base text-gray-600 mt-1">
                  Manage your account security, privacy, and authentication
                  methods
                </CardDescription>
              </div>
            </div>

            {/* Quick Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-800">
                  2FA Enabled
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <Bell className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-blue-800">
                  Alerts Active
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <Monitor className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-800">
                  {trustedDevices.length} Devices
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Alerts */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-6 animate-in slide-in-from-top-2 duration-300"
          >
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Password
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6">
              {/* Two-Factor Authentication */}
              <Card className="bg-white/90 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Smartphone className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Two-Factor Authentication
                        </CardTitle>
                        <CardDescription>
                          Add an extra layer of security to your account
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={twoFactorEnabled ? "default" : "secondary"}
                      >
                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={(checked) =>
                          handleSecuritySettingChange("twoFactor", checked)
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                {twoFactorEnabled && (
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-medium text-green-800">
                          Authenticator App Connected
                        </p>
                      </div>
                      <p className="text-xs text-green-700">
                        Google Authenticator is set up for your account
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-2" />
                        View QR Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Login Alerts */}
              <Card className="bg-white/90 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Login Alerts</CardTitle>
                        <CardDescription>
                          Get notified of new sign-ins to your account
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={loginAlerts}
                      onCheckedChange={(checked) =>
                        handleSecuritySettingChange("loginAlerts", checked)
                      }
                    />
                  </div>
                </CardHeader>
              </Card>

              {/* Backup Codes */}
              <Card className="bg-white/90 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Key className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Backup Recovery Codes
                        </CardTitle>
                        <CardDescription>
                          Use these codes to access your account if you lose
                          your phone
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateBackupCodes}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {backupCodes.map((code) => (
                      <div
                        key={code.id}
                        className={`font-mono text-sm p-3 rounded-lg border ${
                          code.used
                            ? "bg-gray-100 text-gray-400 border-gray-200 line-through"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {code.code}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Codes
                    </Button>
                    <p className="text-xs text-gray-500 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Store these codes safely. You won't be able to see them
                      again.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card className="bg-white/90 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <Card className="bg-white/90 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Trusted Devices
                </CardTitle>
                <CardDescription>
                  Manage devices that have access to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trustedDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {device.name}
                          {device.current && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {device.lastUsed}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {device.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!device.current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeviceRevoke(device.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="bg-white/90 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Security Activity
                </CardTitle>
                <CardDescription>
                  Monitor recent actions on your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        {activity.time} • IP: {activity.ip}
                      </p>
                    </div>
                    <Badge variant="outline">{activity.time}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="mt-8 bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600">
                  Need help with your security settings?
                </p>
                <Link
                  href="/contact"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Contact our security team
                </Link>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">
                    <User className="h-4 w-4 mr-2" />
                    Back to Account
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
