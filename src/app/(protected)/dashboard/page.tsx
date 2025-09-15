import { Metadata } from "next";
import { requireAuth } from "@/modules/auth/require-auth";
import { DashboardOverview } from "./_components/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard | WhatsApp Rotator",
  description:
    "WhatsApp Rotator dashboard - Smart contact distribution with groups for organized support teams",
  keywords: [
    "WhatsApp",
    "dashboard",
    "rotator",
    "contact distribution",
    "support teams",
    "overview",
  ],
};

export default async function DashboardPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardOverview />
      </div>
    </div>
  );
}
