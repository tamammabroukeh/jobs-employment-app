'use client';

import { useState } from 'react';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { Upload, Image } from 'antd';
import type { UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface CertificateUploadDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  currentImage?: string;
  onSave: (imageUrl: string) => void;
}

export default function CertificateUploadDialog({
  isOpen,
  setIsOpen,
  currentImage,
  onSave,
}: CertificateUploadDialogProps) {
  const t = useProfileTranslations();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>(currentImage || '');

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSave = () => {
    if (previewImage) {
      onSave(previewImage);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setPreviewImage(currentImage || '');
    setFileList([]);
    setIsOpen(false);
  };

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('education.cancel')}
        onClick={handleCancel}
        variant="default"
      />
      <ReusableButton
        btnText={t('education.save')}
        onClick={handleSave}
        variant="primary"
        disabled={!previewImage}
      />
    </Flex>
  );

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t('education.uploadCertificate'),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-lg"
      dialogBody={
        <div className="mt-4">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={handleUpload}
            onRemove={() => {
              setFileList([]);
              setPreviewImage('');
            }}
            maxCount={1}
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div className="mt-2">{t('education.certificateImage')}</div>
              </div>
            )}
          </Upload>

          {previewImage && (
            <div className="mt-4">
              <Image
                src={previewImage}
                alt="Certificate Preview"
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>
      }
    />
  );
}
