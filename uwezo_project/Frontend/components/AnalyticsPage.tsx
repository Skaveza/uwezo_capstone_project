import { StatCard } from "./StatCard";
import { FileText, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const processingTrendData = [
  { month: "May", documents: 45 },
  { month: "Jun", documents: 62 },
  { month: "Jul", documents: 78 },
  { month: "Aug", documents: 95 },
  { month: "Sep", documents: 112 },
  { month: "Oct", documents: 89 },
];

const confidenceData = [
  { range: "90-100%", count: 145 },
  { range: "80-89%", count: 67 },
  { range: "70-79%", count: 23 },
  { range: "Below 70%", count: 8 },
];

const statusData = [
  { name: "Completed", value: 243, color: "#22c55e" },
  { name: "Processing", value: 12, color: "#3b82f6" },
  { name: "Failed", value: 8, color: "#ef4444" },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Analytics</h1>
        <p className="text-muted-foreground mt-1">Track document processing performance and insights</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Documents"
          value="263"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Processed"
          value="243"
          icon={CheckCircle}
          subtitle="92.4% success rate"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Avg. Confidence"
          value="94.2%"
          icon={TrendingUp}
          trend={{ value: 2.3, isPositive: true }}
        />
        <StatCard
          title="Avg. Processing Time"
          value="2.1s"
          icon={Clock}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Processing Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly document processing volume</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processingTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="documents"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Current document status breakdown</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence Score Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Confidence Score Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution of document confidence scores</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
