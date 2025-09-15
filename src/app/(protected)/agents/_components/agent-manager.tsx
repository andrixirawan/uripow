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
import { AgentForm, AgentFormRef } from "./agent-form";
import { AgentsList } from "./agents-list";
import { AgentWithRelationsType } from "@/types";

export function AgentManager() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAgent, setEditingAgent] =
    useState<AgentWithRelationsType | null>(null);
  const formRef = useRef<AgentFormRef>(null);

  const resetForm = () => {
    formRef.current?.resetForm();
    setEditingAgent(null);
  };

  const handleEdit = (agent: AgentWithRelationsType) => {
    setEditingAgent(agent);
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
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">
            Kelola agent WhatsApp untuk rotasi otomatis
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAgent ? "Edit Agent" : "Add New Agent"}
              </DialogTitle>
            </DialogHeader>

            <AgentForm
              ref={formRef}
              editingAgent={editingAgent}
              agents={[]} // Empty array since we're using React Query now
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AgentsList
        onEditAgent={handleEdit}
        onAddAgent={() => setIsAddOpen(true)}
      />
    </div>
  );
}
