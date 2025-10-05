import { useState } from 'react';
import { 
  Download, 
  FileText, 
  Database, 
  Settings, 
  Calendar,
  Filter,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';

// Mock log data
const mockSystemLogs = [
  {
    id: 'log_001',
    timestamp: '2024-01-15T14:30:00Z',
    level: 'info',
    category: 'authentication',
    message: 'User login successful',
    userId: 'user_001',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    sessionId: 'sess_abc123',
    metadata: {
      loginMethod: 'email',
      twoFactorEnabled: true,
      deviceType: 'desktop'
    }
  },
  {
    id: 'log_002',
    timestamp: '2024-01-15T14:28:45Z',
    level: 'warning',
    category: 'document_processing',
    message: 'Low confidence OCR result detected',
    userId: 'user_002',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
    sessionId: 'sess_def456',
    metadata: {
      documentType: 'bank_statement',
      confidence: 45,
      processingTime: 2500,
      fileSize: '2.3MB'
    }
  },
  {
    id: 'log_003',
    timestamp: '2024-01-15T14:25:12Z',
    level: 'error',
    category: 'api',
    message: 'Rate limit exceeded for user',
    userId: 'user_003',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    sessionId: 'sess_ghi789',
    metadata: {
      endpoint: '/api/v1/documents/upload',
      requestCount: 150,
      limit: 100,
      timeWindow: '1h'
    }
  },
  {
    id: 'log_004',
    timestamp: '2024-01-15T14:20:33Z',
    level: 'info',
    category: 'system',
    message: 'Scheduled backup completed successfully',
    userId: null,
    ipAddress: null,
    userAgent: null,
    sessionId: null,
    metadata: {
      backupSize: '45.2GB',
      duration: '12m 34s',
      destination: 's3://uwezo-backups',
      compressionRatio: '0.65'
    }
  },
  {
    id: 'log_005',
    timestamp: '2024-01-15T14:15:00Z',
    level: 'info',
    category: 'document_processing',
    message: 'Document verification completed',
    userId: 'user_004',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    sessionId: 'sess_jkl012',
    metadata: {
      documentType: 'national_id',
      verificationStatus: 'verified',
      confidence: 95,
      processingTime: 1200,
      fraudScore: 12
    }
  }
];

const mockMetrics = {
  systemHealth: {
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 34,
    networkLatency: 23,
    uptime: '99.9%',
    activeConnections: 1247,
    queueSize: 23,
    errorRate: 0.12
  },
  performanceMetrics: {
    avgResponseTime: 145,
    p95ResponseTime: 340,
    throughput: 1250,
    successRate: 99.88,
    cacheHitRate: 87.5,
    databaseConnections: 45,
    apiCallsPerMinute: 2340
  },
  securityMetrics: {
    failedLoginAttempts: 12,
    blockedIPs: 3,
    suspiciousActivities: 2,
    sslCertificatesExpiry: '30 days',
    lastSecurityScan: '2024-01-14T02:00:00Z',
    vulnerabilitiesDetected: 0
  }
};

export function LogsAndMetrics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'info':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredLogs = mockSystemLogs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const handleLogSelection = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLogs([...selectedLogs, logId]);
    } else {
      setSelectedLogs(selectedLogs.filter(id => id !== logId));
    }
  };

  const handleSelectAllLogs = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(filteredLogs.map(log => log.id));
    } else {
      setSelectedLogs([]);
    }
  };

  const handleDownloadLogs = (format: string) => {
    const selectedLogData = mockSystemLogs.filter(log => selectedLogs.includes(log.id));
    const dataStr = JSON.stringify(selectedLogData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMetrics = () => {
    const metricsData = {
      timestamp: new Date().toISOString(),
      systemHealth: mockMetrics.systemHealth,
      performanceMetrics: mockMetrics.performanceMetrics,
      securityMetrics: mockMetrics.securityMetrics
    };
    
    const dataStr = JSON.stringify(metricsData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_metrics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Logs & System Metrics</h2>
          <p className="text-gray-600 mt-1">Monitor system logs and download system metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadMetrics}>
            <Download className="w-4 h-4 mr-2" />
            Download Metrics
          </Button>
        </div>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Uptime</p>
                <p className="text-2xl font-semibold text-green-600">
                  {mockMetrics.systemHealth.uptime}
                </p>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CPU Usage</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {mockMetrics.systemHealth.cpuUsage}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Current load</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Memory Usage</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {mockMetrics.systemHealth.memoryUsage}%
                </p>
                <p className="text-xs text-gray-500 mt-1">RAM utilization</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Database className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className="text-2xl font-semibold text-red-600">
                  {mockMetrics.systemHealth.errorRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Last hour</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              System Logs
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedLogs.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadLogs('json')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download JSON ({selectedLogs.length})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadLogs('csv')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="document_processing">Document Processing</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-2 pb-2 border-b">
              <Checkbox
                checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                onCheckedChange={handleSelectAllLogs}
              />
              <span className="text-sm text-gray-600">
                Select all ({filteredLogs.length} logs)
              </span>
            </div>
            
            {/* Logs List */}
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedLogs.includes(log.id)}
                    onCheckedChange={(checked) => handleLogSelection(log.id, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getLevelIcon(log.level)}
                      {getLevelBadge(log.level)}
                      <Badge variant="outline" className="text-xs">
                        {log.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 mb-2">{log.message}</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-600">
                      {log.userId && (
                        <div>
                          <span className="font-medium">User ID:</span>
                          <p className="font-mono">{log.userId}</p>
                        </div>
                      )}
                      {log.ipAddress && (
                        <div>
                          <span className="font-medium">IP Address:</span>
                          <p className="font-mono">{log.ipAddress}</p>
                        </div>
                      )}
                      {log.sessionId && (
                        <div>
                          <span className="font-medium">Session ID:</span>
                          <p className="font-mono">{log.sessionId}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Log ID:</span>
                        <p className="font-mono">{log.id}</p>
                      </div>
                    </div>
                    
                    {Object.keys(log.metadata).length > 0 && (
                      <details className="mt-3">
                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                          View Metadata ({Object.keys(log.metadata).length} fields)
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      </details>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No logs found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search criteria or time range
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">System Health</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-medium">{mockMetrics.systemHealth.cpuUsage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-medium">{mockMetrics.systemHealth.memoryUsage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Disk Usage</span>
                  <span className="font-medium">{mockMetrics.systemHealth.diskUsage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Network Latency</span>
                  <span className="font-medium">{mockMetrics.systemHealth.networkLatency}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Connections</span>
                  <span className="font-medium">{mockMetrics.systemHealth.activeConnections}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-medium">{mockMetrics.performanceMetrics.avgResponseTime}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">P95 Response Time</span>
                  <span className="font-medium">{mockMetrics.performanceMetrics.p95ResponseTime}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Throughput</span>
                  <span className="font-medium">{mockMetrics.performanceMetrics.throughput} req/s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium">{mockMetrics.performanceMetrics.successRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cache Hit Rate</span>
                  <span className="font-medium">{mockMetrics.performanceMetrics.cacheHitRate}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Security</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Failed Login Attempts</span>
                  <span className="font-medium">{mockMetrics.securityMetrics.failedLoginAttempts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Blocked IPs</span>
                  <span className="font-medium">{mockMetrics.securityMetrics.blockedIPs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Suspicious Activities</span>
                  <span className="font-medium">{mockMetrics.securityMetrics.suspiciousActivities}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SSL Cert Expiry</span>
                  <span className="font-medium">{mockMetrics.securityMetrics.sslCertificatesExpiry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vulnerabilities</span>
                  <Badge variant={mockMetrics.securityMetrics.vulnerabilitiesDetected === 0 ? 'default' : 'destructive'}>
                    {mockMetrics.securityMetrics.vulnerabilitiesDetected}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
