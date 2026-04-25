import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/types";

interface CartSummaryProps {
  cart: CartItem[];
  onRemoveFromCart: (id: string | number) => void;
}

export const CartSummary = ({ cart, onRemoveFromCart }: CartSummaryProps) => {
  const cartTotal = cart.reduce((s, c) => s + c.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <section className="px-4 max-w-6xl mx-auto mb-10">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="border rounded-lg p-6 bg-card shadow-sm"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
            <ShoppingCart className="w-5 h-5 text-primary" /> আপনার কার্ট
          </h3>
          <div className="space-y-2">
            {cart.map((c) => {
              if (!c || !c.product) return null;
              const cartItemKey = `cart-item-${String(c.product.id)}`;
              return (
                <motion.div
                  key={cartItemKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <span className="text-foreground">{c.product.name} ({c.product.size})</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">x {c.quantity} {c.product.unit}</span>
                  <button onClick={() => onRemoveFromCart(String(c.product.id))} className="text-destructive text-sm hover:underline">বাদ দিন</button>
                </div>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 text-right font-semibold text-foreground">মোট আইটেম: {cartTotal}</p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
