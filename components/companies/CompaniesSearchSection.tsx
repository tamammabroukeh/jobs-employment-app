'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import CompanySearch from './CompanySearch';
import CompaniesList from './CompaniesList';

// Mock data - Replace with actual API call
const mockCompanies = [
  {
    id: '1',
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    rating: 4.5,
    reviewsCount: 1250,
    openJobs: 45,
    location: 'Mountain View, CA',
    companySize: { min: 100, max: 500, isPlus: false },
    description: 'Google is a multinational technology company that specializes in Internet-related services and products, including search, cloud computing, and advertising technologies.',
  },
  {
    id: '2',
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    rating: 4.3,
    reviewsCount: 980,
    openJobs: 38,
    location: 'Redmond, WA',
    companySize: { min: 500, isPlus: true },
    description: 'Microsoft is a leading technology company that develops, manufactures, licenses, and supports a wide range of software products, services, and devices.',
  },
  {
    id: '3',
    name: 'Apple',
    logo: 'https://logo.clearbit.com/apple.com',
    rating: 4.7,
    reviewsCount: 1500,
    openJobs: 52,
    location: 'Cupertino, CA',
    companySize: { min: 500, isPlus: true },
    description: 'Apple is a technology company that designs, develops, and sells consumer electronics, computer software, and online services.',
  },
  {
    id: '4',
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    rating: 4.2,
    reviewsCount: 2100,
    openJobs: 120,
    location: 'Seattle, WA',
    companySize: { min: 500, isPlus: true },
    description: 'Amazon is a multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
  },
  {
    id: '5',
    name: 'Meta',
    logo: 'https://logo.clearbit.com/meta.com',
    rating: 4.1,
    reviewsCount: 850,
    openJobs: 35,
    location: 'Menlo Park, CA',
    companySize: { min: 500, isPlus: true },
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses through social media and virtual reality platforms.',
  },
  {
    id: '6',
    name: 'Netflix',
    logo: 'https://logo.clearbit.com/netflix.com',
    rating: 4.4,
    reviewsCount: 720,
    openJobs: 28,
    location: 'Los Gatos, CA',
    companySize: { min: 100, max: 500, isPlus: false },
    description: 'Netflix is a streaming entertainment service offering a wide variety of TV shows, movies, documentaries, and more on internet-connected devices.',
  },
  {
    id: '7',
    name: 'Tesla',
    logo: 'https://logo.clearbit.com/tesla.com',
    rating: 4.0,
    reviewsCount: 650,
    openJobs: 42,
    location: 'Austin, TX',
    companySize: { min: 500, isPlus: true },
    description: 'Tesla designs, develops, manufactures, and sells electric vehicles, battery energy storage, and solar energy generation systems.',
  },
  {
    id: '8',
    name: 'Spotify',
    logo: 'https://logo.clearbit.com/spotify.com',
    rating: 4.3,
    reviewsCount: 540,
    openJobs: 25,
    location: 'New York, NY',
    companySize: { min: 100, max: 500, isPlus: false },
    description: 'Spotify is a digital music, podcast, and video streaming service that gives access to millions of songs and other content from creators worldwide.',
  },
  {
    id: '9',
    name: 'Adobe',
    logo: 'https://logo.clearbit.com/adobe.com',
    rating: 4.4,
    reviewsCount: 890,
    openJobs: 32,
    location: 'San Jose, CA',
    companySize: { min: 100, max: 500, isPlus: false },
    description: 'Adobe is a software company that creates multimedia and creativity software products, with a focus on digital media and marketing solutions.',
  },
  {
    id: '10',
    name: 'Salesforce',
    logo: 'https://logo.clearbit.com/salesforce.com',
    rating: 4.2,
    reviewsCount: 1100,
    openJobs: 48,
    location: 'San Francisco, CA',
    companySize: { min: 500, isPlus: true },
    description: 'Salesforce is a cloud-based software company that provides customer relationship management (CRM) service and enterprise applications.',
  },
  {
    id: '11',
    name: 'IBM',
    logo: 'https://logo.clearbit.com/ibm.com',
    rating: 4.0,
    reviewsCount: 1350,
    openJobs: 55,
    location: 'Armonk, NY',
    companySize: { min: 500, isPlus: true },
    description: 'IBM is a multinational technology company that provides hardware, software, cloud-based services, and cognitive computing solutions.',
  },
  {
    id: '12',
    name: 'Oracle',
    logo: 'https://logo.clearbit.com/oracle.com',
    rating: 3.9,
    reviewsCount: 920,
    openJobs: 40,
    location: 'Austin, TX',
    companySize: { min: 500, isPlus: true },
    description: 'Oracle is a computer technology corporation that specializes in developing and marketing database software, cloud solutions, and enterprise software.',
  },
  {
    id: '13',
    name: 'Uber',
    logo: 'https://logo.clearbit.com/uber.com',
    rating: 4.1,
    reviewsCount: 780,
    openJobs: 36,
    location: 'San Francisco, CA',
    companySize: { min: 500, isPlus: true },
    description: 'Uber is a technology platform that connects riders with drivers, and offers food delivery, freight transportation, and other services.',
  },
  {
    id: '14',
    name: 'Airbnb',
    logo: 'https://logo.clearbit.com/airbnb.com',
    rating: 4.3,
    reviewsCount: 690,
    openJobs: 30,
    location: 'San Francisco, CA',
    companySize: { min: 100, max: 500, isPlus: false },
    description: 'Airbnb is an online marketplace that connects people who want to rent out their homes with people looking for accommodations in specific locales.',
  },
  {
    id: '15',
    name: 'LinkedIn',
    logo: 'https://logo.clearbit.com/linkedin.com',
    rating: 4.2,
    reviewsCount: 810,
    openJobs: 33,
    location: 'Sunnyvale, CA',
    companySize: { min: 500, isPlus: true },
    description: 'LinkedIn is a professional networking platform that connects professionals worldwide and helps them be more productive and successful.',
  },
];

export default function CompaniesSearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Input */}
        <CompanySearch value={searchQuery} onChange={setSearchQuery} />

        {/* Companies List */}
        <CompaniesList companies={mockCompanies} searchQuery={debouncedSearch} />
      </div>
    </section>
  );
}
