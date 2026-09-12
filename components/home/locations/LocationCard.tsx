import Link from "next/link";
import { Typography, ReusableCard } from "@/components/Reusable-Components";
import ROUTES from "@/constants/routes";

interface LocationCardProps {
  id: string;
  name: string;
  jobCount: number;
  availableJobsLabel: string;
}

/**
 * Build a keyless Google Maps embed URL for a Syrian governorate.
 * We append "Governorate, Syria" so the map centers on the correct region
 * regardless of the raw city value coming from the API.
 */
function buildMapEmbedUrl(cityName: string): string {
  const query = encodeURIComponent(`${cityName} Governorate, Syria`);
  return `https://www.google.com/maps?q=${query}&z=9&output=embed`;
}

export default function LocationCard({
  id,
  name,
  jobCount,
  availableJobsLabel,
}: LocationCardProps) {
  const mapUrl = buildMapEmbedUrl(name);

  return (
    <Link href={`${ROUTES.JOB.LIST}?city=${id}`} className="block h-full">
      <ReusableCard
        styleForCard="hover:shadow-xl hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full border border-border overflow-hidden"
        styleForContent="p-0"
      >
        <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-primary/20 to-primary/5">
          {/* Google Maps location preview */}
          <iframe
            src={mapUrl}
            title={`${name} location map`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
            allowFullScreen
          />
          {/* Transparent overlay so clicks navigate the card link instead of
              interacting with the map iframe. */}
          <div className="absolute inset-0 z-10" aria-hidden="true" />
          {/* Bottom gradient for readability against the map */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>

        <div className="p-6 text-center">
          <Typography variant="h4" className="text-foreground group-hover:text-primary mb-2 transition-colors">
            {name}
          </Typography>

          <Typography variant="small" className="text-muted-foreground">
            {jobCount.toLocaleString()} {availableJobsLabel}
          </Typography>

          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="fa-solid fa-arrow-right text-primary text-sm" />
          </div>
        </div>
      </ReusableCard>
    </Link>
  );
}
