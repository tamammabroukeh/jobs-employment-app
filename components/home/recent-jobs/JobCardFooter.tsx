import Link from "next/link";
import { ReusableButton } from "@/components/Reusable-Components";
import ROUTES from "@/constants/routes";

interface JobCardFooterProps {
  jobId: string;
  applyNowLabel: string;
}

export default function JobCardFooter({ jobId, applyNowLabel }: JobCardFooterProps) {
  return (
    <div className="pt-4 border-t border-border">
      <Link href={`${ROUTES.JOB.LIST}/${jobId}`} className="block">
        <ReusableButton variant="primary" className="w-full">
          {applyNowLabel}
          <i className="fa-solid fa-arrow-right ml-2" />
        </ReusableButton>
      </Link>
    </div>
  );
}
