import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Mock verification data
const mockVerifications = [
  {
    id: 'ver_001',
    userId: 'user_001',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    documentType: 'National ID',
    country: 'Kenya',
    status: 'completed',
    confidence: 95,
    fraudScore: 15,
    uploadedAt: '2024-01-15T10:30:00Z',
    processedAt: '2024-01-15T10:32:00Z',
    processingTime: 120000,
    fileSize: '2.3 MB',
    fileName: 'kenya_id_front.jpg',
    ocrText: 'REPUBLIC OF KENYA\nNATIONAL IDENTITY CARD\nJohn Doe\nID: 12345678\n...',
    extractedFields: {
      fullName: 'John Doe',
      idNumber: '12345678',
      dateOfBirth: '1990-01-15',
      gender: 'Male'
    }
  },
  {
    id: 'ver_002',
    userId: 'user_002',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    documentType: 'Bank Statement',
    country: 'Uganda',
    status: 'flagged',
    confidence: 45,
    fraudScore: 75,
    uploadedAt: '2024-01-15T09:15:00Z',
    processedAt: '2024-01-15T09:17:00Z',
    processingTime: 125000,
    fileSize: '1.8 MB',
    fileName: 'bank_statement_jan.pdf',
    ocrText: 'UGANDA COMMERCIAL BANK\nSTATEMENT OF ACCOUNT\n...',
    extractedFields: {
      bankName: 'Uganda Commercial Bank',
      accountNumber: '1234567890',
      statementPeriod: 'January 2024'
    }
  },
  {
    id: 'ver_003',
    userId: 'user_003',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    documentType: 'National ID',
    country: 'Tanzania',
    status: 'processing',
    confidence: 0,
    fraudScore: 0,
    uploadedAt: '2024-01-15T11:45:00Z',
    processedAt: null,
    processingTime: 0,
    fileSize: '3.1 MB',
    fileName: 'tanzania_id.pdf',
    ocrText: '',
    extractedFields: {}
  },
  {
    id: 'ver_004',
    userId: 'user_004',
    userName: 'Sarah Wilson',
    userEmail: 'sarah@example.com',
    documentType: 'Passport',
    country: 'Rwanda',
    status: 'completed',
    confidence: 88,
    fraudScore: 25,
    uploadedAt: '2024-01-15T08:20:00Z',
    processedAt: '2024-01-15T08:22:00Z',
    processingTime: 135000,
    fileSize: '2.7 MB',
    fileName: 'rwanda_passport.jpg',
    ocrText: 'REPUBLIC OF RWANDA\nPASSPORT\nSarah Wilson\n...',
    extractedFields: {
      fullName: 'Sarah Wilson',
      passportNumber: 'RW1234567',
      dateOfBirth: '1985-03-20',
      nationality: 'Rwandan'
    }
  }
];

export function VerificationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRiskLevel = (fraudScore: number) => {
    if (fraudScore >= 70) return { level: 'High', color: 'text-red-600 bg-red-50' };
    if (fraudScore >= 30) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-50' };
    return { level: 'Low', color: 'text-green-600 bg-green-50' };
  };

  const filteredVerifications = mockVerifications.filter(verification => {
    const matchesSearch = 
      verification.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;
    const matchesDocumentType = documentTypeFilter === 'all' || verification.documentType === documentTypeFilter;
    
    return matchesSearch && matchesStatus && matchesDocumentType;
  });

  const handleAction = (action: string, verificationId: string) => {
    console.log(`${action} verification:`, verificationId);
    // Implement verification actions here
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Verification Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
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
              placeholder="Search verifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="National ID">National ID</SelectItem>
              <SelectItem value="Passport">Passport</SelectItem>
              <SelectItem value="Bank Statement">Bank Statement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredVerifications.map((verification) => {
            const riskLevel = getRiskLevel(verification.fraudScore);
            
            return (
              <div key={verification.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&seed=${verification.userId}`} />
                      <AvatarFallback>{verification.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{verification.userName}</h4>
                        {getStatusBadge(verification.status)}
                        <Badge variant="outline" className={riskLevel.color}>
                          {riskLevel.level} Risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{verification.userEmail}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{verification.documentType} • {verification.country}</span>
                        <span>Confidence: {verification.confidence}%</span>
                        <span>Fraud Score: {verification.fraudScore}%</span>
                        <span>Uploaded: {new Date(verification.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {verification.status === 'processing' && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span className="text-sm">Processing...</span>
                      </div>
                    )}
                    
                    {verification.status === 'flagged' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">Requires Review</span>
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('view', verification.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('download', verification.id)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('approve', verification.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('reject', verification.id)}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction('delete', verification.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Additional Details */}
                {verification.status === 'completed' && (
                  <div className="mt-3 pt-3 border-t grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">File:</span>
                      <p className="font-medium">{verification.fileName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Size:</span>
                      <p className="font-medium">{verification.fileSize}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Processing Time:</span>
                      <p className="font-medium">{(verification.processingTime / 1000).toFixed(1)}s</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Fields Extracted:</span>
                      <p className="font-medium">{Object.keys(verification.extractedFields).length}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredVerifications.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No verifications found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

