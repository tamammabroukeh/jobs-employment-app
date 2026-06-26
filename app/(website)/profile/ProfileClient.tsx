import {
  UserInfoSection,
  EducationSection,
  ExperienceSection,
  SkillsSection,
} from "@/components/profile";
import { Typography } from "@/components/Reusable-Components";
import {
  IJobSeekerProfile,
} from "@/apis/services/job-seeker/interface";

interface ProfileClientProps {
  initialProfile: IJobSeekerProfile;
}

export default function ProfileClient({ initialProfile }: ProfileClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-5 sm:px-6 lg:px-8 py-8">
      <Typography variant="h1" className="mb-6">
        My Profile
      </Typography>

      <UserInfoSection profile={initialProfile} />

      <EducationSection educations={initialProfile.education_history || []} />

      <ExperienceSection
        experiences={initialProfile.work_experience || []}
      />

      <SkillsSection skills={initialProfile.skills || []} />
    </div>
  );
}
