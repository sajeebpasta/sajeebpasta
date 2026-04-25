import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardList, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    quotations: 0,
    pendingQuotations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      const { count: quotationCount } = await supabase
        .from('quotations')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from('quotations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        products: productCount || 0,
        quotations: quotationCount || 0,
        pendingQuotations: pendingCount || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Products", value: stats.products, icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Quotations", value: stats.quotations, icon: ClipboardList, color: "text-green-600", bg: "bg-green-100" },
    { title: "Pending Inquiries", value: stats.pendingQuotations, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Active Users", value: "1", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome back to your store management center.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Recent quotation requests and product updates will appear here.</p>
                {/* We can add a list here later */}
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <p className="text-sm text-muted-foreground mb-4 w-full">Fast access to common management tasks.</p>
              {/* Add quick action buttons */}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
