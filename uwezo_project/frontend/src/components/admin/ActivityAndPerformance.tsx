import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data for charts and metrics
const activityData = [
  { date: '2024-01-08', users: 45, documents: 89, sessions: 67 },
  { date: '2024-01-09', users: 52, documents: 112, sessions: 78 },
  { date: '2024-01-10', users: 48, documents: 95, sessions: 71 },
  { date: '2024-01-11', users: 61, documents: 134, sessions: 89 },
  { date: '2024-01-12', users: 55, documents: 98, sessions: 76 },
  { date: '2024-01-13', users: 67, documents: 145, sessions: 92 },
  { date: '2024-01-14', users: 71, documents: 156, sessions: 98 },
];

const performanceMetrics = [
  { month: 'Dec 2023', accuracy: 94.2, speed: 1.8, uptime: 99.1 },
  { month: 'Jan 2024', accuracy: 95.8, speed: 1.6, uptime: 99.3 },
  { month: 'Feb 2024', accuracy: 96.4, speed: 1.5, uptime: 99.5 },
  { month: 'Mar 2024', accuracy: 97.1, speed: 1.4, uptime: 99.7 },
  { month: 'Apr 2024', accuracy: 97.8, speed: 1.3, uptime: 99.8 },
  { month: 'May 2024', accuracy: 98.2, speed: 1.2, uptime: 99.9 },
];

const documentTypeDistribution = [
  { name: 'National ID', value: 45, count: 1240 },
  { name: 'Passport', value: 30, count: 820 },
  { name: 'Bank Statement', value: 20, count: 550 },
  { name: 'Driver License', value: 5, count: 140 },
];

const userActivityMetrics = {
  totalActiveUsers: 1247,
  newUsersToday: 23,
  avgSessionDuration: '8m 32s',
  documentsProcessedToday: 156,
  peakHour: '2:00 PM',
  userRetentionRate: 78.5,
  avgDocumentsPerUser: 4.2,
  systemLoad: 67
};

const modelPerformanceMetrics = {
  overallAccuracy: 98.2,
  avgProcessingTime: 1.4,
  systemUptime: 99.9,
  falsePositiveRate: 2.1,
  falseNegativeRate: 1.8,
  modelVersion: 'v2.1.4',
  lastTraining: '2024-01-10',
  trainingDataSize: '2.4M samples'
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function ActivityAndPerformance() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity & Performance</h2>
          <p className="text-gray-600 mt-1">Monitor user activity and model performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userActivityMetrics.totalActiveUsers.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% from last week</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userActivityMetrics.documentsProcessedToday}
                </p>
                <p className="text-xs text-green-600 mt-1">+8% from yesterday</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Model Accuracy</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {modelPerformanceMetrics.overallAccuracy}%
                </p>
                <p className="text-xs text-green-600 mt-1">+0.4% improvement</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Processing Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {modelPerformanceMetrics.avgProcessingTime}s
                </p>
                <p className="text-xs text-green-600 mt-1">-0.2s faster</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              User Activity Trend (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Active Users"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="documents" 
                    stackId="2" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Documents Processed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Document Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Document Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={documentTypeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {documentTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Model Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="Accuracy (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Speed (s)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uptime" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    name="Uptime (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              System Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Accuracy Metrics */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Overall Accuracy</span>
                <span className="text-sm font-bold text-green-600">
                  {modelPerformanceMetrics.overallAccuracy}%
                </span>
              </div>
              <Progress value={modelPerformanceMetrics.overallAccuracy} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">System Uptime</span>
                <span className="text-sm font-bold text-green-600">
                  {modelPerformanceMetrics.systemUptime}%
                </span>
              </div>
              <Progress value={modelPerformanceMetrics.systemUptime} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">User Retention Rate</span>
                <span className="text-sm font-bold text-blue-600">
                  {userActivityMetrics.userRetentionRate}%
                </span>
              </div>
              <Progress value={userActivityMetrics.userRetentionRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">System Load</span>
                <span className="text-sm font-bold text-yellow-600">
                  {userActivityMetrics.systemLoad}%
                </span>
              </div>
              <Progress value={userActivityMetrics.systemLoad} className="h-2" />
            </div>

            {/* Additional Metrics */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">False Positive Rate:</span>
                <span className="font-medium">{modelPerformanceMetrics.falsePositiveRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">False Negative Rate:</span>
                <span className="font-medium">{modelPerformanceMetrics.falseNegativeRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Model Version:</span>
                <Badge variant="outline">{modelPerformanceMetrics.modelVersion}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Training:</span>
                <span className="font-medium">{modelPerformanceMetrics.lastTraining}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Training Data:</span>
                <span className="font-medium">{modelPerformanceMetrics.trainingDataSize}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Activity Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userActivityMetrics.newUsersToday}
              </div>
              <div className="text-sm text-gray-600">New Users Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {userActivityMetrics.avgSessionDuration}
              </div>
              <div className="text-sm text-gray-600">Avg Session Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {userActivityMetrics.peakHour}
              </div>
              <div className="text-sm text-gray-600">Peak Usage Hour</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {userActivityMetrics.avgDocumentsPerUser}
              </div>
              <div className="text-sm text-gray-600">Avg Documents per User</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
