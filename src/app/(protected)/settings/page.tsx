import { Metadata } from "next";
import { requireAuth } from "@/modules/auth/require-auth";
import { RotationSettings } from "./_components/rotation-settings";

export const metadata: Metadata = {
  title: "Settings | WhatsApp Rotator",
  description:
    "Configure your WhatsApp rotator settings and distribution strategies",
  keywords: [
    "WhatsApp",
    "settings",
    "configuration",
    "rotation",
    "distribution",
    "strategy",
  ],
};

export default async function SettingsPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <RotationSettings />
      </div>
    </div>
  );
}
