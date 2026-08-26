"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Typography,
  ReusableButton,
  Flex,
  ReusableDialog,
} from "@/components/Reusable-Components";
import { ICoachSession } from "@/apis/services/coach/interface";
import { useCoachTranslations } from "@/hooks/use-translations";
import {
  PlusOutlined,
  MessageOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Empty, Spin } from "antd";
import { formatDistanceToNow } from "date-fns";
import { enUS, ar } from "date-fns/locale";
import { useLocale } from "next-intl";

interface SessionSidebarProps {
  sessions: ICoachSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isLoading?: boolean;
  setSessionToDelete: Dispatch<SetStateAction<string | null>>;
  sessionToDelete: string | null;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  deleteDialogOpen: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  isDeleting: boolean;
}

export default function SessionSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isLoading = false,
  sessionToDelete,
  setSessionToDelete,
  deleteDialogOpen,
  setDeleteDialogOpen,
  isDeleting,
  setIsDeleting,
}: SessionSidebarProps) {
  const t = useCoachTranslations();
  const locale = useLocale();

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true)
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete);
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: locale === "ar" ? ar : enUS,
      });
    } catch {
      return "";
    }
  };

  return (
    <>
      <div className="w-80 border-r border-border bg-card flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Typography variant="h3" className="text-lg font-semibold mb-3">
            {t("sidebar.title")}
          </Typography>
          <ReusableButton
            icon={<PlusOutlined />}
            btnText={t("sidebar.newChat")}
            onClick={onNewSession}
            variant="primary"
            className="w-full"
          />
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spin />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Typography
                      variant="text"
                      className="text-muted-foreground block mb-1"
                    >
                      {t("sidebar.noSessions")}
                    </Typography>
                    <Typography
                      variant="text"
                      className="text-sm text-muted-foreground"
                    >
                      {t("sidebar.noSessionsDescription")}
                    </Typography>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all hover:bg-muted ${
                    activeSessionId === session.id
                      ? "bg-coach-session-active-bg border-l-4 border-primary"
                      : "bg-card hover:shadow-sm"
                  }`}
                >
                  <Flex classes="items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Flex classes="items-center gap-2 mb-1">
                        <MessageOutlined className="text-primary text-sm flex-shrink-0" />
                        <Typography
                          variant="text"
                          className={`font-medium truncate ${
                            activeSessionId === session.id
                              ? "text-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {session.title || t("sidebar.newChat")}
                        </Typography>
                      </Flex>
                      <Flex classes="items-center gap-1 text-xs text-muted-foreground">
                        <ClockCircleOutlined className="text-xs" />
                        <span>{getTimeAgo(session.updated_at)}</span>
                      </Flex>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteClick(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1 hover:bg-destructive/10 rounded text-destructive"
                    >
                      <DeleteOutlined className="text-sm" />
                    </button>
                  </Flex>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ReusableDialog
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        dialogHeader={{
          title: t("sidebar.deleteConfirm"),
          description: t("sidebar.deleteDescription"),
        }}
        contentClassName="mt-[10%]!"
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("actions.cancel")}
              onClick={() => setDeleteDialogOpen(false)}
              variant="default"
            />
            <ReusableButton
              btnText={t("actions.delete")}
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              variant="primary"
              danger
            />
          </Flex>
        }
      />
    </>
  );
}
