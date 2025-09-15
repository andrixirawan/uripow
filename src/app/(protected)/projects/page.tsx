import { Metadata } from "next";
import { requireAuth } from "@/modules/auth/require-auth";
import { GroupManager } from "./_components/group-manager";

export const metadata: Metadata = {
  title: "Projects Management | WhatsApp Rotator",
  description:
    "Manage your WhatsApp projects and groups for organized contact distribution",
  keywords: [
    "WhatsApp",
    "projects",
    "groups",
    "management",
    "contact distribution",
    "organization",
  ],
};

export default async function ProjectsPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <GroupManager />
      </div>
    </div>
  );
}
