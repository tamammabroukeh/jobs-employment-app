import { Metadata } from "next";
import ReceivedOffersClient from "@/components/offers/ReceivedOffersClient";

export const metadata: Metadata = {
  title: "Received Offers | Job Portal",
  description: "View and manage your received job offers from employers",
};

export default function OffersPage() {
  return <ReceivedOffersClient />;
}
