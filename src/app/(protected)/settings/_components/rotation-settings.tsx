"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RotateCcw,
  Shuffle,
  BarChart2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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

interface RotationStrategy {
  id: string;
  strategy: string;
}

const strategies = [
  {
    value: "round-robin",
    label: "Round Robin",
    description: "Distribute contacts evenly across all active agents",
    icon: RotateCcw,
  },
  {
    value: "random",
    label: "Random",
    description: "Randomly assign contacts to any active agent",
    icon: Shuffle,
  },
  {
    value: "weighted",
    label: "Weighted",
    description:
      "Distribute based on agent weights (higher weight = more contacts)",
    icon: BarChart2,
  },
];

export function RotationSettings() {
  const [settings] = useState<RotationStrategy | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("round-robin");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [settingsRes, agentsRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/agents"),
      ]);

      if (settingsRes.ok) {
        const settingsResponse = await settingsRes.json();
        if (settingsResponse.success) {
          setSettings(settingsResponse.data);
          setSelectedStrategy(settingsResponse.data.strategy);
        }
      }

      if (agentsRes.ok) {
        const agentsResponse = await agentsRes.json();
        if (agentsResponse.success) {
          setAgents(agentsResponse.data);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (): Promise<void> => {
    try {
      setSaving(true);
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ strategy: selectedStrategy }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Settings saved successfully!");
        setSettings(result.data);
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const activeAgents = agents.filter((agent) => agent.isActive);
  const hasActiveAgents = activeAgents.length > 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">Rotation Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6">
              <div className="h-32 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Rotation Settings</h2>
          <p className="text-gray-600">
            Configure how contacts are distributed among your agents
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={saving || !hasActiveAgents}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {!hasActiveAgents && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You need at least one active agent to configure rotation settings.
            <br />
            Go to the Agents page to create and activate agents.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Selection */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Distribution Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedStrategy}
              onValueChange={setSelectedStrategy}
              className="space-y-4"
            >
              {strategies.map((strategy) => {
                const IconComponent = strategy.icon;
                return (
                  <div
                    key={strategy.value}
                    className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedStrategy(strategy.value)}
                  >
                    <RadioGroupItem
                      value={strategy.value}
                      id={strategy.value}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={strategy.value}
                        className="flex items-center gap-2 font-medium text-black cursor-pointer"
                      >
                        <IconComponent className="h-4 w-4" />
                        {strategy.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {strategy.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Strategy:</span>
                <Badge variant="outline" className="text-black border-gray-200">
                  {selectedStrategy.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Agents:</span>
                <span className="text-sm font-medium text-black">
                  {activeAgents.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Agents:</span>
                <span className="text-sm font-medium text-black">
                  {agents.length}
                </span>
              </div>
            </div>

            {activeAgents.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-black mb-2">
                  Active Agents:
                </h4>
                <div className="space-y-2">
                  {activeAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-black">{agent.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs text-black border-gray-200"
                        >
                          Weight: {agent.weight}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs text-black border-gray-200"
                        >
                          {agent._count?.clicks || 0} clicks
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Strategy Information */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Strategy Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedStrategy === "round-robin" && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Round Robin Distribution
                </h4>
                <p className="text-sm text-blue-800">
                  Contacts are distributed in a circular order among all active
                  agents. This ensures fair distribution and equal workload for
                  all agents. Perfect for customer support teams where you want
                  balanced coverage.
                </p>
              </div>
            )}
            {selectedStrategy === "random" && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  Random Distribution
                </h4>
                <p className="text-sm text-green-800">
                  Contacts are randomly assigned to any active agent. This
                  provides unpredictable distribution and can help with load
                  balancing in high-traffic scenarios. Good for general inquiry
                  handling.
                </p>
              </div>
            )}
            {selectedStrategy === "weighted" && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">
                  Weighted Distribution
                </h4>
                <p className="text-sm text-purple-800">
                  Contacts are distributed based on agent weights. Agents with
                  higher weights receive more contacts. This is ideal when you
                  have agents with different capacities or expertise levels.
                  Adjust agent weights in the Agents section.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
