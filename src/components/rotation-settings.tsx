"use client";

import { useState } from "react";
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

interface RotationSettingsProps {
  settings: RotationStrategy | null;
  onUpdate: () => void;
  agents: Agent[];
}

type Strategy = "round-robin" | "random" | "weighted";

const strategyInfo: Record<
  Strategy,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    useCase: string;
  }
> = {
  "round-robin": {
    title: "Round Robin",
    description: "Distributes contacts evenly in a circular order",
    icon: <RotateCcw className="h-5 w-5" />,
    useCase: "Best for teams with equal capacity and workload",
  },
  random: {
    title: "Random",
    description: "Randomly assigns contacts to available agents",
    icon: <Shuffle className="h-5 w-5" />,
    useCase: "Good for unpredictable workloads and varied agent availability",
  },
  weighted: {
    title: "Weighted",
    description:
      "Distributes contacts based on agent weights (higher weight = more contacts)",
    icon: <BarChart2 className="h-5 w-5" />,
    useCase:
      "Perfect when agents have different capacities or experience levels",
  },
};

export function RotationSettings({
  settings,
  onUpdate,
  agents,
}: RotationSettingsProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(
    (settings?.strategy as Strategy) || "round-robin"
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ strategy: selectedStrategy }),
      });

      if (response.ok) {
        toast.success("Settings saved successfully");
        onUpdate();
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const activeAgents = agents.filter((agent) => agent.isActive);
  const totalWeight = activeAgents.reduce(
    (sum, agent) => sum + agent.weight,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-black mb-2">
          Rotation Settings
        </h2>
        <p className="text-gray-600">
          Configure how contacts are distributed among your agents
        </p>
      </div>

      {activeAgents.length === 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            No active agents found. Please add and activate at least one agent
            before configuring rotation settings.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-black">
            <Settings className="h-5 w-5" />
            <span>Rotation Strategy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedStrategy}
            onValueChange={(value) => setSelectedStrategy(value as Strategy)}
            className="space-y-4"
          >
            {(Object.keys(strategyInfo) as Strategy[]).map((strategy) => {
              const info = strategyInfo[strategy];
              return (
                <div key={strategy} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={strategy}
                    id={strategy}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={strategy}
                      className="flex items-center space-x-2 text-black cursor-pointer"
                    >
                      {info.icon}
                      <span className="font-medium">{info.title}</span>
                      {selectedStrategy === strategy && (
                        <Badge variant="default" className="ml-2">
                          Current
                        </Badge>
                      )}
                    </Label>
                    <p className="text-sm text-gray-600">{info.description}</p>
                    <p className="text-xs text-gray-500 italic">
                      {info.useCase}
                    </p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSave}
              disabled={loading || activeAgents.length === 0}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {activeAgents.length > 0 && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Strategy Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStrategy === "weighted" ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Contacts will be distributed based on agent weights. Higher
                  weight = more contacts.
                </p>
                <div className="space-y-3">
                  {activeAgents.map((agent) => {
                    const percentage = Math.round(
                      (agent.weight / totalWeight) * 100
                    );
                    return (
                      <div
                        key={agent.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                          <span className="text-black">{agent.name}</span>
                          <Badge
                            variant="outline"
                            className="text-black border-gray-200"
                          >
                            Weight: {agent.weight}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-black">
                            {percentage}%
                          </div>
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-black"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Total weight: {totalWeight} • Percentages show expected
                  distribution
                </p>
              </div>
            ) : selectedStrategy === "round-robin" ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Contacts will be distributed evenly in a circular order:
                </p>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {activeAgents.map((agent, index) => (
                    <div
                      key={agent.id}
                      className="flex items-center space-x-2 whitespace-nowrap"
                    >
                      <Badge
                        variant="outline"
                        className="text-black border-gray-200"
                      >
                        {index + 1}. {agent.name}
                      </Badge>
                      {index < activeAgents.length - 1 && (
                        <span className="text-gray-400">→</span>
                      )}
                    </div>
                  ))}
                  <span className="text-gray-400">🔄</span>
                </div>
                <p className="text-xs text-gray-500">
                  Each agent receives exactly{" "}
                  {Math.round(100 / activeAgents.length)}% of contacts
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Contacts will be randomly assigned to any available agent:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {activeAgents.map((agent) => (
                    <Badge
                      key={agent.id}
                      variant="outline"
                      className="text-black border-gray-200 justify-center"
                    >
                      {agent.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Each agent has an equal chance (~
                  {Math.round(100 / activeAgents.length)}%) of receiving each
                  contact
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Settings Info */}
      {settings && (
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-800">
                Current strategy:{" "}
                <strong>
                  {strategyInfo[settings.strategy as Strategy]?.title ||
                    settings.strategy}
                </strong>
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
