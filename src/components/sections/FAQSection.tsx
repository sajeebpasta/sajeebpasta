import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQSection = () => {
  return (
    <section id="faq" className="py-16 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <HelpCircle className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">জিজ্ঞাসা করুন</h2>
          <p className="text-muted-foreground mt-2">আমাদের পণ্য ও সেবা সম্পর্কে সাধারণ প্রশ্নোত্তর</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="q1" className="bg-card border rounded-lg px-5 shadow-sm">
              <AccordionTrigger className="text-base font-medium text-foreground">ন্যূনতম কত পরিমাণ অর্ডার করতে হয়?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                বাল্ক অর্ডারের জন্য নির্দিষ্ট কোনো ন্যূনতম পরিমাণ নির্ধারিত নেই। তবে বিশেষ ক্ষেত্রে ছোট অর্ডারও গ্রহণ করা হয়। বিস্তারিত জানতে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="bg-card border rounded-lg px-5 shadow-sm">
              <AccordionTrigger className="text-base font-medium text-foreground">ডেলিভারি কত দিনের মধ্যে পাওয়া যায়?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                ঢাকা এবং ঢাকার বাইরে দ্রুত সময়ের মধ্যে ডেলিভারি প্রদান করা হয়। বড় অর্ডারের ক্ষেত্রে বিশেষ ডেলিভারি ব্যবস্থা করা হয়।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="bg-card border rounded-lg px-5 shadow-sm">
              <AccordionTrigger className="text-base font-medium text-foreground">পাইকারি মূল্য কীভাবে পাবো?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                পাইকারি মূল্য জানার জন্য উপরের কোটেশন ফর্মটি পূরণ করুন অথবা সরাসরি আমাদের হোয়াটসঅ্যাপে যোগাযোগ করুন।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4" className="bg-card border rounded-lg px-5 shadow-sm">
              <AccordionTrigger className="text-base font-medium text-foreground">আপনাদের পণ্য কি হালাল সার্টিফাইড?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                হ্যাঁ, আমাদের সকল পণ্য সম্পূর্ণ হালাল এবং BSTI অনুমোদিত। আমরা সর্বোচ্চ মান নিয়ন্ত্রণ নিশ্চিত করি।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5" className="bg-card border rounded-lg px-5 shadow-sm">
              <AccordionTrigger className="text-base font-medium text-foreground">পেমেন্ট কীভাবে করতে হয়?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট গ্রহণ করা হয়। বড় অর্ডারের ক্ষেত্রে সম্পূর্ণ অগ্রিম পেমেন্ট প্রয়োজন হতে পারে।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6" className="bg-card border rounded-lg px-5 shadow-sm">
              <AccordionTrigger className="text-base font-medium text-foreground">রিটার্ন পলিসি কী?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                উৎপাদনজনিত কোনো ত্রুটি থাকলে আমরা প্রয়োজনীয় ব্যবস্থা গ্রহণ করি।
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
