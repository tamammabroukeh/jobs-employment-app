import Link from "next/link";
import { ReusableButton } from "@/components/Reusable-Components";
import ROUTES from "@/constants/routes";

interface JobCardFooterProps {
  jobId: string;
  applyNowLabel: string;
  /** Optional: whether the seeker already applied to this job. */
  hasApplied?: boolean;
  /** Optional: label shown when the seeker already applied. */
  appliedLabel?: string;
}

export default function JobCardFooter({ jobId, applyNowLabel, hasApplied, appliedLabel }: JobCardFooterProps) {
  // When already applied, render a disabled button (no navigation).
  if (hasApplied) {
    return (
      <div className="pt-4 border-t border-border">
        <ReusableButton variant="default" className="w-full" disabled>
          {appliedLabel ?? applyNowLabel}
          <i className="fa-solid fa-check ml-2" />
        </ReusableButton>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t border-border">
      <Link href={ROUTES.JOB.getDetail(jobId)} className="block">
        <ReusableButton variant="primary" className="w-full">
          {applyNowLabel}
          <i className="fa-solid fa-arrow-right ml-2" />
        </ReusableButton>
      </Link>
    </div>
  );
}
