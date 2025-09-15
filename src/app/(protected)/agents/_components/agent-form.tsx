"use client";

import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AgentFormSchema, type AgentFormSchemaType } from "@/schemas";
import { useCreateAgent, useUpdateAgent } from "./use-agents";
import { AgentWithRelationsType } from "@/types";

interface AgentFormProps {
  editingAgent: AgentWithRelationsType | null;
  agents: AgentWithRelationsType[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormSubmissionData {
  name?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

interface AgentFormRef {
  setEditValues: (agent: AgentWithRelationsType) => void;
  resetForm: () => void;
}

export const AgentForm = React.forwardRef<AgentFormRef, AgentFormProps>(
  ({ editingAgent, agents, onSuccess, onCancel }, ref) => {
    const form = useForm<AgentFormSchemaType>({
      resolver: zodResolver(AgentFormSchema),
      defaultValues: {
        name: "",
        phoneNumber: "",
        isActive: true,
      },
      mode: "onChange",
    });

    // React Query mutations
    const createAgentMutation = useCreateAgent();
    const updateAgentMutation = useUpdateAgent();

    // Set form values untuk edit mode
    const setEditValues = useCallback(
      (agent: AgentWithRelationsType): void => {
        let displayPhone = agent.phoneNumber;
        if (displayPhone.startsWith("62")) {
          displayPhone = displayPhone.slice(2);
        }

        form.reset({
          name: agent.name,
          phoneNumber: displayPhone,
          isActive: agent.isActive,
        });
        form.clearErrors();
      },
      [form]
    );

    // Reset form untuk create mode
    const resetForm = useCallback((): void => {
      form.reset({
        name: "",
        phoneNumber: "",
        isActive: true,
      });
      form.clearErrors();
    }, [form]);

    // Auto-populate form saat editingAgent berubah
    useEffect(() => {
      if (editingAgent) {
        setEditValues(editingAgent);
      } else {
        resetForm();
      }
    }, [editingAgent, setEditValues, resetForm]);

    // Format phone number untuk display - hapus 0 dan 62 di awal
    const formatPhoneNumber = (value: string): string => {
      let cleanPhone = value.replace(/\D/g, "");

      if (cleanPhone.startsWith("0")) {
        cleanPhone = cleanPhone.slice(1);
      }

      if (cleanPhone.startsWith("62")) {
        cleanPhone = cleanPhone.slice(2);
      }

      return cleanPhone;
    };

    // Konversi phone number untuk disimpan ke database
    const convertPhoneForDatabase = (phoneNumber: string): string => {
      const cleanPhone = phoneNumber.replace(/\D/g, "");

      if (cleanPhone.startsWith("0")) {
        return "62" + cleanPhone.slice(1);
      }

      if (cleanPhone.startsWith("62")) {
        return cleanPhone;
      }

      return "62" + cleanPhone;
    };

    // Validasi duplikasi phone number
    const validatePhoneDuplication = (phoneNumber: string): boolean => {
      const newPhoneInDb = convertPhoneForDatabase(phoneNumber);

      if (editingAgent) {
        // Edit mode: cek duplikasi hanya jika phone berubah
        if (form.formState.dirtyFields.phoneNumber) {
          return agents.some(
            (agent) =>
              agent.id !== editingAgent.id && agent.phoneNumber === newPhoneInDb
          );
        }
        return false; // Phone tidak berubah, tidak perlu validasi
      } else {
        // Create mode: cek duplikasi dengan semua agents
        return agents.some((agent) => agent.phoneNumber === newPhoneInDb);
      }
    };

    // Build data untuk dikirim ke API
    const buildSubmissionData = (
      data: AgentFormSchemaType
    ): FormSubmissionData => {
      if (editingAgent) {
        // Edit mode: hanya kirim field yang dirty (berubah)
        const submissionData: FormSubmissionData = {};

        if (form.formState.dirtyFields.name) {
          submissionData.name = data.name;
        }

        if (form.formState.dirtyFields.phoneNumber) {
          submissionData.phoneNumber = convertPhoneForDatabase(
            data.phoneNumber
          );
        }

        if (form.formState.dirtyFields.isActive) {
          submissionData.isActive = data.isActive;
        }

        return submissionData;
      } else {
        // Create mode: kirim semua field
        return {
          name: data.name,
          phoneNumber: convertPhoneForDatabase(data.phoneNumber),
          isActive: data.isActive,
        };
      }
    };

    const onSubmit = async (data: AgentFormSchemaType): Promise<void> => {
      form.clearErrors();

      try {
        // Validasi duplikasi phone number
        if (validatePhoneDuplication(data.phoneNumber)) {
          form.setError("phoneNumber", {
            type: "manual",
            message: editingAgent
              ? "Nomor telepon sudah digunakan oleh agent lain"
              : "Nomor telepon sudah digunakan",
          });
          return;
        }

        const dataToSend = buildSubmissionData(data);

        if (editingAgent) {
          // Update agent
          await updateAgentMutation.mutateAsync({
            agentId: editingAgent.id,
            data: dataToSend,
          });
        } else {
          // Create agent
          await createAgentMutation.mutateAsync({
            name: data.name,
            phoneNumber: convertPhoneForDatabase(data.phoneNumber),
            isActive: data.isActive,
          });
        }

        onSuccess();
      } catch (error: unknown) {
        console.error("Error saving agent:", error);

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
                form.setError(detail.field as keyof AgentFormSchemaType, {
                  type: "server",
                  message: detail.message,
                });
              }
            }
          );
        } else {
          form.setError("root", {
            type: "server",
            message: (error as Error)?.message || "Gagal menyimpan agent",
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
          {/* Debug info untuk dirtyFields (development only) */}
          {process.env.NODE_ENV === "development" && editingAgent && (
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

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Nama Agent
                  {editingAgent && form.formState.dirtyFields.name && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Changed
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama agent" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Nomor Telepon
                  {editingAgent && form.formState.dirtyFields.phoneNumber && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Changed
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <div className="bg-gray-50 border-r border-gray-300 px-3 py-2 flex items-center justify-center min-w-[60px]">
                      <span className="text-sm font-medium text-gray-700">
                        +62
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="85713269167"
                      maxLength={13}
                      className="flex-1 px-3 py-2 text-sm border-0 outline-none bg-transparent"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  </div>
                </FormControl>
                <p className="text-xs text-gray-500">
                  Masukkan nomor tanpa 0 atau +62 (contoh: 85713269167)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* IsActive Field */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0 flex items-center gap-2">
                  Aktif
                  {editingAgent && form.formState.dirtyFields.isActive && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Changed
                    </span>
                  )}
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
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
                createAgentMutation.isPending ||
                updateAgentMutation.isPending
              }
            >
              {form.formState.isSubmitting ||
              createAgentMutation.isPending ||
              updateAgentMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingAgent ? "Memperbarui..." : "Membuat..."}
                </>
              ) : editingAgent ? (
                "Perbarui"
              ) : (
                "Buat Agent"
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
);

AgentForm.displayName = "AgentForm";
