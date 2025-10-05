import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface FraudScoreVisualizationProps {
  score: number;
  status: 'low' | 'medium' | 'high';
  details?: {
    documentAuthenticity: number;
    textConsistency: number;
    imageQuality: number;
    patternMatching: number;
  };
}

export function FraudScoreVisualization({ score, status, details }: FraudScoreVisualizationProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />;
      case 'high':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Medium Risk';
      case 'high':
        return 'High Risk';
      default:
        return 'Unknown Risk';
    }
  };

  const getProgressColor = (score: number) => {
    if (score <= 30) return 'bg-green-500';
    if (score <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Fraud Risk Assessment
          <div className={`p-1 rounded-full border ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Risk Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Overall Risk Score</span>
            <span className={`text-lg font-bold ${getStatusColor(status).split(' ')[0]}`}>
              {score}%
            </span>
          </div>
          <div className="relative">
            <Progress value={score} className="h-3" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow-sm">
                {getStatusText(status)}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Meter */}
        <div className="relative">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Low Risk</span>
            <span>Medium Risk</span>
            <span>High Risk</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(score)} transition-all duration-500`}
              style={{ width: `${score}%` }}
            />
            <div 
              className="absolute top-0 w-1 h-2 bg-gray-800 rounded-full transform -translate-x-1/2"
              style={{ left: `${score}%` }}
            />
          </div>
        </div>

        {/* Detailed Breakdown */}
        {details && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700">Risk Factors Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Document Authenticity</span>
                <span className="text-xs font-medium">{details.documentAuthenticity}%</span>
              </div>
              <Progress value={details.documentAuthenticity} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Text Consistency</span>
                <span className="text-xs font-medium">{details.textConsistency}%</span>
              </div>
              <Progress value={details.textConsistency} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Image Quality</span>
                <span className="text-xs font-medium">{details.imageQuality}%</span>
              </div>
              <Progress value={details.imageQuality} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Pattern Matching</span>
                <span className="text-xs font-medium">{details.patternMatching}%</span>
              </div>
              <Progress value={details.patternMatching} className="h-1" />
            </div>
          </div>
        )}

        {/* Risk Assessment Summary */}
        <div className={`p-3 rounded-lg border ${getStatusColor(status)}`}>
          <div className="flex items-start gap-2">
            {getStatusIcon(status)}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {getStatusText(status)} - {score}%
              </p>
              <p className="text-xs opacity-75 mt-1">
                {status === 'low' && 'Document appears authentic with minimal risk indicators.'}
                {status === 'medium' && 'Document shows some concerning patterns that require review.'}
                {status === 'high' && 'Document displays multiple fraud indicators and requires immediate attention.'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
