import { useState, useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ProductSection } from "@/components/sections/ProductSection";
import { CartSummary } from "@/components/sections/CartSummary";
import { ContactSection } from "@/components/sections/ContactSection";
import { QuotationForm } from "@/components/sections/QuotationForm";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
import { allProducts as staticProducts } from "@/data/products";
import { Product, CartItem, DatabaseProduct } from "@/types";
import { supabase } from "@/lib/supabase";
import { getMockProducts } from "@/lib/mockDb";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("8801711763315");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("pasta-hub-cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      
      // Sanitize: Only keep valid items to prevent rendering crashes
      return parsed.filter(item => 
        item && 
        item.product && 
        item.product.id && 
        typeof item.quantity === 'number' && 
        item.quantity > 0
      ).map(item => ({
        ...item,
        product: {
          ...item.product,
          id: String(item.product.id)
        }
      }));
    } catch (e) {
      console.error("Cart recovery error:", e);
      return [];
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Mock Mode Support
      if (!import.meta.env.VITE_SUPABASE_URL) {
        const saved = await getMockProducts();
        setProducts(saved.map((p: Product) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            size: p.size,
            details: p.details,
            image: (p as Product & { image_url?: string }).image_url || p.image,
            unit: p.unit,
            price: p.price,
            is_available: p.is_available !== false
        })));
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch Products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
        
        if (!productsError && productsData && productsData.length > 0) {
          setProducts((productsData as DatabaseProduct[]).map((p) => ({
            id: String(p.id),
            name: p.name || 'Unknown Product',
            sku: p.sku || '',
            size: p.size || '-',
            details: p.details || '',
            image: p.image_url || '',
            unit: p.unit || 'pcs',
            price: p.price || 0,
            is_available: p.is_available !== false
          })));
        } else {
          setProducts(staticProducts.map(p => ({ ...p, id: String(p.id) })));
        }

        // 2. Fetch All Site Settings (Dynamic WhatsApp, Title, etc.)
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('key, value');
        
        if (settingsData) {
          const whatsapp = settingsData.find(s => s.key === 'whatsapp_number')?.value;
          const title = settingsData.find(s => s.key === 'hero_title')?.value;
          const subtitle = settingsData.find(s => s.key === 'hero_subtitle')?.value;
          
          if (whatsapp) setWhatsappNumber(whatsapp);
          if (title) setHeroTitle(title);
          if (subtitle) setHeroSubtitle(subtitle);
        }
      } catch (e) {
        console.error("Critical Data Fetch Error:", e);
        setProducts(staticProducts.map(p => ({ ...p, id: String(p.id) })));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("pasta-hub-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const prodId = String(product.id);
      const existing = prev.find((c) => String(c.product.id) === prodId);
      if (existing) {
        return prev.map((c) =>
          String(c.product.id) === prodId ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { product: { ...product, id: prodId }, quantity }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((c) => String(c.product.id) !== String(id)));
  };

  const cartTotalCount = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar cartCount={cartTotalCount} />
      <Hero whatsappNumber={whatsappNumber} />
      
      <main>
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ProductSection 
            products={products} 
            cart={cart} 
            onAddToCart={addToCart} 
            onRemoveFromCart={removeFromCart} 
          />
        )}
        
        <CartSummary 
          cart={cart} 
          onRemoveFromCart={removeFromCart} 
        />
        
        <ContactSection />
        
        <QuotationForm 
          cart={cart} 
          whatsappNumber={whatsappNumber} 
        />
        
        <FAQSection />
      </main>

      <Footer />
      <FloatingWhatsApp whatsappNumber={whatsappNumber} />
    </div>
  );
};

export default Index;
