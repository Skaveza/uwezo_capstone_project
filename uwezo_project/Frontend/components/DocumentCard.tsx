import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useState } from "react";
import { cn } from "./ui/utils";

interface DocumentCardProps {
  id: string;
  name: string;
  status: "processing" | "completed" | "failed";
  confidence?: number;
  processingTime?: string;
  uploadDate: string;
  extractedData?: Record<string, any>;
}

export function DocumentCard({
  id,
  name,
  status,
  confidence,
  processingTime,
  uploadDate,
  extractedData,
}: DocumentCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Document Icon/Thumbnail */}
          <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="truncate">{name}</h4>
                <p className="text-sm text-muted-foreground">ID: {id}</p>
              </div>
              <Badge className={cn("capitalize", getStatusColor())}>
                {status}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {confidence !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <Progress value={confidence} className="h-2" />
                    <span className="text-sm">{confidence}%</span>
                  </div>
                </div>
              )}
              {processingTime && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Processing Time</p>
                  <p className="text-sm">{processingTime}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Upload Date</p>
                <p className="text-sm">{uploadDate}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              {status === "completed" && (
                <Button size="sm" variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              )}
              {extractedData && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpanded(!expanded)}
                  className="gap-2"
                >
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {expanded ? "Hide" : "View"} Extracted Data
                </Button>
              )}
            </div>

            {/* Extracted Data */}
            {expanded && extractedData && (
              <div className="mt-4 p-4 bg-accent rounded-lg">
                <p className="text-sm mb-2">Extracted OCR Data:</p>
                <pre className="text-xs overflow-auto bg-background p-3 rounded border">
                  {JSON.stringify(extractedData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
