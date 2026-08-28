import { getHomeTranslations } from "@/lib/get-translations";
import { Typography } from "@/components/Reusable-Components";
import CategoryCard from "./CategoryCard";
import { getCategoryStatsAction } from "@/apis/services/jobs/actions";

// Icon mapping for categories
const categoryIcons: Record<string, string> = {
  Technology: "fa-solid fa-laptop-code",
  Design: "fa-solid fa-palette",
  Marketing: "fa-solid fa-bullhorn",
  Business: "fa-solid fa-briefcase",
  Healthcare: "fa-solid fa-heart-pulse",
  Education: "fa-solid fa-graduation-cap",
  Engineering: "fa-solid fa-gears",
  "Customer Service": "fa-solid fa-headset",
  Finance: "fa-solid fa-sack-dollar",
  Sales: "fa-solid fa-chart-line",
  HR: "fa-solid fa-users",
  Legal: "fa-solid fa-scale-balanced",
  // Add more category icons as needed
};

export default async function CategoriesSection() {
  const t = await getHomeTranslations();
  
  // Fetch real category stats from API
  const categoryStats = await getCategoryStatsAction();
  
  // Take only top 8 categories
  const topCategories = categoryStats.slice(0, 8);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="text-foreground mb-4">
            {t("categories.title")}
          </Typography>
          <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto">
            {t("categories.description")}
          </Typography>
        </div>

        {/* Categories Grid */}
        {topCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCategories.map((category) => (
              <CategoryCard
                key={category.category}
                id={category.category}
                name={category.category}
                icon={categoryIcons[category.category] || "fa-solid fa-briefcase"}
                jobCount={category.count}
                availableJobsLabel={t("categories.availableJobs")}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography variant="text" className="text-muted-foreground">
              {t("categories.noCategories")}
            </Typography>
          </div>
        )}
      </div>
    </section>
  );
}
