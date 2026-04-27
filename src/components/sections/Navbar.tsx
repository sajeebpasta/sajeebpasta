import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import logo from "@/assets/logo.png";

interface NavbarProps {
  cartCount: number;
}

export const Navbar = ({ cartCount }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "পাস্তাসমূহ", href: "#products" },
    { name: "কোটেশন", href: "#quotation" },
    { name: "জিজ্ঞাসা", href: "#faq" },
  ];

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 shadow-xl border-b border-white/10"
      style={{ backgroundColor: 'hsl(var(--brand-nav))' }}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-[280px] sm:w-[350px] border-r-white/10 text-white"
              style={{ backgroundColor: 'hsl(var(--brand-nav))' }}
            >
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="text-white">
                  <img src={logo} alt="Sajeeb Group Logo" className="h-10 object-contain" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium hover:pl-2 transition-all duration-300 py-2 border-b border-white/10"
                  >
                    {link.name}
                  </a>
                ))}
                <Button 
                  className="bg-white hover:bg-white/90 font-semibold mt-4 text-brand-nav" 
                  style={{ color: 'hsl(var(--brand-nav))' }}
                  onClick={handleContactClick}
                >
                  যোগাযোগ করুন
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          <img src={logo} alt="Sajeeb Group Logo" className="h-8 md:h-12 object-contain" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:opacity-80 transition-opacity">
              {link.name}
            </a>
          ))}
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
              className="flex items-center gap-2 bg-white/20 text-white rounded-full px-3 py-1 text-xs font-semibold cursor-pointer hover:bg-white/30 transition-colors"
              onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}
            >
              <ShoppingCart className="w-3.5 h-3.5" /> {cartCount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
