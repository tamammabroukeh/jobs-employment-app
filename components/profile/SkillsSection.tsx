'use client';

import { useState } from 'react';
import { ReusableCard, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { Skill } from '@/types/profile';
import { EditOutlined } from '@ant-design/icons';
import SkillsDialog from './SkillsDialog';

interface SkillsSectionProps {
  skills: Skill[];
  onSaveSkills: (skills: Skill[]) => void;
}

export default function SkillsSection({
  skills,
  onSaveSkills,
}: SkillsSectionProps) {
  const t = useProfileTranslations();
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);

  const handleEditSkills = () => {
    setIsSkillsDialogOpen(true);
  };

  const handleSaveSkills = async (updatedSkills: Skill[]) => {
    try {
      console.log('Saving skills to API:', updatedSkills);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/profile/skills', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ skills: updatedSkills }),
      // });
      // if (!response.ok) throw new Error('Failed to save skills');
      
      onSaveSkills(updatedSkills);
    } catch (error) {
      console.error('Error saving skills:', error);
    }
  };

  const getSkillLevelColor = (level: Skill['level']) => {
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
          {skills.map((skill) => (
            <div
              key={skill.id}
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
