'use client';

import { Modal } from 'antd';
import React from 'react';

interface IReusableDialog {
  isOpen: boolean;
  dialogHeader?: { title?: string; description?: string };
  dialogBody?: React.ReactNode;
  dialogFooter?: React.ReactNode;
  contentClassName?: string;
  triggerComponent?: React.ReactNode;
  setIsOpen: (value: boolean) => void;
}

const ReusableDialog = ({
  isOpen,
  dialogHeader = { title: '', description: '' },
  dialogBody = null,
  dialogFooter = null,
  contentClassName,
  setIsOpen,
}: IReusableDialog) => {
  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      title={dialogHeader?.title}
      footer={dialogFooter}
      className={contentClassName}
    >
      {dialogHeader?.description && (
        <p className="mb-4 text-(--antd-text)">
          {dialogHeader.description}
        </p>
      )}
      {dialogBody}
    </Modal>
  );
};

export default ReusableDialog;
