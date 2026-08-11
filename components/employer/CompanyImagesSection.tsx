'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Typography, ReusableButton } from '@/components/Reusable-Components';
import { uploadCompanyLogoAction, uploadCompanyCoverImageAction } from '@/apis/services/employer/actions';
import { useEmployerProfileTranslations } from '@/hooks/use-translations';
import Image from 'next/image';

interface CompanyImagesSectionProps {
  logo: string | null | undefined;
  coverImage: string | null | undefined;
}

export default function CompanyImagesSection({ logo, coverImage }: CompanyImagesSectionProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const t = useEmployerProfileTranslations();

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error(t('images.logo.errorType'));
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('images.logo.errorSize'));
      return;
    }

    setIsUploadingLogo(true);
    try {
      const result = await uploadCompanyLogoAction({ logo: file });
      console.log('result', result)
      if (result?.data?.success && result.data.data) {
        toast.success(result.data.message || t('images.logo.uploadSuccess'));
        // Refetch company profile to get updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error(t('images.logo.uploadError'));
    } finally {
      setIsUploadingLogo(false);
      // Reset input
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error(t('images.cover.errorType'));
      return;
    }

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error(t('images.cover.errorSize'));
      return;
    }

    setIsUploadingCover(true);
    try {
      const result = await uploadCompanyCoverImageAction({ cover_image: file });
      
      if (result?.data?.success && result.data.data) {
        toast.success(t('images.cover.uploadSuccess'));
        // Refetch company profile to get updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast.error(t('images.cover.uploadError'));
    } finally {
      setIsUploadingCover(false);
      // Reset input
      if (coverInputRef.current) {
        coverInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="auth-card p-6 mb-6">
      <Typography variant="h2" className="text-foreground mb-6">
        {t('images.title')}
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Section */}
        <div>
          <Typography variant="h3" className="text-foreground mb-3">
            {t('images.logo.title')}
          </Typography>
          <Typography variant="small" className="text-muted-foreground mb-4 block">
            {t('images.logo.description')}
          </Typography>
          
          {logo ? (
            <div className="relative w-40 h-40 mb-4 border border-border rounded-lg overflow-hidden bg-muted">
              <Image
                src={logo}
                alt="Company Logo"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-40 h-40 mb-4 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted">
              <div className="text-center flex flex-col">
                <i className="fa-solid fa-building text-4xl text-muted-foreground mb-2" />
                <Typography variant="small" className="text-muted-foreground">
                  {t('images.logo.noLogo')}
                </Typography>
              </div>
            </div>
          )}

          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoChange}
            className="hidden"
          />
          <ReusableButton
            onClick={() => logoInputRef.current?.click()}
            variant="default"
            disabled={isUploadingLogo}
          >
            {isUploadingLogo ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2" />
                {t('images.logo.uploading')}
              </>
            ) : (
              <>
                <i className="fa-solid fa-upload mr-2" />
                {logo ? t('images.logo.changeLogo') : t('images.logo.uploadLogo')}
              </>
            )}
          </ReusableButton>
        </div>

        {/* Cover Image Section */}
        <div>
          <Typography variant="h3" className="text-foreground mb-3">
            {t('images.cover.title')}
          </Typography>
          <Typography variant="small" className="text-muted-foreground mb-4 block">
            {t('images.cover.description')}
          </Typography>
          
          {coverImage ? (
            <div className="relative w-full h-40 mb-4 border border-border rounded-lg overflow-hidden bg-muted">
              <Image
                src={coverImage}
                alt="Company Cover"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-40 mb-4 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted">
              <div className="text-center flex flex-col">
                <i className="fa-solid fa-image text-4xl text-muted-foreground mb-2" />
                <Typography variant="small" className="text-muted-foreground">
                  {t('images.cover.noCover')}
                </Typography>
              </div>
            </div>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverChange}
            className="hidden"
          />
          <ReusableButton
            onClick={() => coverInputRef.current?.click()}
            variant="default"
            disabled={isUploadingCover}
          >
            {isUploadingCover ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2" />
                {t('images.cover.uploading')}
              </>
            ) : (
              <>
                <i className="fa-solid fa-upload mr-2" />
                {coverImage ? t('images.cover.changeCover') : t('images.cover.uploadCover')}
              </>
            )}
          </ReusableButton>
        </div>
      </div>
    </div>
  );
}
