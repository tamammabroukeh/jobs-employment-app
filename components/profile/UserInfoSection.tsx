"use client";

import { useState } from "react";
import { Avatar } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import {
  ReusableCard,
  ReusableButton,
  Flex,
} from "@/components/Reusable-Components";
import { useProfileTranslations } from "@/hooks/use-profile";
import { IJobSeekerProfile, IUpdatePersonalInfoRequest, IUpdateCareerInfoRequest, IUpdateSocialLinksRequest } from "@/apis/services/job-seeker/interface";
import PersonalInfoDialog from "./PersonalInfoDialog";
import CareerInfoDialog from "./CareerInfoDialog";
import SocialLinksDialog from "./SocialLinksDialog";

interface UserInfoSectionProps {
  profile: IJobSeekerProfile;
  onUpdatePersonalInfo: (data: IUpdatePersonalInfoRequest) => Promise<boolean>;
  onUpdateCareerInfo: (data: IUpdateCareerInfoRequest) => Promise<boolean>;
  onUpdateSocialLinks: (data: IUpdateSocialLinksRequest) => Promise<boolean>;
}

export default function UserInfoSection({
  profile,
  onUpdatePersonalInfo,
  onUpdateCareerInfo,
  onUpdateSocialLinks,
}: UserInfoSectionProps) {
  const t = useProfileTranslations();
  const [isPersonalDialogOpen, setIsPersonalDialogOpen] = useState(false);
  const [isCareerDialogOpen, setIsCareerDialogOpen] = useState(false);
  const [isSocialLinksDialogOpen, setIsSocialLinksDialogOpen] = useState(false);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
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
            src={
              profile.image ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
            }
            icon={<UserOutlined />}
            className="border-4 border-primary"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            <p className="text-gray-500">{profile.location}</p>
          </div>
        </Flex>

        {/* Personal Information */}
        <div className="flex-1">
          <Flex classes="justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {t("userInfo.personalInfo.title")}
            </h3>
            <ReusableButton
              btnText={t("userInfo.personalInfo.edit")}
              onClick={() => setIsPersonalDialogOpen(true)}
              variant="default"
              icon={<EditOutlined />}
            />
          </Flex>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.date_of_birth && (
              <InfoItem
                label={t("userInfo.personalInfo.age")}
                value={`${calculateAge(profile.date_of_birth)} ${t("userInfo.personalInfo.years")}`}
              />
            )}
            {profile.nationality && (
              <InfoItem
                label={t("userInfo.personalInfo.nationality")}
                value={profile.nationality}
              />
            )}
            {profile.gender && (
              <InfoItem
                label={t("userInfo.personalInfo.gender")}
                value={t(`genderOptions.${profile.gender}`)}
              />
            )}
            {profile.marital_status && (
              <InfoItem
                label={t("userInfo.personalInfo.maritalStatus")}
                value={t(`maritalStatusOptions.${profile.marital_status}`)}
              />
            )}
          </div>
        </div>

        {/* Career Information */}
        <div className="flex-1">
          <Flex classes="justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {t("userInfo.careerInfo.title")}
            </h3>
            <ReusableButton
              btnText={t("userInfo.careerInfo.edit")}
              onClick={() => setIsCareerDialogOpen(true)}
              variant="default"
              icon={<EditOutlined />}
            />
          </Flex>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.years_of_experience && (
              <InfoItem
                label={t("userInfo.careerInfo.experience")}
                value={`${profile.years_of_experience} ${t("userInfo.personalInfo.years")}`}
              />
            )}
            {profile.job_level && (
              <InfoItem
                label={t("userInfo.careerInfo.jobLevel")}
                value={t(`jobLevelOptions.${profile.job_level}`)}
              />
            )}
            {profile.education_level && (
              <InfoItem
                label={t("userInfo.careerInfo.education")}
                value={t(`educationLevelOptions.${profile.education_level}`)}
              />
            )}
            {profile.current_job_status && (
              <InfoItem
                label={t("userInfo.careerInfo.currentJobStatus")}
                value={t(`jobStatusOptions.${profile.current_job_status}`)}
              />
            )}
          </div>
        </div>
      </Flex>

      {/* Contact Information */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-xl font-semibold mb-4">
          {t("userInfo.contactInfo.title")}
        </h3>
        <Flex classes="gap-6 flex-wrap">
          {profile.email && <InfoItem label={t("userInfo.contactInfo.email")} value={profile.email} />}
          {profile.phone && (
            <InfoItem
              label={t("userInfo.contactInfo.phone")}
              value={profile.phone}
            />
          )}
        </Flex>
      </div>

      {/* Social Links */}
      <div className="mt-6 pt-6 border-t">
        <Flex classes="justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {t("userInfo.socialLinks.title")}
          </h3>
          <ReusableButton
            btnText={t("userInfo.socialLinks.edit")}
            onClick={() => setIsSocialLinksDialogOpen(true)}
            variant="default"
            icon={<EditOutlined />}
          />
        </Flex>
        <Flex classes="gap-6 flex-wrap">
          {profile.social_links?.linkedin && (
            <SocialLink
              label={t("userInfo.socialLinks.linkedin")}
              url={profile.social_links.linkedin}
            />
          )}
          {profile.social_links?.github && (
            <SocialLink
              label={t("userInfo.socialLinks.github")}
              url={profile.social_links.github}
            />
          )}
          {profile.social_links?.portfolio && (
            <SocialLink
              label={t("userInfo.socialLinks.portfolio")}
              url={profile.social_links.portfolio}
            />
          )}
          {profile.social_links?.twitter && (
            <SocialLink
              label={t("userInfo.socialLinks.twitter")}
              url={profile.social_links.twitter}
            />
          )}
        </Flex>
      </div>

      {/* Dialogs */}
      <PersonalInfoDialog
        isOpen={isPersonalDialogOpen}
        setIsOpen={setIsPersonalDialogOpen}
        personalInfo={profile}
        onSave={onUpdatePersonalInfo}
      />

      <CareerInfoDialog
        isOpen={isCareerDialogOpen}
        setIsOpen={setIsCareerDialogOpen}
        careerInfo={profile}
        onSave={onUpdateCareerInfo}
      />

      <SocialLinksDialog
        isOpen={isSocialLinksDialogOpen}
        setIsOpen={setIsSocialLinksDialogOpen}
        socialLinks={profile.social_links || { linkedin: '', github: '', portfolio: '', twitter: '' }}
        onSave={onUpdateSocialLinks}
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
