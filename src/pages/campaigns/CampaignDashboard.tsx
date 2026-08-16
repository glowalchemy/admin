import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Target, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';

import { API_ORIGIN } from "@/lib/apiClient";
const API_BASE_URL = `${API_ORIGIN}/api`;

type CampaignStats = {
  overview: {
    totalCampaigns: number;
    activeCampaigns: number;
    pausedCampaigns: number;
    completedCampaigns: number;
    totalBudget: number;
    totalSpent: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
  };
  byPlatform: Array<{
    _id: string;
    count: number;
    totalBudget: number;
    totalSpent: number;
  }>;
};

const CampaignDashboard = () => {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/campaigns/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading campaign stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const overview = stats?.overview;
  const platformData = stats?.byPlatform || [];

  const statCards = [
    {
      title: 'Active Campaigns',
      value: overview?.activeCampaigns || 0,
      total: overview?.totalCampaigns || 0,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Budget',
      value: `$${(overview?.totalBudget || 0).toLocaleString()}`,
      subtitle: `Spent: $${(overview?.totalSpent || 0).toLocaleString()}`,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Impressions',
      value: (overview?.totalImpressions || 0).toLocaleString(),
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Conversions',
      value: overview?.totalConversions || 0,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const performanceMetrics = [
    {
      label: 'Click-Through Rate',
      value: overview?.totalClicks && overview?.totalImpressions 
        ? ((overview.totalClicks / overview.totalImpressions) * 100).toFixed(2) + '%'
        : '0%',
      change: '+2.5%',
      positive: true,
    },
    {
      label: 'Cost Per Click',
      value: overview?.totalClicks && overview?.totalSpent
        ? '$' + (overview.totalSpent / overview.totalClicks).toFixed(2)
        : '$0',
      change: '-0.15',
      positive: true,
    },
    {
      label: 'Conversion Rate',
      value: overview?.totalConversions && overview?.totalClicks
        ? ((overview.totalConversions / overview.totalClicks) * 100).toFixed(2) + '%'
        : '0%',
      change: '+1.2%',
      positive: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
          <p className="text-muted-foreground">Overview of your marketing campaigns and performance</p>
        </div>
        <Button className="gap-2">
          <Zap className="h-4 w-4" />
          Quick Setup
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              )}
              {stat.total !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  of {stat.total} total campaigns
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-lg font-semibold">{metric.value}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <Badge className="bg-green-100 text-green-800">
                {overview?.activeCampaigns || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Paused</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {overview?.pausedCampaigns || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <Badge className="bg-blue-100 text-blue-800">
                {overview?.completedCampaigns || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Draft</span>
              <Badge variant="secondary">
                {(overview?.totalCampaigns || 0) - (overview?.activeCampaigns || 0) - (overview?.pausedCampaigns || 0) - (overview?.completedCampaigns || 0)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {platformData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No platform data available yet
            </div>
          ) : (
            <div className="space-y-4">
              {platformData.map((platform) => (
                <div key={platform._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{platform._id}</p>
                      <p className="text-sm text-muted-foreground">
                        {platform.count} campaign{platform.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${platform.totalBudget.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Budget
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Target className="h-6 w-6" />
              <span>Create Campaign</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Zap className="h-6 w-6" />
              <span>Setup Meta Pixel</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDashboard;