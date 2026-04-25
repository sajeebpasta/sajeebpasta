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
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Loader2, 
  Package
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Product } from "@/types";
import { allProducts as staticProducts } from "@/data/products";
import { getMockProducts, setMockProducts } from "@/lib/mockDb";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    size: "",
    details: "",
    image_url: "",
    unit: "ব্যাগ",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);


  const fetchProducts = async () => {
    setLoading(true);
    
    // Mock Mode Support
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const saved = await getMockProducts();
      setProducts(saved);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch products");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenDialog = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku || "",
        size: product.size,
        details: product.details || "",
        image_url: (product as Product & { image_url?: string }).image_url || (product as Product & { image?: string }).image || "",
        unit: product.unit,
      });
      setImageFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        sku: "",
        size: "",
        details: "",
        image_url: "",
        unit: "ব্যাগ",
      });
      setImageFile(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        if (!import.meta.env.VITE_SUPABASE_URL) {
          // Convert image to Base64 for Mock Mode local storage
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          await new Promise((resolve) => {
            reader.onload = () => {
              finalImageUrl = reader.result as string;
              resolve(null);
            };
          });
        } else {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, imageFile);

          if (uploadError) {
            throw new Error("Error uploading image. Did you create the 'product-images' bucket?");
          }

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          finalImageUrl = publicUrl;
        }
      }

      const productDataToSave = {
        ...formData,
        image_url: finalImageUrl
      };

      // Mock Mode Support
      if (!import.meta.env.VITE_SUPABASE_URL) {
        const currentProducts = await getMockProducts();
        let newProducts;
        
        if (editingProduct) {
          newProducts = currentProducts.map((p: Product) => p.id === editingProduct.id ? { ...p, ...productDataToSave } : p);
          toast.success("Product updated successfully");
        } else {
          newProducts = [{ ...productDataToSave, id: Date.now() }, ...currentProducts];
          toast.success("Product added successfully");
        }
        await setMockProducts(newProducts);
        setIsDialogOpen(false);
        fetchProducts();
        return;
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productDataToSave)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productDataToSave]);
        if (error) throw error;
        toast.success("Product added successfully");
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Mock Mode Support
      if (!import.meta.env.VITE_SUPABASE_URL) {
        const currentProducts = await getMockProducts();
        const newProducts = currentProducts.filter((p: Product) => p.id !== id);
        await setMockProducts(newProducts);
        toast.success("Product deleted");
        fetchProducts();
        return;
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Product deleted");
      fetchProducts();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your inventory and catalog.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-card p-3 rounded-lg border shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="border-none focus-visible:ring-0" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading inventory...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                        {(product as Product & { image_url?: string }).image_url || (product as Product & { image?: string }).image ? (
                          <img src={(product as Product & { image_url?: string }).image_url || (product as Product & { image?: string }).image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku || "-"}</TableCell>
                    <TableCell>{product.size}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenDialog(product)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
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
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new product.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              Fill in the details for your product catalog.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input 
                id="name" 
                className="col-span-3" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">SKU</Label>
              <Input 
                id="sku" 
                className="col-span-3" 
                placeholder="e.g. 1301" 
                value={formData.sku} 
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">Size</Label>
              <Input 
                id="size" 
                className="col-span-3" 
                placeholder="e.g. 30kg" 
                value={formData.size} 
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">Unit</Label>
              <Input 
                id="unit" 
                className="col-span-3" 
                placeholder="e.g. ব্যাগ / বক্স" 
                value={formData.unit} 
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_file" className="text-right">Upload Image</Label>
              <Input 
                id="image_file" 
                type="file"
                accept="image/*"
                className="col-span-3 cursor-pointer" 
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right text-muted-foreground">OR Image URL</Label>
              <Input 
                id="image_url" 
                className="col-span-3" 
                placeholder="https://..." 
                value={formData.image_url} 
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="details" className="text-right mt-2">Details</Label>
              <Textarea 
                id="details" 
                className="col-span-3 min-h-[100px]" 
                value={formData.details} 
                onChange={(e) => setFormData({...formData, details: e.target.value})}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Products;
