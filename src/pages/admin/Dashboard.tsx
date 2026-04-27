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
    totalCustomers: 0,
    recentQuotations: [] as any[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        const { getMockQuotations } = await import("@/lib/mockDb");
        const { getProducts } = await import("@/lib/mockDb");
        
        const products = await getProducts();
        const quotations = await getMockQuotations();
        
        const uniqueCustomers = new Set(quotations.map((q: any) => q.phone)).size;
        const pending = quotations.filter((q: any) => q.status === 'pending');
        
        setStats({
          products: products.length,
          quotations: quotations.length,
          pendingQuotations: pending.length,
          totalCustomers: uniqueCustomers,
          recentQuotations: quotations.slice(0, 5),
        });
        return;
      }

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

      const { data: allQuotations } = await supabase
        .from('quotations')
        .select('customer_name, phone, created_at, status')
        .order('created_at', { ascending: false });

      const uniqueCustomers = new Set(allQuotations?.map(q => q.phone) || []).size;

      setStats({
        products: productCount || 0,
        quotations: quotationCount || 0,
        pendingQuotations: pendingCount || 0,
        totalCustomers: uniqueCustomers,
        recentQuotations: allQuotations?.slice(0, 5) || [],
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Products", value: stats.products, icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Quotations", value: stats.quotations, icon: ClipboardList, color: "text-green-600", bg: "bg-green-100" },
    { title: "Pending Inquiries", value: stats.pendingQuotations, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Total Customers", value: stats.totalCustomers, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
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
                {stats.recentQuotations.length > 0 ? (
                  stats.recentQuotations.map((q, i) => (
                    <div key={i} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors border-b last:border-0 pb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">New Inquiry Received</p>
                        <p className="text-xs text-muted-foreground">Order status updated to {q.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">{new Date(q.created_at).toLocaleDateString()}</p>
                        <p className="text-[10px] uppercase text-muted-foreground">Activity</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Recent quotation requests and product updates will appear here.</p>
                )}
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
