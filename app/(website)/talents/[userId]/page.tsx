import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTalentByIdAction } from '@/apis/services/talents/actions';
import TalentProfileView from '@/components/talents/TalentProfileView';

interface TalentDetailPageProps {
  params: {
    userId: string;
  };
}

export async function generateMetadata({ params }: TalentDetailPageProps): Promise<Metadata> {
  try {
    const result = await getTalentByIdAction(params.userId);
    const talentName = result.data.user.profile.ai_full_name || result.data.user.name;
    
    return {
      title: `${talentName} - Talent Profile`,
      description: result.data.user.profile.ai_summary || `View ${talentName}'s professional profile and experience.`,
    };
  } catch (error) {
    return {
      title: 'Talent Profile',
      description: 'View talent professional profile and experience.',
    };
  }
}

export default async function TalentDetailPage({ params }: TalentDetailPageProps) {
  try {
    const result = await getTalentByIdAction(params.userId);
    console.log("result", result);
    if (!result.success || !result.data) {
      notFound();
    }

    return <TalentProfileView talentData={result.data} />;
  } catch (error) {
    console.error('Error loading talent detail:', error);
    notFound();
  }
}
