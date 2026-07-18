import {
  UserInfoSection,
  EducationSection,
  ExperienceSection,
  SkillsSection,
  DocumentsSection,
} from "@/components/profile";
import { Typography } from "@/components/Reusable-Components";
import {
  IJobSeekerProfile,
  IJobSeekerDocuments,
} from "@/apis/services/job-seeker/interface";

interface ProfileClientProps {
  initialProfile: IJobSeekerProfile;
  initialDocuments: IJobSeekerDocuments;
}

export default function ProfileClient({ initialProfile, initialDocuments }: ProfileClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-5 sm:px-6 lg:px-8 py-8">
      <Typography variant="h1" className="mb-6">
        My Profile
      </Typography>

      <UserInfoSection profile={initialProfile} />

      <DocumentsSection documents={initialDocuments} />

      <EducationSection educations={initialProfile.education_history || []} />

      <ExperienceSection
        experiences={initialProfile.work_experience || []}
      />

      <SkillsSection skills={initialProfile.skills || []} />
    </div>
  );
}
