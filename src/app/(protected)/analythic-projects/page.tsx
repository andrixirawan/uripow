import { Metadata } from "next";
import { requireAuth } from "@/modules/auth/require-auth";
import { GroupAnalytics } from "./_components/group-analytics";

export const metadata: Metadata = {
  title: "Project Analytics | WhatsApp Rotator",
  description: "Track your WhatsApp project and group performance analytics",
  keywords: [
    "WhatsApp",
    "analytics",
    "projects",
    "groups",
    "performance",
    "tracking",
    "statistics",
  ],
};

export default async function AnalyticProjectsPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <GroupAnalytics />
      </div>
    </div>
  );
}
