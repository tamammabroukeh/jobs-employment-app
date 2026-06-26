'use client';

import { useState } from 'react';
import { ReusableCard, ReusableButton, Flex, ReusableDialog } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { IWorkExperience } from '@/apis/services/job-seeker/interface';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import { updateWorkExperienceAction } from '@/apis/services/job-seeker/actions';
import ExperienceDialog from './ExperienceDialog';

interface ExperienceSectionProps {
  experiences: IWorkExperience[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  const t = useProfileTranslations();
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<{ index: number; experience: IWorkExperience } | undefined>();
  const [experienceToDelete, setExperienceToDelete] = useState<number | null>(null);

  // Experience handler - calls the API to update work experience
  const handleSaveWorkExperience = async (work_experience: IWorkExperience[]) => {
    console.log('[ExperienceSection] Updating work experience:', work_experience);
    const result = await updateWorkExperienceAction({ work_experience });
    console.log('[ExperienceSection] Work experience update result:', result);

    if (result.data?.success) {
      toast.success(result.data.message || 'Work experience updated successfully');
      return true;
    } else if (result.serverError) {
      toast.error(result.serverError);
      return false;
    }
    return false;
  };

  const handleAddExperience = async (data: IWorkExperience) => {
    const updatedWorkExperience = [...experiences, data];
    const success = await handleSaveWorkExperience(updatedWorkExperience);
    if (success) {
      setIsExperienceDialogOpen(false);
    }
  };

  const handleUpdateExperience = async (index: number, data: IWorkExperience) => {
    const updatedWorkExperience = experiences.map((exp, i) => (i === index ? data : exp));
    const success = await handleSaveWorkExperience(updatedWorkExperience);
    if (success) {
      setIsExperienceDialogOpen(false);
    }
  };

  const handleDeleteExperience = async (index: number) => {
    const updatedWorkExperience = experiences.filter((_, i) => i !== index);
    const success = await handleSaveWorkExperience(updatedWorkExperience);
    if (success) {
      setIsDeleteDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedExperience(undefined);
    setIsExperienceDialogOpen(true);
  };

  const handleEditExperience = (experience: IWorkExperience, index: number) => {
    setSelectedExperience({ index, experience });
    setIsExperienceDialogOpen(true);
  };

  const handleSaveExperience = async (data: IWorkExperience) => {
    if (selectedExperience) {
      await handleUpdateExperience(selectedExperience.index, data);
    } else {
      await handleAddExperience(data);
    }
  };

  const handleDeleteClick = (index: number) => {
    setExperienceToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (experienceToDelete !== null) {
      handleDeleteExperience(experienceToDelete);
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
          onClick={handleOpenAddDialog}
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
          {experiences.map((experience, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <Flex classes="justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{experience.job_title}</h3>
                  <p className="text-gray-600">{experience.company_name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(experience.from_date)} - {experience.is_currently_working ? t('experience.present') : formatDate(experience.to_date || '')}
                    {' • '}
                    {calculateDuration(experience.from_date, experience.is_currently_working ? undefined : experience.to_date)}
                  </p>
                  <div className="mt-2">
                    <Flex classes="gap-2 flex-wrap">
                      {experience.job_roles.map((role) => (
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
                    onClick={() => handleEditExperience(experience, index)}
                    variant="default"
                    icon={<EditOutlined />}
                  />
                  <ReusableButton
                    btnText={t('experience.delete')}
                    onClick={() => handleDeleteClick(index)}
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
        experience={selectedExperience?.experience}
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
