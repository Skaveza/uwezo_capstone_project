import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Download, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export function CertificateDownload() {
  const { state } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const latestResult = state.processingResults[state.processingResults.length - 1];

  const handleDownloadCertificate = async () => {
    if (!latestResult || latestResult.status !== 'completed') {
      return;
    }

    setIsGenerating(true);
    
    // Simulate certificate generation
    setTimeout(() => {
      // Create a mock certificate content
      const certificateData = {
        documentId: latestResult.id,
        timestamp: new Date().toISOString(),
        verificationStatus: latestResult.confidence > 70 ? 'VERIFIED' : 'REQUIRES_REVIEW',
        confidence: latestResult.confidence,
        documentType: latestResult.documentType,
        country: latestResult.country,
        processingTime: latestResult.processingTime,
        fraudScore: latestResult.fraudScore || 0,
        extractedFields: latestResult.extractedFields || {},
        ocrText: latestResult.ocrText
      };

      // Create and download the certificate
      const blob = new Blob([JSON.stringify(certificateData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `verification_certificate_${latestResult.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsGenerating(false);
    }, 2000);
  };

  const canDownload = latestResult && 
    latestResult.status === 'completed' && 
    latestResult.confidence > 0;

  const getVerificationStatus = () => {
    if (!latestResult) return 'Unknown';
    if (latestResult.confidence >= 90) return 'Fully Verified';
    if (latestResult.confidence >= 70) return 'Partially Verified';
    return 'Requires Review';
  };

  const getStatusColor = () => {
    if (!latestResult) return 'text-gray-600';
    if (latestResult.confidence >= 90) return 'text-green-600';
    if (latestResult.confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Verification Certificate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!latestResult ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No verification results available</p>
            <p className="text-sm text-gray-500 mt-1">
              Process a document to generate a verification certificate
            </p>
          </div>
        ) : (
          <>
            {/* Verification Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full">
                  {latestResult.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getVerificationStatus()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Confidence: {latestResult.confidence}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Document ID</p>
                <p className="font-mono text-sm">{latestResult.id}</p>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Document Type</p>
                <p className="font-medium">{latestResult.documentType || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-600">Country</p>
                <p className="font-medium">{latestResult.country || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-600">Processing Time</p>
                <p className="font-medium">{latestResult.processingTime}ms</p>
              </div>
              <div>
                <p className="text-gray-600">Fields Detected</p>
                <p className="font-medium">
                  {latestResult.fieldsDetected || 0} / {latestResult.totalFields || 0}
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="pt-4 border-t">
              <Button 
                onClick={handleDownloadCertificate}
                disabled={!canDownload || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Certificate...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Verification Certificate
                  </>
                )}
              </Button>
              
              {!canDownload && latestResult && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Complete document processing to download certificate
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
