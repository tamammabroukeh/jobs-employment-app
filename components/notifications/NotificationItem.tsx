"use client";

import { Typography, Flex } from "@/components/Reusable-Components";
import type { INotification } from "@/apis/services/notifications/interface";
import { getTimeAgo } from "@/utils/timeAgo";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  MailOutlined,
  EyeOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNotificationsTranslations, useTypedTranslations } from "@/hooks/use-translations";

interface NotificationItemProps {
  notification: INotification;
  onClick?: (notification: INotification) => void;
}

const getNotificationIcon = (type: string) => {
  const iconClass = "text-lg";
  
  switch (type) {
    case "application_status_changed":
      return <CheckCircleOutlined className={`${iconClass} text-blue-500`} />;
    case "new_job_match":
      return <FileTextOutlined className={`${iconClass} text-green-500`} />;
    case "interview_scheduled":
      return <CalendarOutlined className={`${iconClass} text-purple-500`} />;
    case "offer_received":
      return <CheckCircleOutlined className={`${iconClass} text-success`} />;
    case "message_received":
      return <MailOutlined className={`${iconClass} text-blue-500`} />;
    case "profile_viewed":
      return <EyeOutlined className={`${iconClass} text-gray-500`} />;
    default:
      return <InfoCircleOutlined className={`${iconClass} text-gray-500`} />;
  }
};

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const t = useTypedTranslations('notifications');
  const isUnread = !notification.read_at;

  const timeAgo = getTimeAgo(notification.created_at);
  const timeText =
    timeAgo.type === "justNow"
      ? t("timeAgo.justNow")
      : t(`timeAgo.${timeAgo.type}`, {
          [timeAgo.type.replace("Ago", "")]: timeAgo.value ?? 0,
        } as any);

  const notificationTypeLabel =
    t(`types.${notification.type}` as any) || t("types.default");

  return (
    <div
      onClick={() => onClick?.(notification)}
      className={`
        p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors
        ${isUnread ? "bg-blue-50 dark:bg-blue-950/20" : ""}
      `}
    >
      <Flex classes="gap-3 items-start">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Type Label */}
          <Typography
            variant="text"
            className="text-xs font-semibold text-primary mb-1"
          >
            {notificationTypeLabel}
          </Typography>

          {/* Message */}
          <Typography
            variant="text"
            className={`text-sm ${
              isUnread
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            {notification.message}
          </Typography>

          {/* Time */}
          <Typography
            variant="text"
            className="text-xs text-muted-foreground mt-1"
          >
            {timeText}
          </Typography>
        </div>

        {/* Unread Indicator */}
        {isUnread && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        )}
      </Flex>
    </div>
  );
}
