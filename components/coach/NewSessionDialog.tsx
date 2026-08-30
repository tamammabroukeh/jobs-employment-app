"use client";

import { useState } from "react";
import { ReusableDialog, ReusableButton, Flex } from "@/components/Reusable-Components";
import { useCoachTranslations } from "@/hooks/use-translations";
import { Input } from "antd";

interface NewSessionDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onCreateSession: (title?: string) => Promise<void>;
}

export default function NewSessionDialog({
  isOpen,
  setIsOpen,
  onCreateSession,
}: NewSessionDialogProps) {
  const t = useCoachTranslations();
  const [sessionTitle, setSessionTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await onCreateSession(sessionTitle.trim() || undefined);
      setSessionTitle(""); // Clear input after successful creation
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setSessionTitle("");
    setIsOpen(false);
  };

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t("dialog.cancel")}
        onClick={handleCancel}
        variant="default"
        disabled={isCreating}
      />
      <ReusableButton
        btnText={t("dialog.create")}
        onClick={handleCreate}
        variant="primary"
        isLoading={isCreating}
      />
    </Flex>
  );

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t("dialog.newSessionTitle"),
        description: t("dialog.newSessionDescription"),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-md"
      dialogBody={
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            {t("dialog.sessionNameLabel")}
            <span className="text-muted-foreground ml-1">({t("dialog.optional")})</span>
          </label>
          <Input
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder={t("dialog.sessionNamePlaceholder")}
            maxLength={100}
            onPressEnter={handleCreate}
            disabled={isCreating}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {t("dialog.sessionNameHint")}
          </p>
        </div>
      }
    />
  );
}
