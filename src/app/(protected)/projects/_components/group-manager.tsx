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
import { Trash2, Plus, Users, Copy, Edit, UserCheck } from "lucide-react";
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
      isActive: boolean;
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
  isActive: boolean;
}

export function GroupManager() {
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
  ];

  useEffect(() => {
    fetchGroups();
    fetchAvailableAgents();
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

  const fetchAvailableAgents = async (): Promise<void> => {
    try {
      const response = await fetch("/api/agents");
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setAvailableAgents(responseData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Group created successfully!");
        fetchGroups();
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          description: "",
          strategy: "round-robin",
          isActive: true,
        });
      } else {
        toast.error(result.error || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    }
  };

  const handleEditGroup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      const response = await fetch(`/api/groups/${selectedGroup.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Group updated successfully!");
        fetchGroups();
        setIsEditDialogOpen(false);
        setSelectedGroup(null);
        setFormData({
          name: "",
          description: "",
          strategy: "round-robin",
          isActive: true,
        });
      } else {
        toast.error(result.error || "Failed to update group");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    }
  };

  const handleDeleteGroup = async (groupId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Group deleted successfully!");
        fetchGroups();
      } else {
        toast.error(result.error || "Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    }
  };

  const handleToggleGroupStatus = async (groupId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Group status updated successfully!");
        fetchGroups();
      } else {
        toast.error(result.error || "Failed to update group status");
      }
    } catch (error) {
      console.error("Error updating group status:", error);
      toast.error("Failed to update group status");
    }
  };

  const handleAddAgentToGroup = async (agentId: string): Promise<void> => {
    if (!selectedGroup) return;

    try {
      const response = await fetch(
        `/api/groups/${selectedGroup.id}/agents/${agentId}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Agent added to group successfully!");
        fetchGroups();
        setIsAgentDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to add agent to group");
      }
    } catch (error) {
      console.error("Error adding agent to group:", error);
      toast.error("Failed to add agent to group");
    }
  };

  const handleRemoveAgentFromGroup = async (
    groupId: string,
    agentGroupId: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `/api/groups/${groupId}/agents/${agentGroupId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Agent removed from group successfully!");
        fetchGroups();
      } else {
        toast.error(result.error || "Failed to remove agent from group");
      }
    } catch (error) {
      console.error("Error removing agent from group:", error);
      toast.error("Failed to remove agent from group");
    }
  };

  const copyGroupUrl = async (slug: string): Promise<void> => {
    const url = `${window.location.origin}/api/rotate/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Group URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL to clipboard");
    }
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
    setIsAgentDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">Group Management</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
          <h2 className="text-2xl font-bold text-black">Group Management</h2>
          <p className="text-gray-600">
            Organize your agents into groups for targeted distribution
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter group description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strategy">Distribution Strategy</Label>
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Create
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No groups yet
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Create your first group to organize your agents and start
              distributing contacts
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card key={group.id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-black">
                    {group.name}
                  </CardTitle>
                  <Badge
                    variant={group.isActive ? "default" : "secondary"}
                    className={
                      group.isActive
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }
                  >
                    {group.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {group.description && (
                  <p className="text-sm text-gray-600">{group.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Strategy:</span>
                  <Badge
                    variant="outline"
                    className="text-black border-gray-200"
                  >
                    {group.strategy.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Agents:</span>
                  <span className="text-sm font-medium text-black">
                    {group.agentGroups?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Clicks:</span>
                  <span className="text-sm font-medium text-black">
                    {group._count?.clicks || 0}
                  </span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyGroupUrl(group.slug)}
                    className="flex-1 border-gray-200 text-black hover:bg-gray-50"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(group)}
                    className="flex-1 border-gray-200 text-black hover:bg-gray-50"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleGroupStatus(group.id)}
                    className={`flex-1 ${
                      group.isActive
                        ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {group.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteGroup(group.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openAgentDialog(group)}
                  className="w-full border-gray-200 text-black hover:bg-gray-50"
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Manage Agents
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditGroup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Group Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter group name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter group description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-strategy">Distribution Strategy</Label>
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
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800"
              >
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Agents Dialog */}
      <Dialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Agents - {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Agents</TabsTrigger>
              <TabsTrigger value="available">Add Agents</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="space-y-4">
              <div className="max-h-60 overflow-y-auto">
                {selectedGroup?.agentGroups &&
                selectedGroup.agentGroups.length > 0 ? (
                  <div className="space-y-2">
                    {selectedGroup.agentGroups.map((agentGroup) => (
                      <div
                        key={agentGroup.agent.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-black">
                              {agentGroup.agent.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {agentGroup.agent.phoneNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              agentGroup.agent.isActive
                                ? "default"
                                : "destructive"
                            }
                          >
                            {agentGroup.agent.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRemoveAgentFromGroup(
                                selectedGroup.id,
                                agentGroup.agent.id
                              )
                            }
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No agents in this group</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="available" className="space-y-4">
              <div className="max-h-60 overflow-y-auto">
                {availableAgents.length > 0 ? (
                  <div className="space-y-2">
                    {availableAgents
                      .filter(
                        (agent) =>
                          !selectedGroup?.agentGroups?.some(
                            (ag) => ag.agent.id === agent.id
                          )
                      )
                      .map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <UserCheck className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-black">
                                {agent.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {agent.phoneNumber}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                agent.isActive ? "default" : "destructive"
                              }
                            >
                              {agent.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddAgentToGroup(agent.id)}
                              className="border-green-200 text-green-600 hover:bg-green-50"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No available agents</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
