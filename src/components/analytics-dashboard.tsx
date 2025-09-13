"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, TrendingUp, Users, MousePointer } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  phoneNumber: string;
  isActive: boolean;
  weight: number;
  createdAt: string;
  _count?: {
    clicks: number;
  };
}

interface AnalyticsData {
  agentStats: Array<{
    agentId: string;
    agentName: string;
    totalClicks: number;
    lastClick: string | null;
  }>;
  timeStats: Array<{
    date: string;
    clicks: number;
  }>;
  hourlyStats: Array<{
    hour: number;
    clicks: number;
  }>;
  totalClicks: number;
  clicksToday: number;
  avgClicksPerDay: number;
  peakHour: number;
}

interface AnalyticsDashboardProps {
  agents: Agent[];
}

const COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#E5E7EB",
];

export function AnalyticsDashboard({ agents }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("7");
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?days=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">
            Analytics Dashboard
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const agentChartData = analytics.agentStats.map((stat) => ({
    name: stat.agentName,
    clicks: stat.totalClicks,
  }));

  const timeChartData = analytics.timeStats.map((stat) => ({
    date: new Date(stat.date).toLocaleDateString(),
    clicks: stat.clicks,
  }));

  const hourlyChartData = analytics.hourlyStats.map((stat) => ({
    hour: `${stat.hour}:00`,
    clicks: stat.clicks,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-black">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Track your rotator performance and agent distribution
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] border-gray-200 text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectItem value="1" className="text-black">
                Last 24 Hours
              </SelectItem>
              <SelectItem value="7" className="text-black">
                Last 7 Days
              </SelectItem>
              <SelectItem value="30" className="text-black">
                Last 30 Days
              </SelectItem>
              <SelectItem value="90" className="text-black">
                Last 90 Days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-black">
                  {analytics.totalClicks.toLocaleString()}
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clicks Today</p>
                <p className="text-2xl font-bold text-black">
                  {analytics.clicksToday}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. per Day</p>
                <p className="text-2xl font-bold text-black">
                  {Math.round(analytics.avgClicksPerDay)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Peak Hour</p>
                <p className="text-2xl font-bold text-black">
                  {analytics.peakHour}:00
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Clicks by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#000" }} />
                <YAxis tick={{ fill: "#000" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    color: "#000",
                  }}
                />
                <Bar dataKey="clicks" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Click Distribution */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Click Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agentChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="clicks"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {agentChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    color: "#000",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Clicks */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Daily Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#000" }} />
                <YAxis tick={{ fill: "#000" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    color: "#000",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#000000"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Hourly Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fill: "#000" }} />
                <YAxis tick={{ fill: "#000" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    color: "#000",
                  }}
                />
                <Bar dataKey="clicks" fill="#374151" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Details Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">
            Agent Performance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-black">Agent</th>
                  <th className="text-left py-2 text-black">Status</th>
                  <th className="text-left py-2 text-black">Total Clicks</th>
                  <th className="text-left py-2 text-black">Last Click</th>
                  <th className="text-left py-2 text-black">Weight</th>
                </tr>
              </thead>
              <tbody>
                {analytics.agentStats.map((stat) => {
                  const agent = agents.find((a) => a.id === stat.agentId);
                  return (
                    <tr key={stat.agentId} className="border-b border-gray-100">
                      <td className="py-2 text-black">{stat.agentName}</td>
                      <td className="py-2">
                        <Badge
                          variant={agent?.isActive ? "default" : "destructive"}
                        >
                          {agent?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-2 text-black">{stat.totalClicks}</td>
                      <td className="py-2 text-black">
                        {stat.lastClick
                          ? new Date(stat.lastClick).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-2 text-black">{agent?.weight || 1}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
