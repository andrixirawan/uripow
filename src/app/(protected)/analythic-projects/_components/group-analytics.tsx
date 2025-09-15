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

const COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#E5E7EB",
  "#F3F4F6",
];

export function GroupAnalytics() {
  const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedDays, setSelectedDays] = useState<string>("7");
  const [loading, setLoading] = useState<boolean>(true);

  const loadAnalytics = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics/groups?days=${selectedDays}&group=${selectedGroup}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error loading group analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDays, selectedGroup]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">Group Analytics</h2>
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
        <p className="text-gray-600">No group analytics data available</p>
      </div>
    );
  }

  const hourlyChartData = analytics.hourlyData.map((item) => ({
    hour: `${item.hour}:00`,
    clicks: item.clicks,
  }));

  const dailyChartData = analytics.dailyData.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    clicks: item.clicks,
  }));

  // const agentChartData = analytics.agentDistribution.map((item) => ({
  //   name: item.name,
  //   clicks: item.clicks,
  // }));

  const groupChartData = analytics.groupDistribution.map((item) => ({
    name: item.name,
    clicks: item.clicks,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-black">Group Analytics</h2>
          <p className="text-gray-600">
            Track your group performance and distribution patterns
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Select value={selectedDays} onValueChange={setSelectedDays}>
            <SelectTrigger className="w-[140px] border-gray-200 text-black">
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

          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[180px] border-gray-200 text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectItem value="all" className="text-black">
                All Groups
              </SelectItem>
              {analytics.groupStats.map((group) => (
                <SelectItem
                  key={group.id}
                  value={group.id}
                  className="text-black"
                >
                  {group.name}
                </SelectItem>
              ))}
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
              <MousePointerClick className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Groups</p>
                <p className="text-2xl font-bold text-black">
                  {analytics.groupStats.filter((g) => g.isActive).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Groups</p>
                <p className="text-2xl font-bold text-black">
                  {analytics.groupStats.length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. per Group</p>
                <p className="text-2xl font-bold text-black">
                  {analytics.groupStats.length > 0
                    ? Math.round(
                        analytics.totalClicks / analytics.groupStats.length
                      )
                    : 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Performance */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Clicks by Group</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupChartData}>
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

        {/* Group Distribution */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Group Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={groupChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="clicks"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {groupChartData.map((entry, index) => (
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
              <LineChart data={dailyChartData}>
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

      {/* Group Details Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">
            Group Performance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-black">Group</th>
                  <th className="text-left py-2 text-black">Status</th>
                  <th className="text-left py-2 text-black">Strategy</th>
                  <th className="text-left py-2 text-black">Agents</th>
                  <th className="text-left py-2 text-black">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {analytics.groupStats.map((group) => (
                  <tr key={group.id} className="border-b border-gray-100">
                    <td className="py-2 text-black">{group.name}</td>
                    <td className="py-2">
                      <Badge
                        variant={group.isActive ? "default" : "destructive"}
                      >
                        {group.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-2 text-black">
                      {group.strategy.replace("-", " ").toUpperCase()}
                    </td>
                    <td className="py-2 text-black">{group.agentCount}</td>
                    <td className="py-2 text-black">{group.clickCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
