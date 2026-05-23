'use client';

import { useState, useRef, useEffect } from 'react';
import { UserInfoSection, EducationSection, ExperienceSection, SkillsSection } from '@/components/profile';
import { UserProfile, PersonalInfo, CareerInfo, Education, Experience, Skill } from '@/types/profile';
import { Typography } from '@/components/Reusable-Components';

// Mock data - replace with actual API call
const mockProfile: UserProfile = {
  id: '1',
  image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  name: 'John Doe',
  location: 'New York, USA',
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    nationality: 'American',
    city: 'New York',
    address: '123 Main Street, Apt 4B',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    maritalStatus: 'single',
  },
  careerInfo: {
    salaryRangeFrom: 80000,
    salaryRangeTo: 120000,
    currentJobStatus: 'employed',
    experienceYears: 5,
    educationLevel: 'bachelor',
    jobLevel: 'mid',
    jobTypes: ['full-time', 'remote'],
    jobRoles: ['frontend', 'fullstack'],
    workCities: ['new-york', 'remote'],
  },
  educations: [
    {
      id: '1',
      certificateType: 'bachelor',
      university: 'harvard',
      faculty: 'engineering',
      major: 'computer-science',
      majorName: 'Computer Science',
      grade: 'excellent',
      fromDate: '2015-09',
      awardedDate: '2019-06',
    },
  ],
  experiences: [
    {
      id: '1',
      jobTitle: 'senior-software-engineer',
      companyName: 'Tech Corp',
      jobRoles: ['frontend', 'team-lead'],
      fromDate: '2020-01',
      toDate: '',
      isCurrentlyWorking: true,
      description: 'Leading a team of 5 developers, building scalable web applications using React and Node.js.',
    },
  ],
  skills: [
    {
      id: '1',
      name: 'React',
      level: 'expert',
    },
    {
      id: '2',
      name: 'TypeScript',
      level: 'advanced',
    },
    {
      id: '3',
      name: 'Node.js',
      level: 'advanced',
    },
    {
      id: '4',
      name: 'Next.js',
      level: 'intermediate',
    },
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev',
    twitter: 'https://twitter.com/johndoe',
  },
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);

  const handleUpdatePersonalInfo = (data: PersonalInfo) => {
    setProfile((prev) => ({
      ...prev,
      personalInfo: data,
      name: `${data.firstName} ${data.lastName}`,
    }));
    console.log('Updating personal info:', data);
  };

  const handleUpdateCareerInfo = (data: CareerInfo) => {
    setProfile((prev) => ({
      ...prev,
      careerInfo: data,
    }));
    console.log('Updating career info:', data);
  };

  const handleAddEducation = (data: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      ...data,
      id: Date.now().toString(),
    };
    setProfile((prev) => ({
      ...prev,
      educations: [...prev.educations, newEducation],
    }));
    console.log('Adding education:', newEducation);
  };

  const handleUpdateEducation = (id: string, data: Omit<Education, 'id'>) => {
    setProfile((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) =>
        edu.id === id ? { ...data, id } : edu
      ),
    }));
    console.log('Updating education:', id, data);
  };

  const handleDeleteEducation = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      educations: prev.educations.filter((edu) => edu.id !== id),
    }));
    console.log('Deleting education:', id);
  };

  const handleUploadCertificate = (id: string, imageUrl: string) => {
    setProfile((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) =>
        edu.id === id ? { ...edu, certificateImage: imageUrl } : edu
      ),
    }));
    console.log('Uploading certificate for education:', id);
  };

  const handleAddExperience = (data: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...data,
      id: Date.now().toString(),
    };
    setProfile((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
    console.log('Adding experience:', newExperience);
  };

  const handleUpdateExperience = (id: string, data: Omit<Experience, 'id'>) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...data, id } : exp
      ),
    }));
    console.log('Updating experience:', id, data);
  };

  const handleDeleteExperience = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
    console.log('Deleting experience:', id);
  };

  const handleSaveSkills = (skills: Skill[]) => {
    setProfile((prev) => ({
      ...prev,
      skills,
    }));
    console.log('Saving skills:', skills);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Typography variant="h1" className="mb-6">
        My Profile
      </Typography>

      <UserInfoSection
        profile={profile}
        onUpdatePersonalInfo={handleUpdatePersonalInfo}
        onUpdateCareerInfo={handleUpdateCareerInfo}
      />

      <EducationSection
        educations={profile.educations}
        onAddEducation={handleAddEducation}
        onUpdateEducation={handleUpdateEducation}
        onDeleteEducation={handleDeleteEducation}
        onUploadCertificate={handleUploadCertificate}
      />

      <ExperienceSection
        experiences={profile.experiences}
        onAddExperience={handleAddExperience}
        onUpdateExperience={handleUpdateExperience}
        onDeleteExperience={handleDeleteExperience}
      />

      <SkillsSection
        skills={profile.skills}
        onSaveSkills={handleSaveSkills}
      />
    </div>
  );
}
