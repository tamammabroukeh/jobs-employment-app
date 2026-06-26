"use client";

import { useState, useRef } from "react";
import { Avatar } from "antd";
import { UserOutlined, EditOutlined, CameraOutlined } from "@ant-design/icons";
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
import { updateCareerInfoAction, updatePersonalInfoAction, updateSocialLinksAction } from "@/apis/services/job-seeker/actions";
import { toast } from "sonner";

interface UserInfoSectionProps {
  profile: IJobSeekerProfile;
}

export default function UserInfoSection({
  profile,
}: UserInfoSectionProps) {
  const t = useProfileTranslations();
  const [isPersonalDialogOpen, setIsPersonalDialogOpen] = useState(false);
  const [isCareerDialogOpen, setIsCareerDialogOpen] = useState(false);
  const [isSocialLinksDialogOpen, setIsSocialLinksDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(profile.image);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  // Personal info handler
  const handleUpdatePersonalInfo = async (data: IUpdatePersonalInfoRequest): Promise<boolean> => {
    console.log('[ProfileClient] Updating personal info:', data);
    const result = await updatePersonalInfoAction(data);
    console.log('[ProfileClient] Personal info update result:', result);
    
    if (result.data?.success) {
      toast.success(result.data.message || 'Personal information updated successfully');
      return true;
    } else if (result.serverError) {
      toast.error(result.serverError);
      return false;
    }
    return false;
  };

  // Career info handler
  const handleUpdateCareerInfo = async (data: IUpdateCareerInfoRequest): Promise<boolean> => {
    console.log('[ProfileClient] Updating career info:', data);
    const result = await updateCareerInfoAction(data);
    console.log('[ProfileClient] Career info update result:', result);
    
    if (result.data?.success) {
      toast.success(result.data.message || 'Career information updated successfully');
      return true;
    } else if (result.serverError) {
      toast.error(result.serverError);
      return false;
    }
    return false;
  };

  // Social links handler
  const handleUpdateSocialLinks = async (data: IUpdateSocialLinksRequest): Promise<boolean> => {
    console.log('[ProfileClient] Updating social links:', data);
    const result = await updateSocialLinksAction(data);
    console.log('[ProfileClient] Social links update result:', result);
    
    if (result.data?.success) {
      toast.success(result.data.message || 'Social links updated successfully');
      return true;
    } else if (result.serverError) {
      toast.error(result.serverError);
      return false;
    }
    return false;
  };

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Compress and convert image
      const compressedBase64 = await compressImage(file);
      
      // Update the preview immediately
      setProfileImage(compressedBase64);

      // Send to API
      const result = await updatePersonalInfoAction({
        image: compressedBase64,
      });

      if (result.data?.success) {
        toast.success('Profile image updated successfully');
      } else if (result.serverError) {
        toast.error(result.serverError);
        // Revert to original image on error
        setProfileImage(profile.image);
      }
      
      setIsUploadingImage(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setProfileImage(profile.image);
      setIsUploadingImage(false);
    }

    // Clear the input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  // Compress image before upload
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate new dimensions (max 800x800 while maintaining aspect ratio)
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8); // 0.8 quality
          resolve(compressedBase64);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <ReusableCard styleForCard="mb-6">
      <Flex classes="flex-col md:flex-row gap-6">
        {/* User Avatar and Basic Info */}
        <Flex classes="flex-col items-center md:items-start gap-4 md:w-1/4">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <Avatar
              size={120}
              src={
                profileImage ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
              }
              icon={<UserOutlined />}
              className="border-4 border-primary"
            />
            {/* Camera overlay */}
            <div className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity ${isUploadingImage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {isUploadingImage ? (
                <div className="text-white text-xs">Uploading...</div>
              ) : (
                <CameraOutlined className="text-white text-2xl" />
              )}
            </div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploadingImage}
            />
          </div>
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
        onSave={handleUpdatePersonalInfo}
      />

      <CareerInfoDialog
        isOpen={isCareerDialogOpen}
        setIsOpen={setIsCareerDialogOpen}
        careerInfo={profile}
        onSave={handleUpdateCareerInfo}
      />

      <SocialLinksDialog
        isOpen={isSocialLinksDialogOpen}
        setIsOpen={setIsSocialLinksDialogOpen}
        socialLinks={profile.social_links || { linkedin: '', github: '', portfolio: '', twitter: '' }}
        onSave={handleUpdateSocialLinks}
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
