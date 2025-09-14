"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trash2,
  Plus,
  Users,
  Copy,
  ExternalLink,
  Edit,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  strategy: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  agentGroups?: {
    agent: {
      id: string;
      name: string;
      phoneNumber: string;
    };
  }[];
  _count?: {
    clicks: number;
  };
}

interface AvailableAgent {
  id: string;
  name: string;
  phoneNumber: string;
}

const GroupManager: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [availableAgents, setAvailableAgents] = useState<AvailableAgent[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    strategy: "round-robin",
    isActive: true,
  });

  const strategies = [
    { value: "round-robin", label: "Round Robin - Fair distribution" },
    { value: "random", label: "Random - Unpredictable distribution" },
    { value: "weighted", label: "Weighted - Based on agent weights" },
  ];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch("/api/groups");
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setGroups(responseData.data);
        } else {
          toast.error(responseData.error || "Failed to fetch groups");
        }
      } else {
        toast.error("Failed to fetch groups");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (): Promise<void> => {
    try {
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const requestData = {
        ...formData,
        slug,
        isActive: formData.isActive,
      };

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        toast.success("Group created successfully");
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          description: "",
          strategy: "round-robin",
          isActive: true,
        });
        fetchGroups();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    }
  };

  const updateGroup = async (): Promise<void> => {
    if (!selectedGroup) return;

    try {
      const response = await fetch(`/api/groups/${selectedGroup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          toast.success("Group updated successfully");
          setIsEditDialogOpen(false);
          setSelectedGroup(null);
          setFormData({
            name: "",
            description: "",
            strategy: "round-robin",
            isActive: true,
          });
          fetchGroups();
        } else {
          toast.error(responseData.error || "Failed to update group");
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update group");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    }
  };

  const deleteGroup = async (groupId: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          toast.success("Group deleted successfully");
          fetchGroups();
        } else {
          toast.error(responseData.error || "Failed to delete group");
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    }
  };

  const toggleGroupStatus = async (
    groupId: string,
    isActive: boolean
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          toast.success(
            `Group ${isActive ? "activated" : "deactivated"} successfully`
          );
          fetchGroups();
        } else {
          toast.error(responseData.error || "Failed to update group status");
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update group status");
      }
    } catch (error) {
      console.error("Error updating group status:", error);
      toast.error("Failed to update group status");
    }
  };

  const fetchGroupAgents = async (groupId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/groups/${groupId}/agents`);
      if (response.ok) {
        const data = await response.json();
        setAvailableAgents(data.availableAgents);
      }
    } catch (error) {
      console.error("Error fetching group agents:", error);
    }
  };

  const addAgentToGroup = async (
    groupId: string,
    agentId: string
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/groups/${groupId}/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      if (response.ok) {
        toast.success("Agent added to group successfully");
        fetchGroups();
        fetchGroupAgents(groupId);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add agent to group");
      }
    } catch (error) {
      console.error("Error adding agent to group:", error);
      toast.error("Failed to add agent to group");
    }
  };

  const removeAgentFromGroup = async (
    groupId: string,
    agentId: string
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/groups/${groupId}/agents`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      if (response.ok) {
        toast.success("Agent removed from group successfully");
        fetchGroups();
      } else {
        toast.error("Failed to remove agent from group");
      }
    } catch (error) {
      console.error("Error removing agent from group:", error);
      toast.error("Failed to remove agent from group");
    }
  };

  const copyRotatorUrl = (slug: string): void => {
    const url = `${window.location.origin}/api/rotate/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Rotator URL copied to clipboard!");
  };

  const openEditDialog = (group: Group): void => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description || "",
      strategy: group.strategy,
      isActive: group.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openAgentDialog = (group: Group): void => {
    setSelectedGroup(group);
    fetchGroupAgents(group.id);
    setIsAgentDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading groups...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Management</h2>
          <p className="text-gray-600">
            Create and manage WhatsApp rotator groups
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Sales Support"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of this group"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="strategy">Rotation Strategy</Label>
                <Select
                  value={formData.strategy}
                  onValueChange={(value) =>
                    setFormData({ ...formData, strategy: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createGroup} className="flex-1">
                  Create Group
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge variant={group.isActive ? "default" : "secondary"}>
                  {group.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {group.description && (
                <p className="text-sm text-gray-600">{group.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Agents:</span>
                  <span className="ml-1 font-semibold">
                    {group.agentGroups?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Clicks:</span>
                  <span className="ml-1 font-semibold">
                    {group._count?.clicks || 0}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Strategy
                </div>
                <Badge variant="outline" className="text-xs">
                  {strategies
                    .find((s) => s.value === group.strategy)
                    ?.label?.split(" - ")[0] || group.strategy}
                </Badge>
              </div>

              {group.agentGroups && group.agentGroups.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Agents
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {group.agentGroups.slice(0, 3).map((agentGroup) => (
                      <Badge
                        key={agentGroup.agent.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {agentGroup.agent.name}
                      </Badge>
                    ))}
                    {group.agentGroups.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{group.agentGroups.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyRotatorUrl(group.slug)}
                  className="flex-1"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy URL
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.open(`/api/rotate/${group.slug}`, "_blank")
                  }
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(group)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openAgentDialog(group)}
                >
                  <Users className="h-3 w-3 mr-1" />
                  Agents
                </Button>
                <div className="flex items-center gap-2 ml-auto">
                  <Switch
                    checked={group.isActive}
                    onCheckedChange={(checked) =>
                      toggleGroupStatus(group.id, checked)
                    }
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteGroup(group.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No groups yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first rotator group to get started
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Group
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Group Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-strategy">Rotation Strategy</Label>
              <Select
                value={formData.strategy}
                onValueChange={(value) =>
                  setFormData({ ...formData, strategy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.value} value={strategy.value}>
                      {strategy.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={updateGroup} className="flex-1">
                Update Group
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Agents Dialog */}
      <Dialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Agents - {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="current" className="space-y-4">
            <TabsList>
              <TabsTrigger value="current">Current Agents</TabsTrigger>
              <TabsTrigger value="available">Add Agents</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-3">
              {!selectedGroup?.agentGroups ||
              selectedGroup.agentGroups.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No agents in this group yet
                </p>
              ) : (
                selectedGroup.agentGroups.map((agentGroup) => (
                  <div
                    key={agentGroup.agent.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">
                          {agentGroup.agent.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {agentGroup.agent.phoneNumber}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Weight: 1</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          removeAgentFromGroup(
                            selectedGroup.id,
                            agentGroup.agent.id
                          )
                        }
                        className="text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="available" className="space-y-3">
              {availableAgents.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No available agents to add
                </p>
              ) : (
                availableAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-gray-600">
                        {agent.phoneNumber}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        addAgentToGroup(selectedGroup!.id, agent.id)
                      }
                    >
                      Add to Group
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupManager;
