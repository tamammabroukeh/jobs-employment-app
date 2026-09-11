import ProfileClient from "./ProfileClient";
import { jobSeekerRepository } from "@/apis/services/job-seeker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - Manage Your Profile",
  description: "Manage your personal information, skills, experience, education, and documents.",
};

export default async function ProfilePage() {
    // Fetch profile data server-side using server action
    const result = await jobSeekerRepository.getProfile();
    console.log('result', result)
    if (!result.profile) {
      console.error('[Profile Page] No profile found in response');
    }
    
    return <ProfileClient initialProfile={result.profile} initialDocuments={result.documents} />;
}
