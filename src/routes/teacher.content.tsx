import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileText, Film, Package, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/RoleShell";
import { CONTENT_ITEMS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/teacher/content")({
  head: () => ({ meta: [{ title: "Content Management · KCG University" }] }),
  component: ContentMgmt,
});

const COLUMNS = ["Draft", "Review", "Published"] as const;

function typeIcon(t: string) {
  if (t === "PDF") return FileText;
  if (t === "Video") return Film;
  if (t === "PPT") return Presentation;
  return Package;
}

function ContentMgmt() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        subtitle="Upload, review and publish PDFs, slides, videos and SCORM packages"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" /> Upload content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload course content</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input placeholder="e.g. DS · Unit 4 Lecture Slides" />
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["PDF", "PPT", "Video", "SCORM"].map((t) => (
                      <button
                        key={t}
                        className="rounded-md border bg-background px-2 py-3 text-xs font-medium hover:border-primary"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
                  <Upload className="h-6 w-6 mx-auto mb-2" />
                  Drag & drop or click to upload
                </div>
                <Button className="w-full" onClick={() => setOpen(false)}>
                  Save as Draft
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = CONTENT_ITEMS.filter((c) => c.status === col);
          return (
            <div key={col} className="rounded-xl border bg-muted/30 p-3">
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      col === "Draft" && "bg-muted-foreground",
                      col === "Review" && "bg-warning",
                      col === "Published" && "bg-success",
                    )}
                  />
                  <h3 className="font-semibold text-sm">{col}</h3>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {items.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {items.map((c) => {
                  const Icon = typeIcon(c.type);
                  return (
                    <div key={c.id} className="rounded-lg bg-card border p-3 shadow-sm">
                      <div className="flex items-start gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium leading-tight">{c.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {c.type} · Updated {c.updated}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {col === "Draft" && (
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Send for Review
                          </Button>
                        )}
                        {col === "Review" && (
                          <Button size="sm" className="text-xs h-7">
                            Approve & Publish
                          </Button>
                        )}
                        {col === "Published" && (
                          <Badge className="bg-success/15 text-success border-0 text-[10px]">
                            ● Live
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
