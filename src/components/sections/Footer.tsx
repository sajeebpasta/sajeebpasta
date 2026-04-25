import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <motion.footer
      className="text-white py-12 px-4"
      style={{ backgroundColor: 'hsl(var(--brand-nav))' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src={logo} alt="Sajeeb Group Logo" className="h-14 object-contain mb-4" />
          <p className="text-sm opacity-90">প্রিমিয়াম ম্যাকারনি পাস্তা প্রস্তুতকারক ও সরবরাহকারী</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-3">যোগাযোগ</h4>
          <div className="space-y-2 text-sm opacity-80">
            <a href="mailto:info@sajeebgroup.com.bd" className="flex items-center gap-2 hover:opacity-100">
              <Mail className="w-4 h-4" /> info@sajeebgroup.com.bd
            </a>
            <a href="tel:+8801711763315" className="flex items-center gap-2 hover:opacity-100">
              <Phone className="w-4 h-4" /> 01711-763315
            </a>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Shezan Point (Level 6), 2 Indira Road, Farmgate, Dhaka 1215, Bangladesh</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-3">সোশ্যাল মিডিয়া</h4>
          <a href="https://www.facebook.com/profile.php?id=61578272464226" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100">
            <Facebook className="w-5 h-5" /> Facebook-এ আমাদের অনুসরণ করুন
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-background/20 text-center text-sm opacity-60">
        © {new Date().getFullYear()} National Bulk Sales — Sajeeb Group. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </motion.footer>
  );
};
