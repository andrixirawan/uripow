import { Metadata } from "next";
import { requireAuth } from "@/modules/auth/require-auth";
import { AnalyticsDashboard } from "./_components/analytics-dashboard";

export const metadata: Metadata = {
  title: "Agent Analytics | WhatsApp Rotator",
  description:
    "Track your WhatsApp agent performance and distribution analytics",
  keywords: [
    "WhatsApp",
    "analytics",
    "agents",
    "performance",
    "tracking",
    "statistics",
  ],
};

export default async function AnalyticAgentsPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
