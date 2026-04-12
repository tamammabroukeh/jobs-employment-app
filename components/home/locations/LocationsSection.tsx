import { getTranslations } from "@/lib/get-translations";
import { Typography } from "@/components/Reusable-Components";
import LocationCard from "./LocationCard";

// Mock data - Replace with actual API call
const getLocationsData = async () => {
  return [
    {
      id: "1",
      nameKey: "cairo",
      image: "/images/locations/cairo.jpg",
      jobCount: 2543,
    },
    {
      id: "2",
      nameKey: "alexandria",
      image: "/images/locations/alexandria.jpg",
      jobCount: 1876,
    },
    {
      id: "3",
      nameKey: "giza",
      image: "/images/locations/giza.jpg",
      jobCount: 1432,
    },
    {
      id: "4",
      nameKey: "sharmElSheikh",
      image: "/images/locations/sharm.jpg",
      jobCount: 892,
    },
    {
      id: "5",
      nameKey: "hurghada",
      image: "/images/locations/hurghada.jpg",
      jobCount: 756,
    },
    {
      id: "6",
      nameKey: "luxor",
      image: "/images/locations/luxor.jpg",
      jobCount: 543,
    },
    {
      id: "7",
      nameKey: "aswan",
      image: "/images/locations/aswan.jpg",
      jobCount: 421,
    },
    {
      id: "8",
      nameKey: "portSaid",
      image: "/images/locations/portsaid.jpg",
      jobCount: 687,
    },
  ];
};

export default async function LocationsSection() {
  const t = await getTranslations("home.locations");
  const locations = await getLocationsData();

  return (
    <section className="py-20 bg-card">
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

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              id={location.id}
              name={t(location.nameKey)}
              image={location.image}
              jobCount={location.jobCount}
              availableJobsLabel={t("availableJobs")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
