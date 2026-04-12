import Link from "next/link";
import Image from "next/image";
import { Typography, ReusableCard } from "@/components/Reusable-Components";
import ROUTES from "@/constants/routes";

interface LocationCardProps {
  id: string;
  name: string;
  image: string;
  jobCount: number;
  availableJobsLabel: string;
}

export default function LocationCard({
  id,
  name,
  image,
  jobCount,
  availableJobsLabel,
}: LocationCardProps) {

  return (
    <Link href={`${ROUTES.JOB.LIST}?city=${id}`} className="block h-full">
      <ReusableCard
        styleForCard="hover:shadow-xl hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full border border-border overflow-hidden"
        styleForContent="p-0"
      >
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          {!image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fa-solid fa-location-dot text-6xl text-primary/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
