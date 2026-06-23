import { useRef, useState, useEffect, type DragEvent } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lesson } from "@/lib/courseStore";
import {
  MATERIAL_CONFIG,
  type MaterialKind,
  fileMatchesMaterial,
  formatFileSize,
  inferDuration,
  simulateUpload,
} from "@/lib/materialUpload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type UnitOption = { id: string; title: string };

type UploadMaterialDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  units: UnitOption[];
  defaultUnitId?: string;
  onComplete: (unitId: string, lesson: Omit<Lesson, "id" | "done">) => void;
};

export function UploadMaterialDialog({
  open,
  onOpenChange,
  units,
  defaultUnitId,
  onComplete,
}: UploadMaterialDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [unitId, setUnitId] = useState(defaultUnitId ?? units[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [materialKind, setMaterialKind] = useState<MaterialKind>("PDF");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (open) {
      setUnitId(defaultUnitId ?? units[0]?.id ?? "");
    }
  }, [open, defaultUnitId, units]);

  function resetForm() {
    setUnitId(defaultUnitId ?? units[0]?.id ?? "");
    setTitle("");
    setMaterialKind("PDF");
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    setDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v);
    if (!v) resetForm();
  }

  function handleFileSelect(file: File | null) {
    if (!file) return;
    if (!fileMatchesMaterial(file, materialKind)) {
      toast.error(`Invalid file. Please upload a valid ${materialKind} file.`);
      return;
    }
    setSelectedFile(file);
    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0] ?? null);
  }

  async function handleUpload() {
    if (!unitId) {
      toast.error("Please select a unit");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      await simulateUpload(setUploadProgress);

      const cfg = MATERIAL_CONFIG[materialKind];
      const fileUrl = URL.createObjectURL(selectedFile);

      onComplete(unitId, {
        title: title.trim(),
        type: cfg.lessonType,
        duration: inferDuration(materialKind, selectedFile),
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        fileUrl,
      });

      toast.success(`${materialKind} uploaded successfully`);
      handleOpenChange(false);
    } catch {
      toast.error("Upload failed. Please try again.");
      setUploading(false);
      setUploadProgress(0);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Study Material</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Unit *</Label>
            <Select value={unitId} onValueChange={setUnitId} disabled={uploading || units.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {units.length === 0 && (
              <p className="text-xs text-destructive">Add a unit first before uploading materials.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Material Type *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(MATERIAL_CONFIG) as MaterialKind[]).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setMaterialKind(kind);
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className={cn(
                    "rounded-md border px-2 py-2.5 text-xs font-medium transition",
                    materialKind === kind
                      ? "border-primary bg-primary/10 text-primary"
                      : "bg-background hover:border-primary/50",
                  )}
                >
                  {kind}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="material-title">Title *</Label>
            <Input
              id="material-title"
              placeholder="e.g. Unit 2 Lecture Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            className={cn(
              "rounded-lg border-2 border-dashed p-8 text-center text-sm transition cursor-pointer",
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            {selectedFile ? (
              <>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(selectedFile.size)} · Click to replace
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {MATERIAL_CONFIG[materialKind].extensions.join(", ")}
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={MATERIAL_CONFIG[materialKind].accept}
              disabled={uploading}
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button className="w-full" disabled={uploading || units.length === 0} onClick={handleUpload}>
            {uploading ? "Uploading…" : "Upload Material"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
