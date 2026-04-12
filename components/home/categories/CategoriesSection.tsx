import { getTranslations } from "@/lib/get-translations";
import { Typography } from "@/components/Reusable-Components";
import CategoryCard from "./CategoryCard";

// Mock data - Replace with actual API call
const getCategoriesData = async () => {
  return [
    {
      id: "technology",
      nameKey: "technology",
      icon: "fa-solid fa-laptop-code",
      jobCount: 1234,
    },
    {
      id: "design",
      nameKey: "design",
      icon: "fa-solid fa-palette",
      jobCount: 856,
    },
    {
      id: "marketing",
      nameKey: "marketing",
      icon: "fa-solid fa-bullhorn",
      jobCount: 742,
    },
    {
      id: "business",
      nameKey: "business",
      icon: "fa-solid fa-briefcase",
      jobCount: 923,
    },
    {
      id: "healthcare",
      nameKey: "healthcare",
      icon: "fa-solid fa-heart-pulse",
      jobCount: 567,
    },
    {
      id: "education",
      nameKey: "education",
      icon: "fa-solid fa-graduation-cap",
      jobCount: 432,
    },
    {
      id: "engineering",
      nameKey: "engineering",
      icon: "fa-solid fa-gears",
      jobCount: 891,
    },
    {
      id: "customerService",
      nameKey: "customerService",
      icon: "fa-solid fa-headset",
      jobCount: 654,
    },
  ];
};

export default async function CategoriesSection() {
  const t = await getTranslations("home.categories");
  const categories = await getCategoriesData();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="text-foreground mb-4">
            {t("title")}
          </Typography>
          <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </Typography>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={t(category.nameKey)}
              icon={category.icon}
              jobCount={category.jobCount}
              availableJobsLabel={t("availableJobs")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
