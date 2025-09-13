"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Settings,
  BarChart3,
  ExternalLink,
  Copy,
  RefreshCw,
  Users,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentManager } from "@/components/agent-manager";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { RotationSettings } from "@/components/rotation-settings";
import GroupManager from "@/components/group-manager";
import GroupAnalytics from "@/components/group-analytics";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  phoneNumber: string;
  isActive: boolean;
  weight: number;
  createdAt: string;
  _count?: {
    clicks: number;
  };
}

interface Group {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  strategy: string;
  agentCount: number;
  clickCount: number;
}

interface RotationStrategy {
  id: string;
  strategy: string;
}

export default function Page() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [rotationSettings, setRotationSettings] =
    useState<RotationStrategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [rotatorUrl, setRotatorUrl] = useState("");

  useEffect(() => {
    loadData();
    setRotatorUrl(`${window.location.origin}/api/rotate`);
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const [agentsRes, groupsRes, settingsRes] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/groups"),
        fetch("/api/settings"),
      ]);

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        setAgents(agentsData);
      }

      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setRotationSettings(settingsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

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
  const totalClicks = agents.reduce(
    (sum, agent) => sum + (agent._count?.clicks || 0),
    0
  );
  const totalGroupClicks = groups.reduce(
    (sum, group) => sum + group.clickCount,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin text-black" />
          <span className="text-black">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              WhatsApp Rotator
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Groups</p>
                  <p className="text-2xl font-bold text-black">
                    {groups.length}
                  </p>
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
                  <p className="text-2xl font-bold text-black">
                    {agents.length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {agents.length}
                  </span>
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
                  <span className="text-white text-sm font-bold">
                    {activeAgents.length}
                  </span>
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
                    {(totalClicks + totalGroupClicks).toLocaleString()}
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
                    {rotationSettings?.strategy
                      .replace("-", " ")
                      .toUpperCase() || "ROUND-ROBIN"}
                  </Badge>
                </div>
                <Settings className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Group Quick View */}
        {groups.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Group Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGroups.slice(0, 6).map((group) => (
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

        {/* Main Content */}
        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="bg-gray-100 grid w-full grid-cols-5">
            <TabsTrigger
              value="groups"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Users className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agents
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="group-analytics"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Target className="h-4 w-4 mr-2" />
              Group Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <GroupManager />
          </TabsContent>

          <TabsContent value="agents">
            <AgentManager agents={agents} onUpdate={loadData} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard agents={agents} />
          </TabsContent>

          <TabsContent value="group-analytics">
            <GroupAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <RotationSettings
              settings={rotationSettings}
              onUpdate={loadData}
              agents={agents}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
