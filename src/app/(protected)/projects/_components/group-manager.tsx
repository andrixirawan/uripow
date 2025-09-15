"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectsList } from "./projects-list";
import { GroupForm, GroupFormRef } from "./group-form";
import { GroupWithRelationsType } from "@/types";

export function GroupManager() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGroup, setEditingGroup] =
    useState<GroupWithRelationsType | null>(null);
  const formRef = useRef<GroupFormRef>(null);

  const resetForm = () => {
    formRef.current?.resetForm();
    setEditingGroup(null);
  };

  const handleEdit = (group: GroupWithRelationsType) => {
    setEditingGroup(group);
    setIsAddOpen(true);
  };

  const handleFormSuccess = () => {
    setIsAddOpen(false);
    resetForm();
  };

  const handleFormCancel = () => {
    setIsAddOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Kelola project WhatsApp untuk rotasi otomatis
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>

            <GroupForm
              ref={formRef}
              editingGroup={editingGroup}
              groups={[]} // Empty array since we're using React Query now
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProjectsList
        onEditProject={handleEdit}
        onAddProject={() => setIsAddOpen(true)}
      />
    </div>
  );
}
