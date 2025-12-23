"use client";

import { useState } from "react";
import { Save, FolderOpen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTemplatesStore, type Template } from "@/lib/store/templates-store";
import { useToast } from "@/lib/hooks/use-toast";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TemplatesManagerProps {
  toolId: string;
  currentConfig: Record<string, any>;
  onLoadTemplate: (config: Record<string, any>) => void;
}

export function TemplatesManager({
  toolId,
  currentConfig,
  onLoadTemplate,
}: TemplatesManagerProps) {
  const { toast } = useToast();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  
  const templates = useTemplatesStore((state: any) => state.getTemplatesByTool(toolId));
  const saveTemplate = useTemplatesStore((state: any) => state.saveTemplate);
  const deleteTemplate = useTemplatesStore((state: any) => state.deleteTemplate);

  const handleSave = () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }

    saveTemplate(toolId, templateName.trim(), currentConfig);
    toast({
      title: "Template saved!",
      description: `Template "${templateName}" has been saved`,
    });
    setTemplateName("");
    setSaveDialogOpen(false);
  };

  const handleLoad = (template: Template) => {
    onLoadTemplate(template.config);
    toast({
      title: "Template loaded!",
      description: `Template "${template.name}" has been loaded`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteTemplate(id);
    toast({
      title: "Template deleted",
      description: `Template "${name}" has been deleted`,
    });
  };

  return (
    <div className="flex items-center gap-2">
      {templates.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-2" />
              Load Template ({templates.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {templates.map((template: Template) => (
              <div key={template.id} className="flex items-center justify-between p-2 hover:bg-accent rounded">
                <DropdownMenuItem
                  className="flex-1 cursor-pointer"
                  onClick={() => handleLoad(template)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(template.updatedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </DropdownMenuItem>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(template.id, template.name);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
            <DialogDescription>
              Save your current configuration as a template for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

