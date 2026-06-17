"use client"
import { UserInfoSection, EducationSection, ExperienceSection, SkillsSection } from '@/components/profile';
import { Typography } from '@/components/Reusable-Components';
import { IJobSeekerProfile, IEducation, IWorkExperience, ISkill, IUpdatePersonalInfoRequest, IUpdateCareerInfoRequest, IUpdateSocialLinksRequest, IUpdateEducationRequest, IUpdateWorkExperienceRequest } from '@/apis/services/job-seeker/interface';
import { updateProfileAction, updatePersonalInfoAction, updateCareerInfoAction, updateSocialLinksAction, updateSkillsAction, updateEducationAction, updateWorkExperienceAction } from '@/apis/services/job-seeker/actions';
import { toast } from 'sonner';

interface ProfileClientProps {
  initialProfile: IJobSeekerProfile;
}

export default function ProfileClient({ initialProfile }: ProfileClientProps) {

  const handleUpdateProfile = async (updatedData: Partial<IJobSeekerProfile>) => {
      // Merge the updated data with the current profile to send the complete profile
      const completeProfile = {
        ...initialProfile,
        ...updatedData,
      };
      
      console.log('Sending complete profile:', completeProfile);
      const result = await updateProfileAction(completeProfile);
      console.log('result ', result)
      if(result.data?.success){
        toast.success(result.data.message)
      }
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

  // Education handler
  const handleSaveEducation = async (education_history: IEducation[]) => {
    console.log('[ProfileClient] Updating education:', education_history);
    const result = await updateEducationAction({ education_history });
    console.log('[ProfileClient] Education update result:', result);
    
    if (result.data?.success) {
      toast.success(result.data.message || 'Education updated successfully');
    } else if (result.serverError) {
      toast.error(result.serverError);
    }
  };

  // Experience handler
  const handleSaveWorkExperience = async (work_experience: IWorkExperience[]) => {
    console.log('[ProfileClient] Updating work experience:', work_experience);
    const result = await updateWorkExperienceAction({ work_experience });
    console.log('[ProfileClient] Work experience update result:', result);
    
    if (result.data?.success) {
      toast.success(result.data.message || 'Work experience updated successfully');
    } else if (result.serverError) {
      toast.error(result.serverError);
    }
  };

  // Experience handlers (these will call handleSaveWorkExperience)
  const handleAddExperience = async (data: IWorkExperience) => {
    const updatedWorkExperience = [...initialProfile.work_experience, data];
    await handleSaveWorkExperience(updatedWorkExperience);
  };

  const handleUpdateExperience = async (index: number, data: IWorkExperience) => {
    const updatedWorkExperience = initialProfile.work_experience.map((exp, i) =>
      i === index ? data : exp
    );
    await handleSaveWorkExperience(updatedWorkExperience);
  };

  const handleDeleteExperience = async (index: number) => {
    const updatedWorkExperience = initialProfile.work_experience.filter((_, i) => i !== index);
    await handleSaveWorkExperience(updatedWorkExperience);
  };

  // Skills handler
  const handleSaveSkills = async (skills: ISkill[]) => {
    console.log('[ProfileClient] Updating skills:', skills);
    const result = await updateSkillsAction({ skills });
    console.log('[ProfileClient] Skills update result:', result);
    
    if (result.data?.success) {
      toast.success(result.data.message || 'Skills updated successfully');
    } else if (result.serverError) {
      toast.error(result.serverError);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-5 sm:px-6 lg:px-8 py-8">
      <Typography variant="h1" className="mb-6">
        My Profile
      </Typography>

      <UserInfoSection
        profile={initialProfile}
        onUpdatePersonalInfo={handleUpdatePersonalInfo}
        onUpdateCareerInfo={handleUpdateCareerInfo}
        onUpdateSocialLinks={handleUpdateSocialLinks}
      />

      <EducationSection
        educations={initialProfile.education_history || []}
        onSaveEducation={handleSaveEducation}
      />

      <ExperienceSection
        experiences={initialProfile.work_experience || []}
        onAddExperience={handleAddExperience}
        onUpdateExperience={handleUpdateExperience}
        onDeleteExperience={handleDeleteExperience}
      />

      <SkillsSection
        skills={initialProfile.skills || []}
        onSaveSkills={handleSaveSkills}
      />
    </div>
  );
}