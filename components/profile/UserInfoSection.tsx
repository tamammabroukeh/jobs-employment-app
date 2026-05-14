'use client';

import { useState } from 'react';
import { Avatar } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { ReusableCard, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { UserProfile } from '@/types/profile';
import PersonalInfoDialog from './PersonalInfoDialog';
import CareerInfoDialog from './CareerInfoDialog';

interface UserInfoSectionProps {
  profile: UserProfile;
  onUpdatePersonalInfo: (data: UserProfile['personalInfo']) => void;
  onUpdateCareerInfo: (data: UserProfile['careerInfo']) => void;
}

export default function UserInfoSection({ 
  profile, 
  onUpdatePersonalInfo,
  onUpdateCareerInfo 
}: UserInfoSectionProps) {
  const t = useProfileTranslations();
  const [isPersonalDialogOpen, setIsPersonalDialogOpen] = useState(false);
  const [isCareerDialogOpen, setIsCareerDialogOpen] = useState(false);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <ReusableCard styleForCard="mb-6">
      <Flex classes="flex-col md:flex-row gap-6">
        {/* User Avatar and Basic Info */}
        <Flex classes="flex-col items-center md:items-start gap-4 md:w-1/4">
          <Avatar 
            size={120} 
            src={profile.image} 
            icon={<UserOutlined />}
            className="border-4 border-primary"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-500">{profile.location}</p>
          </div>
        </Flex>

        {/* Personal Information */}
        <div className="flex-1">
          <Flex classes="justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{t('userInfo.personalInfo.title')}</h3>
            <ReusableButton
              btnText={t('userInfo.personalInfo.edit')}
              onClick={() => setIsPersonalDialogOpen(true)}
              variant="default"
              icon={<EditOutlined />}
            />
          </Flex>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              label={t('userInfo.personalInfo.age')} 
              value={`${calculateAge(profile.personalInfo.dateOfBirth)} ${t('userInfo.personalInfo.years')}`} 
            />
            <InfoItem 
              label={t('userInfo.personalInfo.nationality')} 
              value={profile.personalInfo.nationality} 
            />
            <InfoItem 
              label={t('userInfo.personalInfo.gender')} 
              value={t(`genderOptions.${profile.personalInfo.gender}`)} 
            />
            <InfoItem 
              label={t('userInfo.personalInfo.maritalStatus')} 
              value={t(`maritalStatusOptions.${profile.personalInfo.maritalStatus}`)} 
            />
          </div>
        </div>

        {/* Career Information */}
        <div className="flex-1">
          <Flex classes="justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{t('userInfo.careerInfo.title')}</h3>
            <ReusableButton
              btnText={t('userInfo.careerInfo.edit')}
              onClick={() => setIsCareerDialogOpen(true)}
              variant="default"
              icon={<EditOutlined />}
            />
          </Flex>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              label={t('userInfo.careerInfo.experience')} 
              value={`${profile.careerInfo.experienceYears} ${t('userInfo.personalInfo.years')}`} 
            />
            <InfoItem 
              label={t('userInfo.careerInfo.jobLevel')} 
              value={t(`jobLevelOptions.${profile.careerInfo.jobLevel}`)} 
            />
            <InfoItem 
              label={t('userInfo.careerInfo.education')} 
              value={t(`educationLevelOptions.${profile.careerInfo.educationLevel}`)} 
            />
            <InfoItem 
              label={t('userInfo.careerInfo.currentJobStatus')} 
              value={t(`jobStatusOptions.${profile.careerInfo.currentJobStatus}`)} 
            />
          </div>
        </div>
      </Flex>

      {/* Contact Information */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-xl font-semibold mb-4">{t('userInfo.contactInfo.title')}</h3>
        <Flex classes="gap-6 flex-wrap">
          <InfoItem 
            label={t('userInfo.contactInfo.email')} 
            value={profile.personalInfo.email} 
          />
          <InfoItem 
            label={t('userInfo.contactInfo.phone')} 
            value={profile.personalInfo.phone} 
          />
        </Flex>
      </div>

      {/* Social Links */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-xl font-semibold mb-4">{t('userInfo.socialLinks.title')}</h3>
        <Flex classes="gap-6 flex-wrap">
          {profile.socialLinks.linkedin && (
            <SocialLink 
              label={t('userInfo.socialLinks.linkedin')} 
              url={profile.socialLinks.linkedin} 
            />
          )}
          {profile.socialLinks.github && (
            <SocialLink 
              label={t('userInfo.socialLinks.github')} 
              url={profile.socialLinks.github} 
            />
          )}
          {profile.socialLinks.portfolio && (
            <SocialLink 
              label={t('userInfo.socialLinks.portfolio')} 
              url={profile.socialLinks.portfolio} 
            />
          )}
          {profile.socialLinks.twitter && (
            <SocialLink 
              label={t('userInfo.socialLinks.twitter')} 
              url={profile.socialLinks.twitter} 
            />
          )}
        </Flex>
      </div>

      {/* Dialogs */}
      <PersonalInfoDialog
        isOpen={isPersonalDialogOpen}
        setIsOpen={setIsPersonalDialogOpen}
        personalInfo={profile.personalInfo}
        onSave={onUpdatePersonalInfo}
      />

      <CareerInfoDialog
        isOpen={isCareerDialogOpen}
        setIsOpen={setIsCareerDialogOpen}
        careerInfo={profile.careerInfo}
        onSave={onUpdateCareerInfo}
      />
    </ReusableCard>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function SocialLink({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="font-medium text-primary hover:underline"
      >
        {url}
      </a>
    </div>
  );
}
