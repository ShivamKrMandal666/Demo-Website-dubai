import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";
import { clinic } from "@/lib/data/site";

export const metadata: Metadata = {
  title: `Contact — ${clinic.name}`,
  description:
    "Send an enquiry to Maison Lumé, or call the clinic directly. Every consultation begins with a conversation — no obligation, no pressure.",
};

export default function Page() {
  return <ContactPage />;
}
