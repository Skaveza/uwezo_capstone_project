import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "../contexts/AppContext";
import { FileText, Loader2 } from "lucide-react";

export function ResultsPanel() {
  const { state } = useApp();
  const latestResult = state.processingResults[state.processingResults.length - 1];

  if (!latestResult) {
    return (
      <Card className="mb-6">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-600">
            Upload and process a document to see the results here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusFromResult = (result: typeof latestResult) => {
    if (result.status === 'processing') return 'processing';
    if (result.status === 'completed' && result.confidence > 90) return 'verified';
    if (result.status === 'completed' && result.confidence > 70) return 'warning';
    return 'error';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Original Document</CardTitle>
            <StatusIndicator status={getStatusFromResult(latestResult)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
            {latestResult.status === 'processing' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Processing...</p>
                </div>
              </div>
            ) : (
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop"
                alt="Uploaded Document"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span className="capitalize">{latestResult.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing time:</span>
              <span>{latestResult.processingTime}ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Confidence:</span>
              <span className={`font-medium ${getConfidenceColor(latestResult.confidence)}`}>
                {latestResult.confidence}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted OCR Text</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
            {latestResult.status === 'processing' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Extracting text...</p>
                </div>
              </div>
            ) : (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                {latestResult.ocrText || 'No text extracted'}
              </pre>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Document Type:</span>
              <p className="font-medium">{latestResult.documentType || 'Detecting...'}</p>
            </div>
            <div>
              <span className="text-gray-600">Country:</span>
              <p className="font-medium">{latestResult.country || 'Unknown'}</p>
            </div>
            <div>
              <span className="text-gray-600">Fields Detected:</span>
              <p className="font-medium">
                {latestResult.fieldsDetected} of {latestResult.totalFields}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Validation:</span>
              <p className={`font-medium ${
                latestResult.status === 'completed' 
                  ? 'text-green-600' 
                  : latestResult.status === 'failed'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                {latestResult.status === 'completed' ? 'Passed' : 
                 latestResult.status === 'failed' ? 'Failed' : 'Processing'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}