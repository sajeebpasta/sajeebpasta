import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CartItem } from "../../types";

import { supabase } from "@/lib/supabase";
import { getMockQuotations, setMockQuotations } from "@/lib/mockDb";
import { toast } from "sonner";


interface QuotationFormProps {
  cart: CartItem[];
  whatsappNumber: string;
}

export const QuotationForm = ({ cart, whatsappNumber }: QuotationFormProps) => {
  const [formData, setFormData] = useState({ name: "", phone: "", businessType: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buildWhatsAppMessage = () => {
    let msg = `*বাল্ক কোটেশন অনুরোধ*\n`;
    msg += `নাম: ${formData.name}\n`;
    msg += `ফোন: ${formData.phone}\n`;
    msg += `ব্যবসার ধরন: ${formData.businessType}\n`;
    if (formData.message) msg += `বার্তা: ${formData.message}\n`;
    if (cart.length > 0) {
      msg += `\n*নির্বাচিত পণ্য:*\n`;
      cart.forEach((c) => { msg += `- ${c.product.name} (${c.product.size}) x ${c.quantity} ${c.product.unit}\n`; });
    }
    return encodeURIComponent(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock Mode Support
      if (!import.meta.env.VITE_SUPABASE_URL) {
        const quotationId = Date.now().toString();
        const newQuotation = {
          id: quotationId,
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.businessType + (formData.message ? ` - ${formData.message}` : ""),
          business_type: formData.businessType,
          message: formData.message,
          status: 'pending',
          created_at: new Date().toISOString(),
          items: cart.map(item => ({
            id: Math.random().toString(),
            quotation_id: quotationId,
            product_id: item.product.id,
            quantity: item.quantity,
            products: {
              name: item.product.name,
              size: item.product.size,
              unit: item.product.unit
            }
          }))
        };
        
        const existingQs = await getMockQuotations();
        await setMockQuotations([newQuotation, ...existingQs]);
        
        toast.success("আপনার অনুরোধটি সফলভাবে জমা হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।");
        setFormData({ name: "", phone: "", businessType: "", message: "" });
        setIsSubmitting(false);
        return;
      }

      // 1. Insert Quotation (Defensive Mode)
      const submissionData = {
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.businessType + (formData.message ? ` | বার্তা: ${formData.message}` : ""),
        business_type: formData.businessType,
        message: formData.message,
        status: 'pending'
      };

      let { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert([submissionData])
        .select()
        .single();

      // Fallback: If business_type or message columns don't exist, try a simpler insert
      if (quotationError && (quotationError.message.includes("column") || quotationError.code === "PGRST204")) {
        console.warn("Retrying with simplified schema...");
        const simplifiedData = {
          customer_name: formData.name,
          phone: formData.phone,
          address: `ব্যবসায়: ${formData.businessType} | বার্তা: ${formData.message || 'নেই'}`,
          status: 'pending'
        };
        
        const retry = await supabase
          .from('quotations')
          .insert([simplifiedData])
          .select()
          .single();
        
        quotation = retry.data;
        quotationError = retry.error;
      }

      if (quotationError) throw quotationError;

      // 2. Insert Quotation Items if cart is not empty
      if (cart.length > 0 && quotation) {
        const quotationItems = cart.map(item => ({
          quotation_id: quotation.id,
          product_id: item.product.id,
          quantity: item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('quotation_items')
          .insert(quotationItems);

        if (itemsError) throw itemsError;
      }

      toast.success("আপনার অনুরোধটি সফলভাবে জমা হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।");
      
      // Reset form
      setFormData({ name: "", phone: "", businessType: "", message: "" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "দুঃখিত, অনুরোধটি জমা দেওয়া যায়নি।";
      console.error("Submission error:", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 max-w-xl mx-auto" id="quotation">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">বাল্ক কোটেশন ফর্ম</h2>
        <p className="text-center text-muted-foreground mb-8">ফর্ম পূরণ করুন, আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন</p>
      </motion.div>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5 border rounded-lg p-6 bg-card shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">নাম *</label>
          <Input required value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} placeholder="আপনার নাম লিখুন" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">ফোন *</label>
          <Input required type="tel" value={formData.phone} onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))} placeholder="আপনার ফোন নম্বর" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">ব্যবসার ধরন</label>
          <Select onValueChange={(v) => setFormData((f) => ({ ...f, businessType: v }))}>
            <SelectTrigger><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="খুচরা বিক্রেতা">খুচরা বিক্রেতা</SelectItem>
              <SelectItem value="পাইকারি ব্যবসায়ী">পাইকারি ব্যবসায়ী</SelectItem>
              <SelectItem value="পরিবেশক">পরিবেশক</SelectItem>
              <SelectItem value="ইভেন্ট ক্রেতা">ইভেন্ট ক্রেতা</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">বার্তা</label>
          <Textarea value={formData.message} onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))} placeholder="আপনার বার্তা বা বিশেষ চাহিদা লিখুন" rows={4} />
        </div>
        <Button type="submit" size="lg" className="w-full text-base py-6 font-semibold bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
          {isSubmitting ? "জমা হচ্ছে..." : "কোটেশন অনুরোধ জমা দিন"}
        </Button>
      </motion.form>
    </section>
  );
};
