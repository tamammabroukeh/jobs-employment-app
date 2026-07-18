import TopCompaniesSection from '@/components/home/top-companies/TopCompaniesSection';
import JobsSearchSection from '@/components/jobs/JobsSearchSection';

export default async function JobsPage() {

  return (
    <>
      {/* Top Companies Section */}
      <TopCompaniesSection showHeader={true} showViewAllCompanies={false} />

      {/* Jobs Search Section */}
      <JobsSearchSection />
    </>
  );
}
