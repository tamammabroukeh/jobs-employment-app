'use client';

import { useState } from 'react';
import { ReusableButton } from '@/components/Reusable-Components';
import SendOfferDialog from './SendOfferDialog';
import { useCandidatesTranslations } from '@/hooks/use-candidates';

interface SendOfferButtonProps {
  candidateUserId: string;
  candidateName: string;
}

export default function SendOfferButton({ candidateUserId, candidateName }: SendOfferButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useCandidatesTranslations();

  return (
    <>
      <ReusableButton
        btnText={t('profile.sendOffer')}
        variant="primary"
        onClick={() => setIsDialogOpen(true)}
        icon={<i className="fa-solid fa-paper-plane" />}
        className="w-full"
      />

      <SendOfferDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        candidateUserId={candidateUserId}
        candidateName={candidateName}
        t={t}
      />
    </>
  );
}
