'use client';

import { useState } from 'react';
import { ReusableCard, ReusableButton, Flex, ReusableDialog } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { Education } from '@/types/profile';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import EducationDialog from './EducationDialog';
import CertificateUploadDialog from './CertificateUploadDialog';
import { Image } from 'antd';

interface EducationSectionProps {
  educations: Education[];
  onAddEducation: (data: Omit<Education, 'id'>) => void;
  onUpdateEducation: (id: string, data: Omit<Education, 'id'>) => void;
  onDeleteEducation: (id: string) => void;
  onUploadCertificate: (id: string, imageUrl: string) => void;
}

export default function EducationSection({
  educations,
  onAddEducation,
  onUpdateEducation,
  onDeleteEducation,
  onUploadCertificate,
}: EducationSectionProps) {
  const t = useProfileTranslations();
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | undefined>();
  const [educationToDelete, setEducationToDelete] = useState<string | null>(null);

  const handleAddEducation = () => {
    setSelectedEducation(undefined);
    setIsEducationDialogOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setSelectedEducation(education);
    setIsEducationDialogOpen(true);
  };

  const handleSaveEducation = (data: Omit<Education, 'id'>) => {
    if (selectedEducation) {
      onUpdateEducation(selectedEducation.id, data);
    } else {
      onAddEducation(data);
    }
  };

  const handleUploadCertificate = (education: Education) => {
    setSelectedEducation(education);
    setIsCertificateDialogOpen(true);
  };

  const handleSaveCertificate = (imageUrl: string) => {
    if (selectedEducation) {
      onUploadCertificate(selectedEducation.id, imageUrl);
    }
  };

  const handleDeleteClick = (id: string) => {
    setEducationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (educationToDelete) {
      onDeleteEducation(educationToDelete);
      setEducationToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <ReusableCard styleForCard="mb-6">
      <Flex classes="justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('education.title')}</h2>
        <ReusableButton
          btnText={t('education.addEducation')}
          onClick={handleAddEducation}
          variant="primary"
          icon={<PlusOutlined />}
        />
      </Flex>

      {educations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{t('education.noEducation')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((education) => (
            <div
              key={education.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <Flex classes="justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {t(`certificateTypes.${education.certificateType}`)}
                  </h3>
                  <p className="text-gray-600">{education.majorName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {education.university} • {education.faculty}
                  </p>
                  <Flex classes="gap-4 mt-2 text-sm text-gray-500">
                    <span>{t(`gradeOptions.${education.grade}`)}</span>
                    <span>
                      {formatDate(education.fromDate)} - {formatDate(education.awardedDate)}
                    </span>
                  </Flex>

                  {education.certificateImage && (
                    <div className="mt-3">
                      <Image
                        src={education.certificateImage}
                        alt="Certificate"
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                <Flex classes="gap-2">
                  <ReusableButton
                    btnText={t('education.uploadCertificate')}
                    onClick={() => handleUploadCertificate(education)}
                    variant="default"
                    icon={<UploadOutlined />}
                  />
                  <ReusableButton
                    btnText={t('education.edit')}
                    onClick={() => handleEditEducation(education)}
                    variant="default"
                    icon={<EditOutlined />}
                  />
                  <ReusableButton
                    btnText={t('education.delete')}
                    onClick={() => handleDeleteClick(education.id)}
                    variant="default"
                    icon={<DeleteOutlined />}
                  />
                </Flex>
              </Flex>
            </div>
          ))}
        </div>
      )}

      <EducationDialog
        isOpen={isEducationDialogOpen}
        setIsOpen={setIsEducationDialogOpen}
        education={selectedEducation}
        onSave={handleSaveEducation}
      />

      <CertificateUploadDialog
        isOpen={isCertificateDialogOpen}
        setIsOpen={setIsCertificateDialogOpen}
        currentImage={selectedEducation?.certificateImage}
        onSave={handleSaveCertificate}
      />

      <ReusableDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        dialogHeader={{
          title: t('education.confirmDeleteTitle'),
          description: t('education.confirmDelete'),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t('education.no')}
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="default"
            />
            <ReusableButton
              btnText={t('education.yes')}
              onClick={handleConfirmDelete}
              variant="primary"
            />
          </Flex>
        }
      />
    </ReusableCard>
  );
}
