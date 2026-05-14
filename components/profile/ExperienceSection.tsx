'use client';

import { useState } from 'react';
import { ReusableCard, ReusableButton, Flex, ReusableDialog } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { Experience } from '@/types/profile';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ExperienceDialog from './ExperienceDialog';

interface ExperienceSectionProps {
  experiences: Experience[];
  onAddExperience: (data: Omit<Experience, 'id'>) => void;
  onUpdateExperience: (id: string, data: Omit<Experience, 'id'>) => void;
  onDeleteExperience: (id: string) => void;
}

export default function ExperienceSection({
  experiences,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
}: ExperienceSectionProps) {
  const t = useProfileTranslations();
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>();
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);

  const handleAddExperience = () => {
    setSelectedExperience(undefined);
    setIsExperienceDialogOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsExperienceDialogOpen(true);
  };

  const handleSaveExperience = (data: Omit<Experience, 'id'>) => {
    if (selectedExperience) {
      onUpdateExperience(selectedExperience.id, data);
    } else {
      onAddExperience(data);
    }
  };

  const handleDeleteClick = (id: string) => {
    setExperienceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (experienceToDelete) {
      onDeleteExperience(experienceToDelete);
      setExperienceToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (fromDate: string, toDate?: string) => {
    const start = new Date(fromDate);
    const end = toDate ? new Date(toDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years} yr ${remainingMonths} mo`;
    } else if (years > 0) {
      return `${years} yr`;
    } else {
      return `${remainingMonths} mo`;
    }
  };

  return (
    <ReusableCard styleForCard="mb-6">
      <Flex classes="justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('experience.title')}</h2>
        <ReusableButton
          btnText={t('experience.addExperience')}
          onClick={handleAddExperience}
          variant="primary"
          icon={<PlusOutlined />}
        />
      </Flex>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{t('experience.noExperience')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <Flex classes="justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{experience.jobTitle}</h3>
                  <p className="text-gray-600">{experience.companyName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(experience.fromDate)} - {experience.isCurrentlyWorking ? t('experience.present') : formatDate(experience.toDate || '')}
                    {' • '}
                    {calculateDuration(experience.fromDate, experience.isCurrentlyWorking ? undefined : experience.toDate)}
                  </p>
                  <div className="mt-2">
                    <Flex classes="gap-2 flex-wrap">
                      {experience.jobRoles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {role}
                        </span>
                      ))}
                    </Flex>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{experience.description}</p>
                </div>

                <Flex classes="gap-2">
                  <ReusableButton
                    btnText={t('experience.edit')}
                    onClick={() => handleEditExperience(experience)}
                    variant="default"
                    icon={<EditOutlined />}
                  />
                  <ReusableButton
                    btnText={t('experience.delete')}
                    onClick={() => handleDeleteClick(experience.id)}
                    variant="default"
                    icon={<DeleteOutlined />}
                  />
                </Flex>
              </Flex>
            </div>
          ))}
        </div>
      )}

      <ExperienceDialog
        isOpen={isExperienceDialogOpen}
        setIsOpen={setIsExperienceDialogOpen}
        experience={selectedExperience}
        onSave={handleSaveExperience}
      />

      <ReusableDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        dialogHeader={{
          title: t('experience.confirmDeleteTitle'),
          description: t('experience.confirmDelete'),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t('experience.no')}
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="default"
            />
            <ReusableButton
              btnText={t('experience.yes')}
              onClick={handleConfirmDelete}
              variant="primary"
            />
          </Flex>
        }
      />
    </ReusableCard>
  );
}
