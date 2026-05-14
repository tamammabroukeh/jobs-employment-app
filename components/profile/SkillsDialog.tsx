'use client';

import { useState } from 'react';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { Skill } from '@/types/profile';
import { Form, Input, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface SkillsDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  skills: Skill[];
  onSave: (skills: Skill[]) => void;
}

export default function SkillsDialog({
  isOpen,
  setIsOpen,
  skills,
  onSave,
}: SkillsDialogProps) {
  const t = useProfileTranslations();
  const [localSkills, setLocalSkills] = useState<Skill[]>(skills);

  const skillLevelOptions = [
    { label: t('skillLevels.beginner'), value: 'beginner' },
    { label: t('skillLevels.intermediate'), value: 'intermediate' },
    { label: t('skillLevels.advanced'), value: 'advanced' },
    { label: t('skillLevels.expert'), value: 'expert' },
  ];

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'beginner',
    };
    setLocalSkills([...localSkills, newSkill]);
  };

  const handleDeleteSkill = (id: string) => {
    setLocalSkills(localSkills.filter((skill) => skill.id !== id));
  };

  const handleSkillChange = (id: string, field: 'name' | 'level', value: string) => {
    setLocalSkills(
      localSkills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const handleSave = () => {
    // Filter out skills with empty names
    const validSkills = localSkills.filter((skill) => skill.name.trim() !== '');
    onSave(validSkills);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSkills(skills);
    setIsOpen(false);
  };

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('skills.cancel')}
        onClick={handleCancel}
        variant="default"
      />
      <ReusableButton
        btnText={t('skills.save')}
        onClick={handleSave}
        variant="primary"
      />
    </Flex>
  );

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t('skills.editSkills'),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-3xl"
      dialogBody={
        <div className="mt-4">
          <Form layout="vertical">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {localSkills.map((skill, index) => (
                <div key={skill.id} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Form.Item
                      label={index === 0 ? t('skills.skillName') : ''}
                      className="mb-0"
                    >
                      <Input
                        value={skill.name}
                        onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                        placeholder={t('skills.skillName')}
                      />
                    </Form.Item>

                    <Form.Item
                      label={index === 0 ? t('skills.skillLevel') : ''}
                      className="mb-0"
                    >
                      <Select
                        value={skill.level}
                        onChange={(value) => handleSkillChange(skill.id, 'level', value)}
                        options={skillLevelOptions}
                        placeholder={t('skills.skillLevel')}
                      />
                    </Form.Item>
                  </div>

                  <ReusableButton
                    btnText=""
                    onClick={() => handleDeleteSkill(skill.id)}
                    variant="default"
                    icon={<DeleteOutlined />}
                    className={index === 0 ? 'mt-8' : ''}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <ReusableButton
                btnText={t('skills.addSkill')}
                onClick={handleAddSkill}
                variant="default"
                icon={<PlusOutlined />}
              />
            </div>
          </Form>
        </div>
      }
    />
  );
}
