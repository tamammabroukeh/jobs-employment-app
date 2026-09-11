// import TopCompaniesSection from '@/components/home/top-companies/TopCompaniesSection';
import JobsSearchSection from '@/components/jobs/JobsSearchSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Jobs - Find Your Next Opportunity',
  description: 'Search and filter thousands of job listings by role, location, and job type to find the right opportunity for you.',
};

export default async function JobsPage() {

  return (
    <>
      {/* Top Companies Section */}
      {/* <TopCompaniesSection showHeader={true} showViewAllCompanies={false} /> */}

      {/* Jobs Search Section */}
      <JobsSearchSection />
    </>
  );
}
