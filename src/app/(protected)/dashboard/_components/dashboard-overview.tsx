"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Settings,
  BarChart3,
  ExternalLink,
  Copy,
  Users,
  Target,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useDashboardOverview } from "./use-dashboard";
import { DashboardSkeleton } from "./dashboard-skeleton";

// Using types from @/types instead of local interfaces

export function DashboardOverview() {
  const router = useRouter();
  const [rotatorUrl, setRotatorUrl] = useState("");

  // React Query hooks
  const {
    agents,
    groups,
    settings: rotationSettings,
    isLoading: loading,
    error,
  } = useDashboardOverview();

  useEffect(() => {
    setRotatorUrl(`${window.location.origin}/api/rotate`);
  }, []);

  // Show error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading dashboard: {error.message}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const activeAgents = agents.filter((agent) => agent.isActive);
  const activeGroups = groups.filter((group) => group.isActive);
  // Calculate total clicks from groups only (to avoid duplication)
  const totalClicks = groups.reduce(
    (sum, group) => sum + (group._count?.clicks || 0),
    0
  );

  // Calculate agent count per group
  const groupsWithAgentCount = groups.map((group) => ({
    ...group,
    agentCount: group.agentGroups?.length || 0,
    clickCount: group._count?.clicks || 0,
  }));

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">
            WhatsApp Rotator Dashboard
          </h1>
          <p className="text-gray-600">
            Smart contact distribution with groups for organized support teams
          </p>
        </div>

        {(activeAgents.length > 0 || activeGroups.length > 0) && (
          <div className="mt-4 sm:mt-0">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ExternalLink className="h-4 w-4 text-black" />
                  <span className="font-medium text-black">
                    Main Rotator URL
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-black flex-1 truncate">
                    {rotatorUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(rotatorUrl)}
                    className="border-gray-200 text-black hover:bg-gray-50"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Groups</p>
                <p className="text-2xl font-bold text-black">{groups.length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-black">{agents.length}</p>
              </div>
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-black">
                  {activeAgents.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-black">
                  {totalClicks.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Strategy</p>
                <Badge
                  variant="outline"
                  className="mt-1 text-black border-gray-200"
                >
                  {rotationSettings?.strategy.replace("-", " ").toUpperCase() ||
                    "ROUND-ROBIN"}
                </Badge>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Quick View */}
      {groupsWithAgentCount.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Group Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupsWithAgentCount
                .filter((group) => group.isActive)
                .slice(0, 6)
                .map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium text-black">{group.name}</h4>
                      <p className="text-sm text-gray-600">
                        {group.agentCount} agents • {group.clickCount} clicks
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/api/rotate/${group.slug}`
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/projects")}
            >
              <Users className="h-6 w-6" />
              <span>Projects</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/agents")}
            >
              <Plus className="h-6 w-6" />
              <span>Agents</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/analythic-agents")}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
