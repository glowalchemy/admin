import { useEffect, useState, useCallback } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingCart, Eye, Calendar, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios';

import { API_ORIGIN } from "@/lib/apiClient";
const API_BASE_URL = `${API_ORIGIN}/api`;

type EventAnalytics = {
  eventCounts: Array<{ _id: string; count: number }>;
  sourceDistribution: Array<{ _id: string; count: number }>;
  dailyTrends: Array<{ _id: { year: number; month: number; day: number }; count: number; eventName: string }>;
  purchaseSummary: { totalValue: number; totalPurchases: number };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const EventTrackingPage = () => {
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [eventFilter, setEventFilter] = useState('all');

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      if (dateRange === '7d') {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === '30d') {
        startDate.setDate(now.getDate() - 30);
      } else if (dateRange === '90d') {
        startDate.setDate(now.getDate() - 90);
      }
      
      params.append('startDate', startDate.toISOString());
      params.append('endDate', now.toISOString());
      
      if (eventFilter !== 'all') {
        params.append('eventName', eventFilter);
      }

      const response = await axios.get(`${API_BASE_URL}/admin/event-logs/analytics?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, eventFilter]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const eventChartData = analytics?.eventCounts.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const sourceChartData = analytics?.sourceDistribution.map(item => ({
    name: item._id === 'pixel' ? 'Browser Pixel' : item._id === 'capi' ? 'CAPI' : item._id,
    value: item.count
  })) || [];

  const dailyChartData = analytics?.dailyTrends.map(item => ({
    date: `${item._id.month}/${item._id.day}`,
    count: item.count,
    name: item.eventName
  })) || [];

  const statsCards = [
    {
      title: 'Total Events',
      value: eventChartData.reduce((sum, item) => sum + item.value, 0),
      icon: BarChart3,
      color: 'text-blue-500',
    },
    {
      title: 'Total Purchases',
      value: analytics?.purchaseSummary.totalPurchases || 0,
      icon: ShoppingCart,
      color: 'text-green-500',
    },
    {
      title: 'Total Revenue',
      value: `$${(analytics?.purchaseSummary.totalValue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Avg Order Value',
      value: analytics?.purchaseSummary.totalPurchases 
        ? `$${(analytics.purchaseSummary.totalValue / analytics.purchaseSummary.totalPurchases).toFixed(2)}`
        : '$0',
      icon: Users,
      color: 'text-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Tracking</h1>
          <p className="text-muted-foreground">Monitor Meta Pixel and CAPI event performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Events by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Event Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventChartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <Badge variant="secondary">{item.value.toLocaleString()}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventTrackingPage;