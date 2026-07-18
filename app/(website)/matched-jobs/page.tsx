import MatchedJobsSection from '@/components/jobs/MatchedJobsSection';
import { Typography } from '@/components/Reusable-Components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matched Jobs - Find Your Perfect Match',
  description: 'Discover jobs tailored to your skills, experience, and preferences with our smart matching algorithm.',
};

export default function MatchedJobsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <i className="fa-solid fa-bullseye text-3xl text-primary" />
            </div>
            <Typography variant="h1" className="text-foreground mb-4">
              Your Matched Jobs
            </Typography>
            <Typography variant="p" className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Jobs ranked by how well they match your profile. Match scores are based on your skills, location, experience level, and job preferences.
            </Typography>
          </div>
        </div>
      </section>

      {/* Matched Jobs Section */}
      <MatchedJobsSection />
    </div>
  );
}
