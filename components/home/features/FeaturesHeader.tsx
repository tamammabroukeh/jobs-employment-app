import { Typography } from "@/components/Reusable-Components";
import { getHomeTranslations } from "@/lib/get-translations";

async function FeaturesHeader() {
  const t = await getHomeTranslations();
  return (
    <div className="text-center mb-12">
      <Typography variant="h2" className="text-foreground mb-4">
        {t("features.title")}
      </Typography>
      <Typography
        variant="p"
        className="text-muted-foreground max-w-2xl mx-auto"
      >
        {t("features.description")}
      </Typography>
    </div>
  );
}

export default FeaturesHeader;
