import { Metadata } from "next";
import { requireAuth } from "@/modules/auth/require-auth";
import { AgentManager } from "./_components/agent-manager";

export const metadata: Metadata = {
  title: "Agents Management | WhatsApp Rotator",
  description:
    "Manage your WhatsApp agents for contact distribution and rotation",
  keywords: [
    "WhatsApp",
    "agents",
    "management",
    "contact distribution",
    "rotation",
  ],
};

export default async function AgentsPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <AgentManager />
      </div>
    </div>
  );
}
