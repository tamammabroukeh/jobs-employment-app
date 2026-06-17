'use client';

import { useForm } from 'react-hook-form';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { ISocialLinks, IUpdateSocialLinksRequest } from '@/apis/services/job-seeker/interface';
import { Form, Input } from 'antd';
import { Controller } from 'react-hook-form';

interface SocialLinksDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  socialLinks: ISocialLinks;
  onSave: (data: IUpdateSocialLinksRequest) => Promise<boolean>;
}

interface SocialLinksFormData {
  linkedin: string;
  github: string;
  portfolio: string;
  twitter: string;
}

export default function SocialLinksDialog({
  isOpen,
  setIsOpen,
  socialLinks,
  onSave,
}: SocialLinksDialogProps) {
  const t = useProfileTranslations();
  const { control, handleSubmit, formState: { errors } } = useForm<SocialLinksFormData>({
    defaultValues: {
      linkedin: socialLinks.linkedin || '',
      github: socialLinks.github || '',
      portfolio: socialLinks.portfolio || '',
      twitter: socialLinks.twitter || '',
    },
  });

  const onSubmit = async (data: SocialLinksFormData) => {
    const success = await onSave({
      social_links: data,
    });
    
    // Only close dialog if update was successful
    if (success) {
      setIsOpen(false);
    }
  };

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('userInfo.socialLinks.cancel')}
        onClick={() => setIsOpen(false)}
        variant="default"
      />
      <ReusableButton
        btnText={t('userInfo.socialLinks.save')}
        onClick={handleSubmit(onSubmit)}
        variant="primary"
      />
    </Flex>
  );

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t('userInfo.socialLinks.edit'),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-2xl"
      dialogBody={
        <Form layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="linkedin"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.socialLinks.linkedin')}
                  validateStatus={errors.linkedin ? 'error' : ''}
                  help={errors.linkedin?.message}
                >
                  <Input {...field} placeholder="https://linkedin.com/in/username" />
                </Form.Item>
              )}
            />

            <Controller
              name="github"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.socialLinks.github')}
                  validateStatus={errors.github ? 'error' : ''}
                  help={errors.github?.message}
                >
                  <Input {...field} placeholder="https://github.com/username" />
                </Form.Item>
              )}
            />

            <Controller
              name="portfolio"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.socialLinks.portfolio')}
                  validateStatus={errors.portfolio ? 'error' : ''}
                  help={errors.portfolio?.message}
                >
                  <Input {...field} placeholder="https://yourportfolio.com" />
                </Form.Item>
              )}
            />

            <Controller
              name="twitter"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.socialLinks.twitter')}
                  validateStatus={errors.twitter ? 'error' : ''}
                  help={errors.twitter?.message}
                >
                  <Input {...field} placeholder="https://twitter.com/username" />
                </Form.Item>
              )}
            />
          </div>
        </Form>
      }
    />
  );
}
