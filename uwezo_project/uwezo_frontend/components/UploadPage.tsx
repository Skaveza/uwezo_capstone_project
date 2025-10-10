import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "uploading" | "processing" | "completed" | "failed";
  progress: number;
}

export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: "1", name: "passport_scan_001.pdf", size: "2.4 MB", status: "completed", progress: 100 },
    { id: "2", name: "id_card_front.jpg", size: "1.8 MB", status: "processing", progress: 65 },
    { id: "3", name: "driver_license.pdf", size: "3.1 MB", status: "uploading", progress: 30 },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file selection
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "completed":
        return <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>;
      case "failed":
        return <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✕</div>;
    }
  };

  const getStatusColor = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case "uploading":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Upload Documents</h1>
        <p className="text-muted-foreground mt-1">Upload documents for verification and processing</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
              isDragging 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                : "border-border hover:border-blue-400"
            )}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3>Drag and drop files here</h3>
                <p className="text-muted-foreground mt-1">or click to browse</p>
              </div>
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload">
                <Button type="button" className="cursor-pointer">
                  Browse Files
                </Button>
              </label>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, JPG, PNG (Max 10MB per file)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div>
          <h3 className="mb-4">Uploaded Files ({files.length})</h3>
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="truncate">{file.name}</p>
                        <Badge className={cn("capitalize text-xs", getStatusColor(file.status))}>
                          {file.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{file.size}</p>
                      
                      {/* Progress Bar */}
                      {(file.status === "uploading" || file.status === "processing") && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{file.progress}%</p>
                        </div>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
