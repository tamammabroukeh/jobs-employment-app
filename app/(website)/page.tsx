import HeroSection from '@/components/home/hero/HeroSection';
import CategoriesSection from '@/components/home/categories/CategoriesSection';
import TopCompaniesSection from '@/components/home/top-companies/TopCompaniesSection';
import RecentJobsSection from '@/components/home/recent-jobs/RecentJobsSection';
import LocationsSection from '@/components/home/locations/LocationsSection';
import FeaturesSection from '@/components/home/features/FeaturesSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Portal - Find Jobs, Hire Talent, Grow Your Career',
  description: 'Discover jobs, explore top companies, and connect with skilled professionals on our jobs and employment platform.',
};

export default async function Home() {

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Top Companies Section */}
      <TopCompaniesSection />

      {/* Recent Jobs Section */}
      <RecentJobsSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Locations Section */}
      <LocationsSection />
      
      {/* Features Section */}
      <FeaturesSection />
    </>
  );
}
