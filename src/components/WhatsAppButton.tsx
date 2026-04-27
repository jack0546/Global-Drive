import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  carName?: string;
}

export default function WhatsAppButton({ carName }: WhatsAppButtonProps) {
  const phone = '233244240166';
  const message = carName
    ? `Hello Global Drive Africa, I'm interested in ${carName}`
    : 'Hello Global Drive Africa, I would like to know more about your services.';

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-110 animate-bounce-slow group"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute right-16 bg-dark-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat on WhatsApp
      </span>
    </a>
  );
}
