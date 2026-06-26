'use client';

import { useState } from 'react';
import { ReusableCard, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { ISkill } from '@/apis/services/job-seeker/interface';
import { EditOutlined } from '@ant-design/icons';
import SkillsDialog from './SkillsDialog';
import { updateSkillsAction } from '@/apis/services/job-seeker/actions';
import { toast } from 'sonner';

interface SkillsSectionProps {
  skills: ISkill[];
}

export default function SkillsSection({
  skills,
}: SkillsSectionProps) {
  const t = useProfileTranslations();
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);

  const handleEditSkills = () => {
    setIsSkillsDialogOpen(true);
  };

  // Skills handler
  const handleSaveSkills = async (skills: ISkill[]): Promise<boolean> => {
    console.log("[SkillsSection] Updating skills:", skills);
    const result = await updateSkillsAction({ skills });
    console.log("[SkillsSection] Skills update result:", result);

    if (result.data?.success) {
      toast.success(result.data.message || "Skills updated successfully");
      return true;
    } else if (result.serverError) {
      toast.error(result.serverError);
      return false;
    }
    return false;
  };
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-700';
      case 'intermediate':
        return 'bg-green-100 text-green-700';
      case 'advanced':
        return 'bg-orange-100 text-orange-700';
      case 'expert':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <ReusableCard styleForCard="mb-6">
      <Flex classes="justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('skills.title')}</h2>
        <ReusableButton
          btnText={t('skills.editSkills')}
          onClick={handleEditSkills}
          variant="primary"
          icon={<EditOutlined />}
        />
      </Flex>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{t('skills.noSkills')}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="font-medium">{skill.name}</span>
              <span className={`px-2 py-1 rounded text-xs ${getSkillLevelColor(skill.level)}`}>
                {t(`skillLevels.${skill.level}`)}
              </span>
            </div>
          ))}
        </div>
      )}

      <SkillsDialog
        isOpen={isSkillsDialogOpen}
        setIsOpen={setIsSkillsDialogOpen}
        skills={skills}
        onSave={handleSaveSkills}
      />
    </ReusableCard>
  );
}
