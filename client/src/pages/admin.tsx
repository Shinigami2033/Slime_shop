import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Download, Users, Calendar } from "lucide-react";
import { Link } from "wouter";
import { type Newsletter } from "@shared/schema";

export default function Admin() {
  const { data: newsletters, isLoading, error } = useQuery<Newsletter[]>({
    queryKey: ['/api/newsletters'],
    queryFn: async () => {
      const response = await fetch('/api/newsletters');
      if (!response.ok) {
        throw new Error('Failed to fetch newsletters');
      }
      return response.json();
    },
  });

  const downloadCSV = () => {
    window.open('/api/newsletters/export', '_blank');
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading newsletter subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Mail className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Error loading subscriptions</p>
            <p className="text-sm text-gray-600">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-purple-600 hover:text-purple-800 transition-colors">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Newsletter Admin</h1>
            </div>
            <Button 
              onClick={downloadCSV}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{newsletters?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Latest Signup</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {newsletters && newsletters.length > 0 
                  ? formatDate(newsletters[newsletters.length - 1].subscribedAt).split(',')[0]
                  : 'No signups yet'
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
              <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">Running</div>
            </CardContent>
          </Card>
        </div>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Newsletter Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {newsletters && newsletters.length > 0 ? (
              <div className="space-y-4">
                {newsletters.map((newsletter) => (
                  <div 
                    key={newsletter.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{newsletter.email}</p>
                        <p className="text-sm text-gray-500">ID: {newsletter.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(newsletter.subscribedAt)}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        Subscribed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers yet</h3>
                <p className="text-gray-600">Newsletter subscriptions will appear here once people sign up.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}