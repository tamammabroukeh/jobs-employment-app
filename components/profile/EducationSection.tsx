"use client";

import { useState } from "react";
import {
  ReusableCard,
  ReusableButton,
  Flex,
  ReusableDialog,
} from "@/components/Reusable-Components";
import { useProfileTranslations } from "@/hooks/use-profile";
import { IEducation } from "@/apis/services/job-seeker/interface";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import EducationDialog from "./EducationDialog";
import { updateEducationAction } from "@/apis/services/job-seeker/actions";
import { toast } from "sonner";

interface EducationSectionProps {
  educations: IEducation[];
}

export default function EducationSection({
  educations,
}: EducationSectionProps) {
  const t = useProfileTranslations();
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<
    { index: number; education: IEducation } | undefined
  >();
  const [educationToDelete, setEducationToDelete] = useState<number | null>(
    null,
  );

  const handleAddEducation = () => {
    setSelectedEducation(undefined);
    setIsEducationDialogOpen(true);
  };

  const handleEditEducation = (education: IEducation, index: number) => {
    setSelectedEducation({ index, education });
    setIsEducationDialogOpen(true);
  };

  const handleSaveEducation = async (data: IEducation): Promise<boolean> => {
    let updatedEducationHistory: IEducation[];

    if (selectedEducation) {
      // Update existing education
      updatedEducationHistory = educations.map((edu, i) =>
        i === selectedEducation.index ? data : edu,
      );
    } else {
      // Add new education
      updatedEducationHistory = [...educations, data];
    }

    return await onSaveEducation(updatedEducationHistory);
  };

  const handleDeleteClick = (index: number) => {
    setEducationToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (educationToDelete !== null) {
      const updatedEducationHistory = educations.filter(
        (_, i) => i !== educationToDelete,
      );
      const success = await onSaveEducation(updatedEducationHistory);
      
      if (success) {
        setEducationToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const onSaveEducation = async (education_history: IEducation[]): Promise<boolean> => {
    console.log("[EducationSection] Updating education:", education_history);
    const result = await updateEducationAction({ education_history });
    console.log("[EducationSection] Education update result:", result);

    if (result.data?.success) {
      toast.success(result.data.message || "Education updated successfully");
      return true;
    } else if (result.serverError) {
      toast.error(result.serverError);
      return false;
    }
    return false;
  };
  return (
    <ReusableCard styleForCard="mb-6">
      <Flex classes="justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("education.title")}</h2>
        <ReusableButton
          btnText={t("education.addEducation")}
          onClick={handleAddEducation}
          variant="primary"
          icon={<PlusOutlined />}
        />
      </Flex>

      {educations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{t("education.noEducation")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((education, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <Flex classes="justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {t(`certificateTypes.${education.certificate_type}`)}
                  </h3>
                  <p className="text-gray-600">{education.major_name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {education.university} • {education.faculty}
                  </p>
                  <Flex classes="gap-4 mt-2 text-sm text-gray-500">
                    <span>{t(`gradeOptions.${education.grade}`)}</span>
                    <span>
                      {formatDate(education.from_date)} -{" "}
                      {formatDate(education.awarded_date)}
                    </span>
                  </Flex>
                </div>

                <Flex classes="gap-2">
                  <ReusableButton
                    btnText={t("education.edit")}
                    onClick={() => handleEditEducation(education, index)}
                    variant="default"
                    icon={<EditOutlined />}
                  />
                  <ReusableButton
                    btnText={t("education.delete")}
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

      <EducationDialog
        isOpen={isEducationDialogOpen}
        setIsOpen={setIsEducationDialogOpen}
        education={selectedEducation?.education}
        onSave={handleSaveEducation}
      />

      <ReusableDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        dialogHeader={{
          title: t("education.confirmDeleteTitle"),
          description: t("education.confirmDelete"),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("education.no")}
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="default"
            />
            <ReusableButton
              btnText={t("education.yes")}
              onClick={handleConfirmDelete}
              variant="primary"
            />
          </Flex>
        }
      />
    </ReusableCard>
  );
}
