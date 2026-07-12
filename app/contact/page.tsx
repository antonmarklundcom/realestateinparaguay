import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact Us | Real Estate in Paraguay",
  description: "Get in touch about buying property in Paraguay.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 px-6 py-24 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4 text-center">Contact</h1>
      <p className="text-zinc-600 text-center mb-8">
        [Address / hours / socials pending — same NAP as inmobiliaria.com.py]
      </p>
      <ContactForm />
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`}
        className="block text-center mt-8 rounded-full border border-black/20 px-6 py-3 text-sm font-medium"
      >
        Chat on WhatsApp
      </a>
    </main>
  );
}
