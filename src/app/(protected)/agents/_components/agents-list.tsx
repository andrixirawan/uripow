"use client";

import { useState } from "react";
import { Edit2, Trash2, Power, PowerOff, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useAgents, useDeleteAgent, useToggleAgentStatus } from "./use-agents";
import { AgentsListSkeleton } from "./agent-card-skeleton";
import { AgentsEmptyState } from "./agents-empty-state";
import { AgentsPagination } from "./agents-pagination";
import { AgentsSearch } from "./agents-search";
import { AgentWithRelationsType } from "@/types";

interface AgentsListProps {
  onEditAgent: (agent: AgentWithRelationsType) => void;
  onAddAgent: () => void;
}

export function AgentsList({ onEditAgent, onAddAgent }: AgentsListProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 10;

  // React Query hooks
  const { data, isLoading, error, refetch } = useAgents({
    page,
    limit,
    search,
  });
  const deleteAgentMutation = useDeleteAgent();
  const toggleStatusMutation = useToggleAgentStatus();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    setPage(1); // Reset to first page when searching
  };

  const handleDelete = async (agentId: string) => {
    try {
      await deleteAgentMutation.mutateAsync(agentId);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleToggleStatus = async (agentId: string) => {
    try {
      await toggleStatusMutation.mutateAsync(agentId);
    } catch {
      // Error is handled by the mutation
    }
  };

  const formatPhoneNumber = (phoneNumber: string): string => {
    if (phoneNumber.startsWith("62")) {
      return "+" + phoneNumber;
    }
    return phoneNumber;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <AgentsSearch onSearch={handleSearch} isLoading={true} />
        <AgentsListSkeleton count={limit} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <AgentsSearch onSearch={handleSearch} />
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Gagal memuat data
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {error.message || "Terjadi kesalahan saat memuat data agent"}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { agents, pagination } = data || { agents: [], pagination: null };

  // Empty state
  if (!agents || agents.length === 0) {
    return (
      <div className="space-y-6">
        <AgentsSearch onSearch={handleSearch} />
        <AgentsEmptyState onAddAgent={onAddAgent} hasSearch={!!search} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <AgentsSearch onSearch={handleSearch} />

      {/* Agents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{agent.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {formatDate(agent.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={agent.isActive ? "default" : "secondary"}
                  className={
                    agent.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {agent.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatPhoneNumber(agent.phoneNumber)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {agent._count?.clicks || 0} klik
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Groups:</span>
                    <span className="text-sm font-medium">
                      {agent.agentGroups?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(agent.id)}
                    disabled={toggleStatusMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    {agent.isActive ? (
                      <PowerOff className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditAgent(agent)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Agent</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus agent &quot;
                          {agent.name}&quot;? Tindakan ini tidak dapat
                          dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(agent.id)}
                          disabled={deleteAgentMutation.isPending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteAgentMutation.isPending
                            ? "Menghapus..."
                            : "Hapus"}
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

      {/* Pagination */}
      {pagination && (
        <AgentsPagination
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
