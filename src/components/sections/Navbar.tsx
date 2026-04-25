import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

interface NavbarProps {
  cartCount: number;
}

export const Navbar = ({ cartCount }: NavbarProps) => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 shadow-xl border-b border-white/10"
      style={{ backgroundColor: 'hsl(var(--brand-nav))' }}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2.5">
        <img src={logo} alt="Sajeeb Group Logo" className="h-10 md:h-12 object-contain" />
        <div className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
          <a href="#products" className="hover:opacity-80 transition-opacity">পাস্তাসমূহ</a>
          <a href="#quotation" className="hover:opacity-80 transition-opacity">কোটেশন</a>
          <a href="#faq" className="hover:opacity-80 transition-opacity">জিজ্ঞাসা</a>
          <Button 
            size="sm" 
            className="bg-white hover:bg-white/90 font-semibold px-4" 
            style={{ color: 'hsl(var(--brand-nav))' }} 
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            যোগাযোগ করুন
          </Button>
        </div>
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2 bg-white/20 text-white rounded-full px-3 py-1 text-xs font-semibold"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> {cartCount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
