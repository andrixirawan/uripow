"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { TrendingUp, Users, MousePointerClick, Activity } from "lucide-react";

interface GroupAnalytics {
  totalClicks: number;
  hourlyData: { hour: number; clicks: number }[];
  dailyData: { date: string; clicks: number }[];
  agentDistribution: { name: string; clicks: number }[];
  groupDistribution: { name: string; clicks: number }[];
  groupStats: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    strategy: string;
    clickCount: number;
    agentCount: number;
  }[];
}

const GroupAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedDays, setSelectedDays] = useState<string>("7");
  const [loading, setLoading] = useState<boolean>(true);

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#f97316",
    "#06b6d4",
    "#84cc16",
  ];

  const fetchAnalytics = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        days: selectedDays,
      });

      if (selectedGroup !== "all") {
        params.append("groupId", selectedGroup);
      }

      const response = await fetch(`/api/analytics/groups?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup, selectedDays]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        No analytics data available
      </div>
    );
  }

  const averageDailyClicks =
    analytics.dailyData.reduce((sum, day) => sum + day.clicks, 0) /
    analytics.dailyData.length;
  const peakHour = analytics.hourlyData.reduce((peak, current) =>
    current.clicks > peak.clicks ? current : peak
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Analytics</h2>
          <p className="text-gray-600">
            Track performance across all your rotator groups
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {analytics.groupStats.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDays} onValueChange={setSelectedDays}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Day</SelectItem>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MousePointerClick className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Clicks
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalClicks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Groups
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.groupStats.filter((g) => g.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Daily</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(averageDailyClicks)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Peak Hour</p>
                <p className="text-2xl font-bold text-gray-900">
                  {peakHour.hour}:00
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Group Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {analytics.groupStats.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{group.name}</h3>
                    <p className="text-sm text-gray-600">/{group.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={group.isActive ? "default" : "secondary"}>
                      {group.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{group.strategy}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{group.agentCount}</div>
                    <div className="text-gray-600">Agents</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{group.clickCount}</div>
                    <div className="text-gray-600">Clicks</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Clicks */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                  formatter={(value: number) => [value, "Clicks"]}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Pattern */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis />
                <Tooltip formatter={(value: number) => [value, "Clicks"]} />
                <Bar dataKey="clicks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Distribution */}
        {analytics.agentDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.agentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="clicks"
                  >
                    {analytics.agentDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Group Distribution */}
        {analytics.groupDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Group Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics.groupDistribution}
                  layout="horizontal"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GroupAnalytics;
