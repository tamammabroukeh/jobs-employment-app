import Link from "next/link";
import { Typography, ReusableCard } from "@/components/Reusable-Components";
import ROUTES from "@/constants/routes";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  jobCount: number;
  availableJobsLabel: string;
}

export default function CategoryCard({
  id,
  name,
  icon,
  jobCount,
  availableJobsLabel,
}: CategoryCardProps) {
  return (
    <Link href={`${ROUTES.JOB.LIST}?category=${id}`} className="block h-full">
      <ReusableCard
        styleForCard="hover:shadow-xl hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full border border-border"
        styleForContent="flex flex-col items-center py-4"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
          <i className={`${icon} text-3xl text-primary group-hover:text-white transition-colors`} />
        </div>
        
        <Typography variant="h4" className="text-foreground group-hover:text-primary mb-2 text-center transition-colors">
          {name}
        </Typography>
        
        <Typography variant="small" className="text-muted-foreground text-center">
          {jobCount.toLocaleString()} {availableJobsLabel}
        </Typography>
        
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="fa-solid fa-arrow-right text-primary text-sm" />
        </div>
      </ReusableCard>
    </Link>
  );
}
