"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { AgentType, CreateAgentType, UpdateAgentType } from "@/types";

/**
 * Custom hook untuk manage agents
 * Menggunakan API client yang sudah dikonfigurasi
 */

export function useAgents() {
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch agents
  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.agents.getAll();

      if (response.success && response.data) {
        setAgents(response.data);
      } else {
        setError(response.error || "Failed to fetch agents");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error fetching agents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create agent
  const createAgent = async (data: CreateAgentType) => {
    try {
      setError(null);

      const response = await api.agents.create(data);

      if (response.success && response.data) {
        setAgents((prev) => [response.data!, ...prev]);
        return { success: true, data: response.data };
      } else {
        setError(response.error || "Failed to create agent");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Network error occurred";
      setError(errorMsg);
      console.error("Error creating agent:", err);
      return { success: false, error: errorMsg };
    }
  };

  // Update agent
  const updateAgent = async (id: string, data: UpdateAgentType) => {
    try {
      setError(null);

      const response = await api.agents.update(id, data);

      if (response.success && response.data) {
        setAgents((prev) =>
          prev.map((agent) => (agent.id === id ? response.data! : agent))
        );
        return { success: true, data: response.data };
      } else {
        setError(response.error || "Failed to update agent");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Network error occurred";
      setError(errorMsg);
      console.error("Error updating agent:", err);
      return { success: false, error: errorMsg };
    }
  };

  // Delete agent
  const deleteAgent = async (id: string) => {
    try {
      setError(null);

      const response = await api.agents.delete(id);

      if (response.success) {
        setAgents((prev) => prev.filter((agent) => agent.id !== id));
        return { success: true };
      } else {
        setError(response.error || "Failed to delete agent");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Network error occurred";
      setError(errorMsg);
      console.error("Error deleting agent:", err);
      return { success: false, error: errorMsg };
    }
  };

  // Toggle agent status
  const toggleAgentStatus = async (id: string) => {
    try {
      setError(null);

      const response = await api.agents.toggleStatus(id);

      if (response.success && response.data) {
        setAgents((prev) =>
          prev.map((agent) => (agent.id === id ? response.data! : agent))
        );
        return { success: true, data: response.data };
      } else {
        setError(response.error || "Failed to toggle agent status");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = "Network error occurred";
      setError(errorMsg);
      console.error("Error toggling agent status:", err);
      return { success: false, error: errorMsg };
    }
  };

  // Fetch agents on mount
  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    loading,
    error,
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
  };
}
