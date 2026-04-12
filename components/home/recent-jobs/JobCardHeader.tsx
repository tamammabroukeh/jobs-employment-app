import Image from "next/image";
import { Typography, ReusableBadge } from "@/components/Reusable-Components";

interface JobCardHeaderProps {
  companyName: string;
  companyLogo: string;
  title: string;
  displayId: string;
}

export default function JobCardHeader({
  companyName,
  companyLogo,
  title,
  displayId,
}: JobCardHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-4">
      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted shrink-0">
        <Image
          src={companyLogo}
          alt={companyName}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Typography
          variant="h3"
          className="text-foreground group-hover:text-primary transition-colors mb-1"
        >
          {title}
        </Typography>
        <div className="flex gap-2 items-center">
          <Typography variant="h5" className="text-muted-foreground">
            {companyName}
          </Typography>
          <ReusableBadge variant="primary" size="sm">
            #{displayId}
          </ReusableBadge>
        </div>
      </div>
    </div>
  );
}
