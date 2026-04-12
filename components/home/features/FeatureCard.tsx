import { Flex, Typography } from "@/components/Reusable-Components";
import { TypographyVariant } from "@/components/Reusable-Components/typography";
import { getTranslations } from "@/lib/get-translations";
import { cn } from "@/lib/utils";
import { NamespaceKeys } from "@/types/i18n-types";
interface IFeatureCard {
  title: NamespaceKeys<"home">;
  description: NamespaceKeys<"home">;
  icon: string;
  parentIconClasses: string;
  titleVariant?: TypographyVariant;
  descriptionVariant?: TypographyVariant;
}
async function FeatureCard({
  description,
  title,
  icon,
  titleVariant = "h3",
  descriptionVariant = "p",
  parentIconClasses,
}: IFeatureCard) {
  const t = await getTranslations("home");
  return (
    <div className="auth-card p-6 text-center">
      <div className={cn("w-14 h-14 rounded-2xl mx-auto mb-4", parentIconClasses)}>
        <Flex>
          <i className={cn("fa-solid text-2xl", icon)} />
        </Flex>
      </div>
      <Typography variant={titleVariant} className="text-foreground mb-2">
        {t(title)}
      </Typography>
      <Typography
        variant={descriptionVariant}
        className="text-muted-foreground"
      >
        {t(description)}
      </Typography>
    </div>
  );
}

export default FeatureCard;
