import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectsEmptyStateProps {
  onAddProject: () => void;
  hasSearch?: boolean;
}

export function ProjectsEmptyState({
  onAddProject,
  hasSearch = false,
}: ProjectsEmptyStateProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-gray-100 p-6">
            <FolderOpen className="h-12 w-12 text-gray-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {hasSearch ? "Tidak ada project ditemukan" : "Belum ada project"}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              {hasSearch
                ? "Coba ubah kata kunci pencarian atau hapus filter untuk melihat semua project."
                : "Mulai dengan membuat project pertama Anda untuk mengelola rotasi WhatsApp."}
            </p>
          </div>

          {!hasSearch && (
            <Button
              onClick={onAddProject}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Project Pertama
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
