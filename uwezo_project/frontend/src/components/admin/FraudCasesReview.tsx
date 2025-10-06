import { useState } from 'react';
import { 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Download,
  FileText,
  User,
  Calendar
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

// Mock fraud cases data
const mockFraudCases = [
  {
    id: 'fraud_001',
    verificationId: 'ver_002',
    userId: 'user_002',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    documentType: 'Bank Statement',
    country: 'Uganda',
    fraudScore: 85,
    riskLevel: 'high',
    flaggedAt: '2024-01-15T09:17:00Z',
    status: 'pending_review',
    flags: [
      {
        type: 'text_inconsistency',
        severity: 'high',
        description: 'Inconsistent font rendering in transaction amounts',
        confidence: 92
      },
      {
        type: 'image_manipulation',
        severity: 'high',
        description: 'Detected potential image editing artifacts',
        confidence: 88
      },
      {
        type: 'pattern_anomaly',
        severity: 'medium',
        description: 'Unusual spacing patterns in account numbers',
        confidence: 75
      }
    ],
    reviewNotes: '',
    reviewedBy: null,
    reviewedAt: null,
    decision: null,
    evidence: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
        description: 'Original document image'
      },
      {
        type: 'analysis',
        description: 'OCR confidence analysis showing inconsistencies'
      }
    ]
  },
  {
    id: 'fraud_002',
    verificationId: 'ver_005',
    userId: 'user_005',
    userName: 'Robert Kim',
    userEmail: 'robert@example.com',
    documentType: 'National ID',
    country: 'Kenya',
    fraudScore: 72,
    riskLevel: 'high',
    flaggedAt: '2024-01-15T11:30:00Z',
    status: 'under_review',
    flags: [
      {
        type: 'document_authenticity',
        severity: 'high',
        description: 'Security features not matching expected patterns',
        confidence: 89
      },
      {
        type: 'metadata_anomaly',
        severity: 'medium',
        description: 'File creation date inconsistent with document issue date',
        confidence: 67
      }
    ],
    reviewNotes: 'Reviewing security hologram patterns and cross-referencing with known authentic templates.',
    reviewedBy: 'admin@uwezo.ai',
    reviewedAt: '2024-01-15T12:00:00Z',
    decision: null,
    evidence: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
        description: 'ID document front view'
      }
    ]
  },
  {
    id: 'fraud_003',
    verificationId: 'ver_006',
    userId: 'user_006',
    userName: 'Lisa Chen',
    userEmail: 'lisa@example.com',
    documentType: 'Passport',
    country: 'Rwanda',
    fraudScore: 65,
    riskLevel: 'medium',
    flaggedAt: '2024-01-15T08:45:00Z',
    status: 'resolved',
    flags: [
      {
        type: 'text_quality',
        severity: 'medium',
        description: 'Poor image quality affecting OCR accuracy',
        confidence: 71
      }
    ],
    reviewNotes: 'Document verified as authentic. Poor image quality was due to scanning issues, not fraud.',
    reviewedBy: 'admin@uwezo.ai',
    reviewedAt: '2024-01-15T09:30:00Z',
    decision: 'approved',
    evidence: []
  }
];

export function FraudCasesReview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<string>('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="destructive">Pending Review</Badge>;
      case 'under_review':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="default" className="bg-green-100 text-green-800">Low Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredCases = mockFraudCases.filter(fraudCase => {
    const matchesSearch = 
      fraudCase.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fraudCase.status === statusFilter;
    const matchesRiskLevel = riskLevelFilter === 'all' || fraudCase.riskLevel === riskLevelFilter;
    
    return matchesSearch && matchesStatus && matchesRiskLevel;
  });

  const handleReviewDecision = (caseId: string, decision: string) => {
    console.log(`Review decision for case ${caseId}:`, decision);
    // Implement review decision logic here
  };

  const selectedCaseData = mockFraudCases.find(c => c.id === selectedCase);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Fraud Cases Review
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Cases
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search fraud cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cases List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {filteredCases.map((fraudCase) => (
                  <div 
                    key={fraudCase.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedCase === fraudCase.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCase(fraudCase.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&seed=${fraudCase.userId}`} />
                          <AvatarFallback>{fraudCase.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{fraudCase.userName}</h4>
                            {getStatusBadge(fraudCase.status)}
                            {getRiskLevelBadge(fraudCase.riskLevel)}
                          </div>
                          <p className="text-sm text-gray-600">{fraudCase.userEmail}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{fraudCase.documentType} • {fraudCase.country}</span>
                            <span>Fraud Score: {fraudCase.fraudScore}%</span>
                            <span>Flags: {fraudCase.flags.length}</span>
                            <span>Flagged: {new Date(fraudCase.flaggedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {fraudCase.status === 'under_review' && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Clock className="w-4 h-4 animate-pulse" />
                            <span className="text-sm">Under Review</span>
                          </div>
                        )}
                        
                        {fraudCase.status === 'pending_review' && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm">Needs Review</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Fraud Score Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Fraud Risk Score</span>
                        <span className="font-medium">{fraudCase.fraudScore}%</span>
                      </div>
                      <Progress 
                        value={fraudCase.fraudScore} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* Top Flags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {fraudCase.flags.slice(0, 2).map((flag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(flag.severity)}`}
                        >
                          {flag.type.replace('_', ' ')}
                        </Badge>
                      ))}
                      {fraudCase.flags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{fraudCase.flags.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredCases.length === 0 && (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No fraud cases found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Case Details Panel */}
            <div className="lg:col-span-1">
              {selectedCaseData ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Case Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Case Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Case ID:</span>
                        <span className="text-sm font-mono">{selectedCaseData.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">User:</span>
                        <span className="text-sm font-medium">{selectedCaseData.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Document:</span>
                        <span className="text-sm">{selectedCaseData.documentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Country:</span>
                        <span className="text-sm">{selectedCaseData.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Flagged:</span>
                        <span className="text-sm">{new Date(selectedCaseData.flaggedAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Flags Details */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900">Fraud Indicators</h4>
                      {selectedCaseData.flags.map((flag, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(flag.severity)}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium capitalize">
                              {flag.type.replace('_', ' ')}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {flag.confidence}%
                            </Badge>
                          </div>
                          <p className="text-xs opacity-75">{flag.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Review Actions */}
                    {selectedCaseData.status !== 'resolved' && (
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-900">Review Actions</h4>
                        
                        <Textarea
                          placeholder="Add review notes..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="text-sm"
                        />
                        
                        <Select value={selectedDecision} onValueChange={setSelectedDecision}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select decision" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approve">Approve (Authentic)</SelectItem>
                            <SelectItem value="reject">Reject (Fraudulent)</SelectItem>
                            <SelectItem value="request_more_info">Request More Information</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          onClick={() => handleReviewDecision(selectedCaseData.id, selectedDecision)}
                          disabled={!selectedDecision}
                          className="w-full"
                        >
                          {selectedDecision === 'approve' && <CheckCircle className="w-4 h-4 mr-2" />}
                          {selectedDecision === 'reject' && <XCircle className="w-4 h-4 mr-2" />}
                          Submit Review Decision
                        </Button>
                      </div>
                    )}
                    
                    {/* Previous Review Info */}
                    {selectedCaseData.status === 'resolved' && (
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Review History</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reviewed by:</span>
                            <span>{selectedCaseData.reviewedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reviewed at:</span>
                            <span>{new Date(selectedCaseData.reviewedAt!).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Decision:</span>
                            <Badge variant={selectedCaseData.decision === 'approved' ? 'default' : 'destructive'}>
                              {selectedCaseData.decision}
                            </Badge>
                          </div>
                          {selectedCaseData.reviewNotes && (
                            <div>
                              <span className="text-gray-600 block mb-1">Notes:</span>
                              <p className="text-xs bg-gray-50 p-2 rounded">{selectedCaseData.reviewNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Select a fraud case to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

