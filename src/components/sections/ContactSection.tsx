import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export const ContactSection = () => {
  return (
    <motion.section
      className="py-12 px-4 bg-secondary"
      id="contact"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-foreground">যোগাযোগ করুন</h2>
        <a href="tel:+8801711763315" className="inline-flex items-center gap-3 text-2xl font-bold text-primary hover:underline">
          <Phone className="w-7 h-7" /> 01711-763315
        </a>
        <p className="text-muted-foreground mt-2">যেকোনো প্রশ্ন বা অর্ডারের জন্য কল করুন</p>
      </div>
    </motion.section>
  );
};
