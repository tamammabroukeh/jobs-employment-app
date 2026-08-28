import { Typography } from "@/components/Reusable-Components";
import LocationCard from "./LocationCard";
import { getHomeTranslations } from "@/lib/get-translations";
import { getLocationStatsAction } from "@/apis/services/jobs/actions";

export default async function LocationsSection() {
  const t = await getHomeTranslations();
  
  // Fetch real location stats from API
  const locationStats = await getLocationStatsAction();
  
  // Take only top 8 locations
  const topLocations = locationStats.slice(0, 8);

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="text-foreground mb-4">
            {t("locations.title")}
          </Typography>
          <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto">
            {t("locations.description")}
          </Typography>
        </div>

        {/* Locations Grid */}
        {topLocations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topLocations.map((location) => (
              <LocationCard
                key={location.city}
                id={location.city}
                name={location.city}
                jobCount={location.count}
                availableJobsLabel={t("locations.availableJobs")}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography variant="text" className="text-muted-foreground">
              {t("locations.noLocations")}
            </Typography>
          </div>
        )}
      </div>
    </section>
  );
}
