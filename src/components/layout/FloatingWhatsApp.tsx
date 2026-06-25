import { FaWhatsapp } from "react-icons/fa";

export function FloatingWhatsApp() {
  return (
    <a
      // TODO: Replace this placeholder with the real Graquamarine wa.me link.
      href="#"
      aria-label="WhatsApp reservation placeholder"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-lg shadow-slate-900/25 transition hover:scale-105"
    >
      <FaWhatsapp aria-hidden="true" className="h-7 w-7" />
    </a>
  );
}
