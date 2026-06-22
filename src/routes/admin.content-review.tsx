import { createFileRoute } from "@tanstack/react-router";
import { FileText, Film, Presentation, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/RoleShell";
import { CONTENT_ITEMS } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/content-review")({
  head: () => ({ meta: [{ title: "Content Review · Admin · KCG" }] }),
  component: ContentReview,
});

function typeIcon(t: string) {
  if (t === "PDF") return FileText;
  if (t === "Video") return Film;
  if (t === "PPT") return Presentation;
  return Package;
}

function ContentReview() {
  const reviewItems = CONTENT_ITEMS.filter((c) => c.status === "Review");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Review & Approval"
        subtitle="Review faculty-submitted content before publishing"
      />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviewItems.map((c) => {
              const Icon = typeIcon(c.type);
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{c.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{c.type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{c.version}</TableCell>
                  <TableCell className="text-muted-foreground">{c.updated}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success border-success/40"
                        onClick={() => toast("Approved — content is now published")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-warning-foreground border-warning/40"
                        onClick={() => toast("Feedback sent to faculty")}
                      >
                        Request Changes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {reviewItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No content pending review.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
