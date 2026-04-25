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
  const [visibleCount, setVisibleCount] = useState(1000);
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

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((p) => {
            const inCart = cart.find((c) => String(c.product.id) === String(p.id));
            return (
              <motion.div
                key={p.id}
                variants={scaleIn}
                layout
                className="rounded-lg border bg-card shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="w-full aspect-[4/3] bg-white flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{p.name}</h3>
                  <div className="flex flex-wrap items-center gap-1 mt-1 mb-1.5">
                    <span className="inline-block bg-primary/10 text-primary text-[10px] font-medium px-1.5 py-0.5 rounded">{p.size}</span>
                    {p.sku && <span className="inline-block bg-muted text-muted-foreground border text-[10px] font-medium px-1.5 py-0.5 rounded">SKU: {p.sku}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 whitespace-pre-line leading-snug">{p.details}</p>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min="1"
                      placeholder={p.unit}
                      value={quantities[p.id] || ""}
                      onChange={(e) => setQuantities((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-14 h-8 text-xs px-2"
                    />
                    <Button size="sm" onClick={() => handleAddToCart(p)} className="flex-1 h-8 text-xs px-2">
                      <Plus className="w-3 h-3 mr-0.5" /> যোগ
                    </Button>
                  </div>
                  <AnimatePresence>
                    {inCart && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 flex items-center justify-between bg-primary/5 rounded px-2 py-1 text-sm overflow-hidden"
                      >
                        <span className="text-primary font-medium">কার্টে: {inCart.quantity} {p.unit}</span>
                        <button onClick={() => onRemoveFromCart(p.id)} className="text-destructive hover:underline text-xs">বাদ দিন</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {hasMore ? (
          <Button variant="outline" size="lg" onClick={() => setVisibleCount((c) => Math.min(c + 5, products.length))}>
            আরও দেখুন
          </Button>
        ) : (
          <Button variant="outline" size="lg" onClick={() => { setVisibleCount(10); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
            কম দেখুন
          </Button>
        )}
      </motion.div>
    </section>
  );
};
