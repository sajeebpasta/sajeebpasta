import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp = ({ whatsappNumber }: FloatingWhatsAppProps) => {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};
