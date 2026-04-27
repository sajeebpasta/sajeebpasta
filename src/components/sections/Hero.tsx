import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";

interface HeroProps {
  whatsappNumber: string;
  title?: string;
  subtitle?: string;
}

export const Hero = ({ whatsappNumber, title, subtitle }: HeroProps) => {
  const defaultTitle = "National Bulk Sales";
  const defaultSubtitle = "বাল্ক অর্ডার সহজেই করুন — খুচরা বিক্রেতা, পাইকারি ব্যবসায়ীদের জন্য প্রিমিয়াম ম্যাকারনী ও নুডলস। সেরা বাল্ক ডিল পান — কোনো লুকানো মূল্য নেই।";

  return (
    <section className="relative min-h-[600px] flex items-center justify-center pt-14" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {title || defaultTitle}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {subtitle || defaultSubtitle}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button size="lg" className="text-base px-8 py-6 font-semibold" onClick={() => document.getElementById("quotation")?.scrollIntoView({ behavior: "smooth" })}>
            বাল্ক কোটেশন নিন
          </Button>
          <Button variant="destructive" size="lg" className="text-base px-8 py-6 font-semibold" asChild>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" /> হোয়াটসঅ্যাপে যোগাযোগ
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
