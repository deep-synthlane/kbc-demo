import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileText, Film, Package, Presentation, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/RoleShell";
import { CONTENT_ITEMS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/content")({
  head: () => ({ meta: [{ title: "Content Management · KCG" }] }),
  component: ContentMgmt,
});

const COLUMNS = ["Draft", "Review", "Published"] as const;

const VERSION_HISTORY = [
  { version: "v1.0", date: "10 Jun", author: "Dr. Priya", note: "Initial upload" },
  { version: "v2.0", date: "15 Jun", author: "Dr. Priya", note: "Updated diagrams" },
  { version: "v2.1", date: "18 Jun", author: "Dr. Priya", note: "Fixed typo in slide 12" },
];

function typeIcon(t: string) {
  if (t === "PDF") return FileText;
  if (t === "Video") return Film;
  if (t === "PPT") return Presentation;
  return Package;
}

function ContentMgmt() {
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [items, setItems] = useState(CONTENT_ITEMS.map((c) => ({ ...c })));

  function moveItem(id: string, toStatus: string) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status: toStatus } : c)));
    toast(toStatus === "Review" ? "Sent for admin review" : "Content published");
  }

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
          const colItems = items.filter((c) => c.status === col);
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
                  {colItems.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {colItems.map((c) => {
                  const Icon = typeIcon(c.type);
                  return (
                    <div key={c.id} className="rounded-lg bg-card border p-3 shadow-sm">
                      <div className="flex items-start gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium leading-tight">{c.title}</span>
                            <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                              {c.version}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {c.type} · Updated {c.updated}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {col === "Draft" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            onClick={() => moveItem(c.id, "Review")}
                          >
                            Send for Review
                          </Button>
                        )}
                        {col === "Review" && (
                          <Button
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => moveItem(c.id, "Published")}
                          >
                            Approve & Publish
                          </Button>
                        )}
                        {col === "Published" && (
                          <Badge className="bg-success/15 text-success border-0 text-[10px]">
                            ● Live
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 ml-auto"
                          onClick={() => setHistoryOpen(true)}
                        >
                          <History className="h-3 w-3 mr-1" /> History
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Change Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VERSION_HISTORY.map((v) => (
                <TableRow key={v.version}>
                  <TableCell className="font-mono text-xs">{v.version}</TableCell>
                  <TableCell className="text-muted-foreground">{v.date}</TableCell>
                  <TableCell>{v.author}</TableCell>
                  <TableCell>{v.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
