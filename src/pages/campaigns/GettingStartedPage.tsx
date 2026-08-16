import { Link } from 'react-router-dom';
import { 
  Target, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  CheckCircle, 
  BookOpen,
  Settings,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GettingStartedPage = () => {
  const steps = [
    {
      icon: Settings,
      title: 'Setup Meta Pixel',
      description: 'Configure your Meta Pixel and Conversions API for enhanced tracking',
      link: '/campaigns/setup',
      status: 'pending',
    },
    {
      icon: Target,
      title: 'Create Campaign',
      description: 'Set up your first marketing campaign with tracking enabled',
      link: '/campaigns/list',
      status: 'pending',
    },
    {
      icon: BarChart3,
      title: 'Monitor Events',
      description: 'Track and analyze your pixel events in real-time',
      link: '/campaigns/tracking',
      status: 'pending',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Easy Setup',
      description: 'Get started in minutes with our guided setup wizard',
    },
    {
      icon: CheckCircle,
      title: 'Enhanced Tracking',
      description: 'Both browser pixel and server-side CAPI support',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Monitor your campaigns and events as they happen',
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Guide',
      description: 'Detailed documentation to help you succeed',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Rocket className="h-4 w-4" />
            <span className="text-sm font-medium">Welcome to Trozzi</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Campaign Management Made Simple
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Track Meta Pixel events, manage campaigns, and optimize your marketing performance with our easy-to-use admin suite.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/campaigns/setup">
                <Zap className="h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link to="/campaigns/dashboard">
                <BarChart3 className="h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Start Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Step {index + 1}
                    </Badge>
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link to={step.link} className="gap-2">
                      {step.status === 'completed' ? 'Completed' : 'Start'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Dive In?</CardTitle>
            <CardDescription className="text-blue-100">
              Access your dashboard to manage campaigns and track performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link to="/campaigns/dashboard">
                  <BarChart3 className="h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-white/10" asChild>
                <Link to="/campaigns/setup">
                  <Settings className="h-5 w-5" />
                  Setup Guide
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-muted-foreground mb-6">
            Check out our comprehensive setup guide for detailed instructions
          </p>
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/campaigns/setup">
              <BookOpen className="h-4 w-4" />
              View Setup Guide
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedPage;