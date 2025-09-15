"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useCreateGroup, useUpdateGroup } from "./use-groups";
import { GroupFormSchema, type GroupFormSchemaType } from "@/schemas";
import { GroupWithRelationsType } from "@/types";
import { useAgents } from "@/app/(protected)/agents/_components/use-agents";

interface GroupFormProps {
  editingGroup: GroupWithRelationsType | null;
  groups: GroupWithRelationsType[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormSubmissionData {
  name?: string;
  slug?: string;
  description?: string;
  strategy?: "round-robin" | "random";
  isActive?: boolean;
  selectedAgents?: string[];
  agentWeights?: Record<string, number>;
}

interface GroupFormRef {
  setEditValues: (group: GroupWithRelationsType) => void;
  resetForm: () => void;
}

export const GroupForm = React.forwardRef<GroupFormRef, GroupFormProps>(
  ({ editingGroup, groups, onSuccess, onCancel }, ref) => {
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [agentWeights, setAgentWeights] = useState<Record<string, number>>(
      {}
    );

    const form = useForm<GroupFormSchemaType>({
      resolver: zodResolver(GroupFormSchema),
      defaultValues: {
        name: "",
        slug: "",
        description: "",
        strategy: "round-robin",
        isActive: true,
      },
      mode: "onChange",
    });

    // React Query hooks
    const createGroupMutation = useCreateGroup();
    const updateGroupMutation = useUpdateGroup();
    const { data: agentsData, isLoading: agentsLoading } = useAgents({
      page: 1,
      limit: 100, // Get all agents for selection
    });

    const agents = agentsData?.agents || [];

    // Set form values untuk edit mode
    const setEditValues = useCallback(
      (group: GroupWithRelationsType): void => {
        form.reset({
          name: group.name,
          slug: group.slug,
          description: group.description || "",
          strategy: group.strategy as "round-robin" | "random",
          isActive: group.isActive,
        });

        // Set selected agents from group's agentGroups
        const groupAgentIds = group.agentGroups?.map((ag) => ag.agent.id) || [];
        setSelectedAgents(groupAgentIds);

        // Set agent weights from group's agentGroups
        const weights: Record<string, number> = {};
        group.agentGroups?.forEach((ag) => {
          weights[ag.agent.id] = ag.weight || 1;
        });
        setAgentWeights(weights);

        form.clearErrors();
      },
      [form]
    );

    // Reset form untuk create mode
    const resetForm = useCallback((): void => {
      form.reset({
        name: "",
        slug: "",
        description: "",
        strategy: "round-robin",
        isActive: true,
      });
      setSelectedAgents([]);
      setAgentWeights({}); // Clear agent weights on reset
      form.clearErrors();
    }, [form]);

    // Auto-populate form saat editingGroup berubah
    useEffect(() => {
      if (editingGroup) {
        setEditValues(editingGroup);
      } else {
        resetForm();
      }
    }, [editingGroup, setEditValues, resetForm]);

    // Auto-generate slug dari name
    const generateSlug = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    // Watch name untuk auto-generate slug
    const watchedName = form.watch("name");
    useEffect(() => {
      if (watchedName && !editingGroup) {
        const slug = generateSlug(watchedName);
        form.setValue("slug", slug);
      }
    }, [watchedName, editingGroup, form]);

    // Validasi duplikasi slug
    const validateSlugDuplication = (slug: string): boolean => {
      if (editingGroup) {
        // Edit mode: cek duplikasi hanya jika slug berubah
        if (form.formState.dirtyFields.slug) {
          return groups.some(
            (group) => group.id !== editingGroup.id && group.slug === slug
          );
        }
        return false; // Slug tidak berubah, tidak perlu validasi
      } else {
        // Create mode: cek duplikasi dengan semua groups
        return groups.some((group) => group.slug === slug);
      }
    };

    // Handle agent selection
    const handleAgentToggle = (agentId: string) => {
      setSelectedAgents((prev) => {
        if (prev.includes(agentId)) {
          // Remove agent and its weight
          setAgentWeights((weights) => {
            const newWeights = { ...weights };
            delete newWeights[agentId];
            return newWeights;
          });
          return prev.filter((id) => id !== agentId);
        } else {
          // Add agent with default weight
          setAgentWeights((weights) => ({
            ...weights,
            [agentId]: 1, // Default weight
          }));
          return [...prev, agentId];
        }
      });
    };

    // Handle weight change
    const handleWeightChange = (agentId: string, weight: number) => {
      setAgentWeights((prev) => ({
        ...prev,
        [agentId]: weight,
      }));
    };

    // Build data untuk dikirim ke API
    const buildSubmissionData = (
      data: GroupFormSchemaType
    ): FormSubmissionData => {
      if (editingGroup) {
        // Edit mode: hanya kirim field yang dirty (berubah)
        const submissionData: FormSubmissionData = {};

        if (form.formState.dirtyFields.name) {
          submissionData.name = data.name;
        }

        if (form.formState.dirtyFields.slug) {
          submissionData.slug = data.slug;
        }

        if (form.formState.dirtyFields.description) {
          submissionData.description = data.description || "";
        }

        if (form.formState.dirtyFields.strategy) {
          submissionData.strategy = data.strategy;
        }

        if (form.formState.dirtyFields.isActive) {
          submissionData.isActive = data.isActive;
        }

        // Check if selected agents changed
        const originalAgentIds =
          editingGroup.agentGroups?.map((ag) => ag.agent.id) || [];
        const agentsChanged =
          JSON.stringify([...selectedAgents].sort()) !==
          JSON.stringify([...originalAgentIds].sort());

        if (agentsChanged) {
          submissionData.selectedAgents = selectedAgents;
          submissionData.agentWeights = agentWeights;
        }

        return submissionData;
      } else {
        // Create mode: kirim semua field
        return {
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          strategy: data.strategy,
          isActive: data.isActive,
          selectedAgents: selectedAgents,
          agentWeights: agentWeights, // Include agent weights for creation
        };
      }
    };

    const onSubmit = async (data: GroupFormSchemaType): Promise<void> => {
      form.clearErrors();

      try {
        const dataToSend = buildSubmissionData(data);

        // Validasi duplikasi slug
        if (validateSlugDuplication(data.slug)) {
          form.setError("slug", {
            type: "manual",
            message: editingGroup
              ? "Slug sudah digunakan oleh project lain"
              : "Slug sudah digunakan",
          });
          return;
        }

        if (editingGroup) {
          // Update group
          await updateGroupMutation.mutateAsync({
            groupId: editingGroup.id,
            data: dataToSend,
          });
        } else {
          // Create group
          await createGroupMutation.mutateAsync(dataToSend);
        }

        onSuccess();
      } catch (error: unknown) {
        console.error("Error saving group:", error);

        // Handle field-specific errors
        if (
          error &&
          typeof error === "object" &&
          "details" in error &&
          Array.isArray(error.details)
        ) {
          error.details.forEach(
            (detail: { field: string; message: string }) => {
              if (detail.field && detail.message) {
                form.setError(detail.field as keyof GroupFormSchemaType, {
                  type: "server",
                  message: detail.message,
                });
              }
            }
          );
        } else {
          form.setError("root", {
            type: "server",
            message: (error as Error)?.message || "Gagal menyimpan project",
          });
        }
      }
    };

    // Expose methods untuk parent component
    React.useImperativeHandle(ref, () => ({
      setEditValues,
      resetForm,
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Debug info for dirtyFields (development only) */}
          {process.env.NODE_ENV === "development" && editingGroup && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Debug Info:
              </h4>
              <div className="text-xs text-blue-700">
                <p>
                  Dirty Fields: {JSON.stringify(form.formState.dirtyFields)}
                </p>
                <p>
                  Changed Fields:{" "}
                  {Object.keys(form.formState.dirtyFields).join(", ") || "None"}
                </p>
              </div>
            </div>
          )}

          {/* Root Error Display */}
          {form.formState.errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Nama Project
                  {editingGroup && form.formState.dirtyFields.name && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Changed
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Slug
                  {editingGroup && form.formState.dirtyFields.slug && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Changed
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="project-slug"
                    {...field}
                    className="font-mono"
                  />
                </FormControl>
                <p className="text-xs text-gray-500">
                  URL-friendly identifier (huruf kecil, angka, dan tanda hubung)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Deskripsi
                  {editingGroup && form.formState.dirtyFields.description && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Changed
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi project (opsional)"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="strategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Strategi Rotasi
                  {editingGroup && form.formState.dirtyFields.strategy && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Changed
                    </span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih strategi rotasi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="random">Random</SelectItem>
                    <SelectItem value="weighted">Weighted</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base flex items-center gap-2">
                    Status Aktif
                    {editingGroup && form.formState.dirtyFields.isActive && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Changed
                      </span>
                    )}
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Project akan aktif dan dapat menerima rotasi
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Agent Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Agents</h3>
              <p className="text-sm text-gray-500">
                {selectedAgents.length} agent
                {selectedAgents.length !== 1 ? "s" : ""} selected
              </p>
            </div>

            {agentsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 animate-pulse rounded"
                  ></div>
                ))}
              </div>
            ) : agents.length > 0 ? (
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {agents
                  .filter((agent) => agent.isActive) // Only show active agents
                  .map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center space-x-3 p-3 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        id={`agent-${agent.id}`}
                        checked={selectedAgents.includes(agent.id)}
                        onChange={() => handleAgentToggle(agent.id)}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`agent-${agent.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-black">
                              {agent.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              +
                              {agent.phoneNumber.startsWith("62")
                                ? agent.phoneNumber
                                : "62" + agent.phoneNumber}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {agent._count?.clicks || 0} clicks
                          </div>
                        </div>
                      </label>

                      {/* Weight Input - Only show if agent is selected */}
                      {selectedAgents.includes(agent.id) && (
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor={`weight-${agent.id}`}
                            className="text-xs text-gray-500"
                          >
                            Weight:
                          </Label>
                          <Input
                            id={`weight-${agent.id}`}
                            type="number"
                            min="1"
                            max="10"
                            value={agentWeights[agent.id] || 1}
                            onChange={(e) =>
                              handleWeightChange(
                                agent.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">No active agents available</p>
                <p className="text-xs text-gray-400 mt-1">
                  Create some agents first before adding them to a project
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={form.formState.isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isValid ||
                createGroupMutation.isPending ||
                updateGroupMutation.isPending
              }
            >
              {form.formState.isSubmitting ||
              createGroupMutation.isPending ||
              updateGroupMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingGroup ? "Memperbarui..." : "Membuat..."}
                </>
              ) : editingGroup ? (
                "Perbarui"
              ) : (
                "Buat Project"
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
);

GroupForm.displayName = "GroupForm";
