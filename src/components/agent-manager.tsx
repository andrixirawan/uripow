"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Power, PowerOff, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

interface AgentManagerProps {
  agents: Agent[];
  onUpdate: () => void;
}

export function AgentManager({ agents, onUpdate }: AgentManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    weight: 1,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingAgent
        ? `/api/agents/${editingAgent.id}`
        : "/api/agents";
      const method = editingAgent ? "PUT" : "POST";

      // Prepare data based on operation type
      const requestData = editingAgent
        ? formData // For update, send all fields
        : {
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            weight: Number(formData.weight), // Ensure weight is a number
            isActive: formData.isActive, // Include isActive field
          }; // For create, send required fields including isActive

      console.log("Sending request data:", requestData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        toast.success(
          editingAgent
            ? "Agent updated successfully"
            : "Agent added successfully"
        );
        setIsAddOpen(false);
        setEditingAgent(null);
        setFormData({ name: "", phoneNumber: "", weight: 1, isActive: true });
        onUpdate();
      } else {
        const error = await response.text();
        toast.error(error || "Failed to save agent");
      }
    } catch {
      toast.error("Failed to save agent");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (agent: Agent): void => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      phoneNumber: agent.phoneNumber,
      weight: agent.weight,
      isActive: agent.isActive,
    });
    setIsAddOpen(true);
  };

  const handleDelete = async (agentId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Agent deleted successfully");
        onUpdate();
      } else {
        toast.error("Failed to delete agent");
      }
    } catch {
      toast.error("Failed to delete agent");
    }
  };

  const toggleAgent = async (agent: Agent): Promise<void> => {
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...agent,
          isActive: !agent.isActive,
        }),
      });

      if (response.ok) {
        toast.success(agent.isActive ? "Agent deactivated" : "Agent activated");
        onUpdate();
      } else {
        toast.error("Failed to update agent status");
      }
    } catch {
      toast.error("Failed to update agent status");
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) {
      return cleaned;
    }
    return `+${cleaned}`;
  };

  const generateWhatsAppUrl = (phoneNumber: string): string => {
    const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
    return `https://wa.me/${cleanNumber}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-black">Manage Agents</h2>
          <p className="text-gray-600">
            Add and configure your support team members
          </p>
        </div>

        <Dialog
          open={isAddOpen}
          onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) {
              setEditingAgent(null);
              setFormData({
                name: "",
                phoneNumber: "",
                weight: 1,
                isActive: true,
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-black">
                {editingAgent ? "Edit Agent" : "Add New Agent"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-black">
                  Agent Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Sarah Johnson"
                  required
                  className="border-gray-200 text-black"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-black">
                  WhatsApp Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber: formatPhoneNumber(e.target.value),
                    })
                  }
                  placeholder="e.g. +1234567890"
                  required
                  className="border-gray-200 text-black"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-black">
                  Weight (for weighted rotation)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: parseInt(e.target.value) || 1,
                    })
                  }
                  className="border-gray-200 text-black"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive" className="text-black">
                  Active
                </Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  disabled={loading}
                  className="border-gray-200 text-black hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {loading ? "Saving..." : editingAgent ? "Update" : "Add"}{" "}
                  Agent
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {agents.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="p-8 text-center">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">
              No agents yet
            </h3>
            <p className="text-gray-600 mb-4">
              Add your first WhatsApp agent to get started
            </p>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={`border ${
                agent.isActive ? "border-gray-200" : "border-red-200 bg-red-50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-black">
                    {agent.name}
                  </CardTitle>
                  <Badge variant={agent.isActive ? "default" : "destructive"}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-mono text-black">{agent.phoneNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Weight</p>
                    <p className="font-medium text-black">{agent.weight}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Clicks</p>
                    <p className="font-medium text-black">
                      {agent._count?.clicks || 0}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(agent)}
                      className="border-gray-200 text-black hover:bg-gray-50"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAgent(agent)}
                      className={`border-gray-200 ${
                        agent.isActive
                          ? "text-red-600 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {agent.isActive ? (
                        <PowerOff className="h-3 w-3" />
                      ) : (
                        <Power className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          generateWhatsAppUrl(agent.phoneNumber),
                          "_blank"
                        )
                      }
                      className="border-gray-200 text-green-600 hover:bg-green-50"
                    >
                      <Phone className="h-3 w-3" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white border border-gray-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-black">
                            Delete Agent
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to delete {agent.name}? This
                            action cannot be undone and will also delete all
                            associated click data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-200 text-black hover:bg-gray-50">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(agent.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
