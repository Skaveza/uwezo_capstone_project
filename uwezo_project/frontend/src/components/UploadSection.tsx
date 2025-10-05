import { useState } from "react";
import { Upload, FileText, CreditCard, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useApp } from "../contexts/AppContext";
import { processDocumentWithUpdates } from "../services/mockApi";

export function UploadSection() {
  const { state, dispatch } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<File | null>(null);

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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (file.size > maxSize) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `notif_${Date.now()}`,
          type: 'error',
          message: 'File size must be less than 10MB',
          timestamp: Date.now()
        }
      });
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `notif_${Date.now()}`,
          type: 'error',
          message: 'Only PDF, JPG, and PNG files are allowed',
          timestamp: Date.now()
        }
      });
      return;
    }

    setCurrentUpload(file);
    
    // Add file to uploaded files
    const uploadedFile = {
      file,
      id: `file_${Date.now()}`,
      timestamp: Date.now()
    };
    
    dispatch({ type: 'ADD_UPLOADED_FILE', payload: uploadedFile });
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Process document with real-time updates
      await processDocumentWithUpdates(file, (updates) => {
        if (updates.id) {
          dispatch({ type: 'ADD_PROCESSING_RESULT', payload: updates as any });
        } else {
          // Update existing result
          const existingResults = state.processingResults;
          const latestResult = existingResults[existingResults.length - 1];
          if (latestResult) {
            dispatch({
              type: 'UPDATE_PROCESSING_RESULT',
              payload: { id: latestResult.id, updates }
            });
          }
        }
      });
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `notif_${Date.now()}`,
          type: 'success',
          message: 'Document processed successfully!',
          timestamp: Date.now()
        }
      });
      
      // Navigate to results page
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 'results' });
      
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `notif_${Date.now()}`,
          type: 'error',
          message: 'Failed to process document. Please try again.',
          timestamp: Date.now()
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      setCurrentUpload(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : currentUpload
              ? "border-green-400 bg-green-50"
              : state.isLoading
              ? "border-yellow-400 bg-yellow-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {state.isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Processing document...</p>
                <p className="text-sm text-gray-500">
                  Analyzing and extracting information
                </p>
              </div>
            </div>
          ) : currentUpload ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <FileText className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUpload.name}</p>
                <p className="text-sm text-gray-500">
                  {(currentUpload.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your document here, or{" "}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports IDs, Bank Statements (PDF, JPG, PNG up to 10MB)
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm">ID Cards</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">Bank Statements</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {state.uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Uploads</h3>
            <div className="space-y-2">
              {state.uploadedFiles.slice(-3).map((uploadedFile) => (
                <div key={uploadedFile.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(uploadedFile.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}