import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, TrendingUp, CheckCircle, DollarSign, Clock } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency, formatRelativeTime } from "@/utils/formatters";
import { STATUS_COLORS } from "@/utils/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { stats, isLoading } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const mainStats = [
    { 
      title: "Total Leads", 
      value: stats.leads.total.toString(), 
      icon: Users, 
      color: "text-blue-600" 
    },
    { 
      title: "Total Deals", 
      value: stats.deals.total.toString(), 
      icon: TrendingUp, 
      color: "text-green-600" 
    },
    { 
      title: "Active Customers", 
      value: stats.customers.total.toString(), 
      icon: CheckCircle, 
      color: "text-teal-600" 
    },
    { 
      title: "Total Revenue", 
      value: formatCurrency(stats.revenue.total), 
      icon: DollarSign, 
      color: "text-purple-600" 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {user?.role === 'MANAGER' && stats.pendingApprovals > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pendingApprovals} deal{stats.pendingApprovals > 1 ? 's' : ''} waiting for approval
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent leads</p>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatRelativeTime(lead.createdAt)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Draft</span>
                <span className="font-bold text-gray-600">{stats.deals.byStatus.DRAFT}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Waiting Approval</span>
                <span className="font-bold text-yellow-600">{stats.deals.byStatus.WAITING_APPROVAL}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Approved</span>
                <span className="font-bold text-green-600">{stats.deals.byStatus.APPROVED}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rejected</span>
                <span className="font-bold text-red-600">{stats.deals.byStatus.REJECTED}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.recentActivity.deals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.deals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{deal.dealNumber} - {deal.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(deal.totalAmount)} • {formatRelativeTime(deal.createdAt)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[deal.status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                    {deal.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
