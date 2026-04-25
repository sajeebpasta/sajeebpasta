import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  ClipboardList, 
  Loader2,
  Calendar,
  User,
  Phone,
  MapPin,
  Check,
  FileText,
  Download,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getMockQuotations, setMockQuotations } from "@/lib/mockDb";
import { 
  exportToCSV, 
  exportToPDF, 
  exportAllToCSV, 
  exportAllToPDF 
} from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Quotation, QuotationItem } from "@/types";

const Quotations = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);

  const fetchQuotations = async () => {
    setLoading(true);
    
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const data = await getMockQuotations();
      setQuotations(data);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('quotations')
      .select('*, items:quotation_items(*, products(name, size, unit))')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch quotations");
    } else {
      setQuotations(data as Quotation[] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleViewDetails = async (quotation: Quotation) => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setSelectedQuotation(quotation);
      setIsDetailsOpen(true);
      return;
    }

    setSelectedQuotation(quotation);
    setIsDetailsOpen(true);
    setItemsLoading(true);

    const { data, error } = await supabase
      .from('quotation_items')
      .select('*, products(name, size, unit)')
      .eq('quotation_id', quotation.id);

    if (error) {
      toast.error("Failed to fetch quotation items");
    } else {
      setSelectedQuotation({ ...quotation, items: data as QuotationItem[] || [] });
    }
    setItemsLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const data = await getMockQuotations();
      const updated = data.map((q: Quotation) => q.id === id ? { ...q, status: newStatus } : q);
      await setMockQuotations(updated);
      toast.success("Status updated");
      fetchQuotations();
      if (selectedQuotation && selectedQuotation.id === id) {
        setSelectedQuotation({...selectedQuotation, status: newStatus});
      }
      return;
    }

    const { error } = await supabase
      .from('quotations')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchQuotations();
      if (selectedQuotation && selectedQuotation.id === id) {
        setSelectedQuotation({...selectedQuotation, status: newStatus});
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 uppercase text-[10px]">Pending</Badge>;
      case 'contacted': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 uppercase text-[10px]">Contacted</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 uppercase text-[10px]">Completed</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 uppercase text-[10px]">Cancelled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground mt-1">Review and manage customer bulk order inquiries.</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-semibold">
                <Download className="w-4 h-4" /> Download All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => exportAllToPDF(quotations, 'All Quotations')} className="gap-2 cursor-pointer">
                <FileText className="w-4 h-4" /> Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAllToCSV(quotations, 'all_quotations')} className="gap-2 cursor-pointer">
                <Download className="w-4 h-4" /> Download as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Fetching inquiries...</p>
            </div>
          ) : quotations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-sm">
                      {format(new Date(q.created_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="font-medium">{q.customer_name}</TableCell>
                    <TableCell>{q.phone}</TableCell>
                    <TableCell>{getStatusBadge(q.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {q.status !== 'completed' && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleStatusChange(q.id, 'completed')} 
                            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-4 h-4" /> Done
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(q)} className="gap-2">
                          <Eye className="w-4 h-4" /> Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No quotations yet</h3>
              <p className="text-muted-foreground">New customer inquiries will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Quotation Details
            </DialogTitle>
            <DialogDescription className="hidden">
              View the details of the quotation request and manage its status.
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuotation && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{selectedQuotation.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedQuotation.phone}</span>
                  </div>
                </div>
                <div className="space-y-3 text-right">
                  <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(selectedQuotation.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-end">
                    {getStatusBadge(selectedQuotation.status)}
                  </div>
                </div>
                {selectedQuotation.address && (
                  <div className="col-span-2 mt-2 pt-2 border-t flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{selectedQuotation.address}</span>
                  </div>
                )}
                {selectedQuotation.business_type && (
                  <div className="col-span-2 mt-1 flex items-start gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="font-medium text-primary">{selectedQuotation.business_type}</span>
                  </div>
                )}
                {selectedQuotation.message && (
                  <div className="col-span-2 mt-2 pt-2 border-t flex items-start gap-2 text-sm italic text-muted-foreground">
                    <span>" {selectedQuotation.message} "</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 border-b pb-2">
                  <Package className="w-4 h-4" /> Requested Items
                </h3>
                {itemsLoading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedQuotation.items?.map((item: QuotationItem) => (
                      <div key={item.id} className="flex justify-between items-center bg-card p-3 rounded-md border shadow-sm">
                        <div>
                          <p className="font-medium">{item.products?.name || "Deleted Product"}</p>
                          <p className="text-xs text-muted-foreground">{item.products?.size} • {item.products?.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{item.quantity} {item.products?.unit}</p>
                        </div>
                      </div>
                    ))}
                    {(!selectedQuotation.items || selectedQuotation.items.length === 0) && (
                      <p className="text-center text-sm text-muted-foreground py-4">No items in this quotation.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm">Update Status</h4>
                <Select 
                  value={selectedQuotation.status} 
                  onValueChange={(val) => handleStatusChange(selectedQuotation.id, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => exportToPDF(selectedQuotation)} className="gap-2">
                    <FileText className="w-4 h-4" /> PDF
                  </Button>
                  <Button variant="outline" onClick={() => exportToCSV(selectedQuotation)} className="gap-2">
                    <Download className="w-4 h-4" /> CSV
                  </Button>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                  <Button className="gap-2" onClick={() => selectedQuotation && window.open(`https://wa.me/${selectedQuotation.phone?.replace(/\D/g, '') || ''}`, '_blank')}>
                    <Phone className="w-4 h-4" /> Contact via WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Quotations;
