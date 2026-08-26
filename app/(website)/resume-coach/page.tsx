import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CoachClientWrapper from "@/components/coach/CoachClientWrapper";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("coach");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function ResumeCoachPage() {
  return (
    <div className="fixed inset-0 top-16 bg-background">
      <CoachClientWrapper />
    </div>
  );
}
