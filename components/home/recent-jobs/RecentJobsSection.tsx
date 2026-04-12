import { getTranslations } from '@/lib/get-translations';
import { Typography, ReusableButton } from '@/components/Reusable-Components';
import Link from 'next/link';
import JobCard from './JobCard';
import ROUTES from '@/constants/routes';

// Mock data - Replace with actual API call
const mockJobs = [
  {
    id: '1',
    displayId: 'JOB-001',
    companyName: 'Google',
    companyLogo: 'https://logo.clearbit.com/google.com',
    title: 'Senior Frontend Developer',
    createdAt: '2024-01-15',
    roles: ['Frontend', 'React'],
    types: ['Full-time', 'Remote'],
    levels: ['Senior'],
    experience: '5+ years',
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    displayId: 'JOB-002',
    companyName: 'Microsoft',
    companyLogo: 'https://logo.clearbit.com/microsoft.com',
    title: 'Backend Engineer',
    createdAt: '2024-01-14',
    roles: ['Backend', 'Node.js'],
    types: ['Full-time', 'Hybrid'],
    levels: ['Mid-level'],
    experience: '3-5 years',
    location: 'Seattle, WA',
  },
  {
    id: '3',
    displayId: 'JOB-003',
    companyName: 'Apple',
    companyLogo: 'https://logo.clearbit.com/apple.com',
    title: 'iOS Developer',
    createdAt: '2024-01-13',
    roles: ['Mobile', 'iOS'],
    types: ['Full-time', 'On-site'],
    levels: ['Senior'],
    experience: '4+ years',
    location: 'Cupertino, CA',
  },
  {
    id: '4',
    displayId: 'JOB-004',
    companyName: 'Amazon',
    companyLogo: 'https://logo.clearbit.com/amazon.com',
    title: 'DevOps Engineer',
    createdAt: '2024-01-12',
    roles: ['DevOps', 'AWS'],
    types: ['Full-time', 'Remote'],
    levels: ['Mid-level'],
    experience: '3+ years',
    location: 'Austin, TX',
  },
  {
    id: '5',
    displayId: 'JOB-005',
    companyName: 'Meta',
    companyLogo: 'https://logo.clearbit.com/meta.com',
    title: 'Full Stack Developer',
    createdAt: '2024-01-11',
    roles: ['Full Stack', 'React', 'Node.js'],
    types: ['Full-time', 'Hybrid'],
    levels: ['Senior'],
    experience: '5+ years',
    location: 'Menlo Park, CA',
  },
  {
    id: '6',
    displayId: 'JOB-006',
    companyName: 'Netflix',
    companyLogo: 'https://logo.clearbit.com/netflix.com',
    title: 'Data Engineer',
    createdAt: '2024-01-10',
    roles: ['Data', 'Python'],
    types: ['Full-time', 'Remote'],
    levels: ['Mid-level'],
    experience: '3-5 years',
    location: 'Los Gatos, CA',
  },
  {
    id: '7',
    displayId: 'JOB-006',
    companyName: 'Netflix',
    companyLogo: 'https://logo.clearbit.com/netflix.com',
    title: 'Data Engineer',
    createdAt: '2024-01-10',
    roles: ['Data', 'Python'],
    types: ['Full-time', 'Remote'],
    levels: ['Mid-level'],
    experience: '3-5 years',
    location: 'Los Gatos, CA',
  },
  {
    id: '8',
    displayId: 'JOB-006',
    companyName: 'Netflix',
    companyLogo: 'https://logo.clearbit.com/netflix.com',
    title: 'Data Engineer',
    createdAt: '2024-01-10',
    roles: ['Data', 'Python'],
    types: ['Full-time', 'Remote'],
    levels: ['Mid-level'],
    experience: '3-5 years',
    location: 'Los Gatos, CA',
  },
  {
    id: '9',
    displayId: 'JOB-006',
    companyName: 'Netflix',
    companyLogo: 'https://logo.clearbit.com/netflix.com',
    title: 'Data Engineer',
    createdAt: '2024-01-10',
    roles: ['Data', 'Python'],
    types: ['Full-time', 'Remote'],
    levels: ['Mid-level'],
    experience: '3-5 years',
    location: 'Los Gatos, CA',
  },
];

export default async function RecentJobsSection() {
  const t = await getTranslations('home.recentJobs');

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="text-foreground mb-4">
            {t('title')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </Typography>
        </div>
        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              displayId={job.displayId}
              companyName={job.companyName}
              companyLogo={job.companyLogo}
              title={job.title}
              createdAt={job.createdAt}
              roles={job.roles}
              types={job.types}
              levels={job.levels}
              experience={job.experience}
              location={job.location}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href={`${ROUTES.JOB.LIST}`}>
            <ReusableButton
              variant="primary"
              size="large"
              className="px-8"
            >
              {t('viewAll')}
              <i className="fa-solid fa-arrow-right ml-2" />
            </ReusableButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
