"use client";

import { useState } from "react";
import { Edit2, Trash2, Power, PowerOff, Users, Copy } from "lucide-react";
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
import { useGroups, useDeleteGroup, useToggleGroupStatus } from "./use-groups";
import { ProjectsListSkeleton } from "./project-card-skeleton";
import { ProjectsEmptyState } from "./projects-empty-state";
import { ProjectsPagination } from "./projects-pagination";
import { ProjectsSearch } from "./projects-search";
import { GroupWithRelationsType } from "@/types";

interface ProjectsListProps {
  onEditProject: (project: GroupWithRelationsType) => void;
  onAddProject: () => void;
}

export function ProjectsList({
  onEditProject,
  onAddProject,
}: ProjectsListProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 10;

  // React Query hooks
  const { data, isLoading, error, refetch } = useGroups({
    page,
    limit,
    search,
  });
  const deleteGroupMutation = useDeleteGroup();
  const toggleStatusMutation = useToggleGroupStatus();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    setPage(1); // Reset to first page when searching
  };

  const handleDelete = async (groupId: string) => {
    try {
      await deleteGroupMutation.mutateAsync(groupId);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleToggleStatus = async (groupId: string) => {
    try {
      await toggleStatusMutation.mutateAsync(groupId);
    } catch {
      // Error is handled by the mutation
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ProjectsSearch onSearch={handleSearch} isLoading={true} />
        <ProjectsListSkeleton count={limit} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <ProjectsSearch onSearch={handleSearch} />
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Gagal memuat data
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {error.message || "Terjadi kesalahan saat memuat data project"}
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

  const { groups, pagination } = data || { groups: [], pagination: null };

  // Empty state
  if (!groups || groups.length === 0) {
    return (
      <div className="space-y-6">
        <ProjectsSearch onSearch={handleSearch} />
        <ProjectsEmptyState onAddProject={onAddProject} hasSearch={!!search} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <ProjectsSearch onSearch={handleSearch} />

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{group.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {formatDate(group.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={group.isActive ? "default" : "secondary"}
                  className={
                    group.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {group.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Slug:</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {group.slug}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(group.slug)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Strategy:</span>
                    <span className="text-sm font-medium capitalize">
                      {group.strategy}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {group._count?.clicks || 0} klik
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Agents:</span>
                    <span className="text-sm font-medium">
                      {group.agentGroups?.length || 0}
                    </span>
                  </div>
                </div>

                {group.description && (
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {group.description}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(group.id)}
                    disabled={toggleStatusMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    {group.isActive ? (
                      <PowerOff className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProject(group)}
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
                        <AlertDialogTitle>Hapus Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus project &quot;
                          {group.name}&quot;? Tindakan ini tidak dapat
                          dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(group.id)}
                          disabled={deleteGroupMutation.isPending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteGroupMutation.isPending
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
        <ProjectsPagination
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
