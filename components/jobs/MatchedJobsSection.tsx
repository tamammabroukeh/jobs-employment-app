import { Suspense } from "react";
import MatchedJobsList from "./MatchedJobsList";
import { jobSeekerRepository } from "@/apis/services/job-seeker";
import { Typography } from "../Reusable-Components";
import { getJobsTranslations } from "@/lib/get-translations";

export default async function MatchedJobsSection() {
  const t = await getJobsTranslations();
  let matchedJobsData;
  let error = null;

  try {
    matchedJobsData = await jobSeekerRepository.matchResumeToJobs();
  } catch (err) {
    console.error("Failed to fetch companies:", err);
    error = err as string;
  }
  
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <Typography variant="p" className="mt-4 text-muted-foreground">
                {t("matchedJobs.loading")}
              </Typography>
            </div>
          }
        >
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Typography variant="p" className="text-destructive">
                {error}
              </Typography>
            </div>
          )}
          {matchedJobsData?.jobs && <MatchedJobsList jobs={matchedJobsData?.jobs} />}
        </Suspense>
      </div>
    </section>
  );
}
