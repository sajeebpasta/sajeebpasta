import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product, CartItem } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

interface ProductSectionProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onRemoveFromCart: (id: string | number) => void;
}

export const ProductSection = ({ products, cart, onAddToCart, onRemoveFromCart }: ProductSectionProps) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [quantities, setQuantities] = useState<Record<string | number, string>>({});

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleAddToCart = (product: Product) => {
    const qtyValue = quantities[product.id];
    const qty = parseInt(qtyValue || "1", 10);
    if (qty <= 0 || isNaN(qty)) return;
    onAddToCart(product, qty);
    setQuantities((prev) => ({ ...prev, [product.id]: "" }));
  };

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto" id="products">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">পণ্যের আকার ও পরিমান</h2>
        <p className="text-muted-foreground">আপনার ব্যবসার জন্য সেরা ম্যাকারনী ও নুডলস নির্বাচন করুন</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <AnimatePresence>
          {visibleProducts.map((p) => {
            const inCart = cart.find((c) => String(c.product.id) === String(p.id));
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
                className="flex flex-col rounded-lg border bg-card shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {p.image ? (
                    <img src={p.image} alt={p.name || 'Product'} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground/30">
                      <Plus className="w-8 h-8 mb-1" />
                      <span className="text-[10px]">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-foreground leading-tight mb-2">
                    {p.name || 'অজানা পণ্য'}
                  </h3>
                  
                  <div className="mb-3">
                    <span className="inline-block bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded">
                      {p.size || '-'}
                    </span>
                  </div>

                  {p.details && (
                    <p className="text-[15px] text-muted-foreground mb-4 whitespace-pre-line leading-relaxed flex-1">
                      {p.details}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-auto">
                    <Input
                      type="number"
                      min="1"
                      placeholder={p.unit || 'ব্যাগ'}
                      value={quantities[p.id] || ""}
                      onChange={(e) => setQuantities((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-20 h-10 text-sm px-2 text-center shadow-sm"
                    />
                    <Button 
                      onClick={() => handleAddToCart(p)} 
                      className="flex-1 h-10 text-[15px] font-semibold text-white shadow-sm"
                      style={{ backgroundColor: '#f93333' }}
                    >
                      <Plus className="w-4 h-4 mr-1" /> যোগ
                    </Button>
                  </div>
                  <AnimatePresence>
                    {inCart && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex items-center justify-between bg-primary/5 rounded px-3 py-2 text-sm overflow-hidden"
                      >
                        <span className="text-primary font-bold">কার্টে: {inCart.quantity} {p.unit}</span>
                        <button onClick={() => onRemoveFromCart(p.id)} className="text-destructive hover:underline font-medium">বাদ দিন</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {hasMore && (
          <Button variant="outline" size="lg" onClick={() => setVisibleCount((c) => Math.min(c + 10, products.length))} className="min-w-[140px]">
            আরও দেখুন
          </Button>
        )}
        {visibleCount > 10 && (
          <Button variant="outline" size="lg" onClick={() => { setVisibleCount(10); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }} className="min-w-[140px]">
            কম দেখুন
          </Button>
        )}
      </motion.div>
    </section>
  );
};
