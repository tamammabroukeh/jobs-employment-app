"use client";

import { Typography } from "@/components/Reusable-Components";
import { ICoachMessage } from "@/apis/services/coach/interface";
import { useCoachTranslations } from "@/hooks/use-translations";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import { enUS, ar } from "date-fns/locale";
import { useLocale } from "next-intl";
import { parseAssistantMessage } from "@/utils/parseAssistantMessage";

interface ChatMessageProps {
  message: ICoachMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const t = useCoachTranslations();
  const locale = useLocale();
  const isUser = message.role === "user";

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: locale === "ar" ? ar : enUS,
      });
    } catch {
      return t("messages.justNow");
    }
  };

  // Parse assistant message content if needed
  const displayContent = isUser 
    ? message.content 
    : parseAssistantMessage(message.content);

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } mb-6 animate-fadeIn`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-coach-assistant-avatar-bg border-2 border-coach-assistant-avatar-border"
        }`}
      >
        {isUser ? (
          <UserOutlined className="text-base" />
        ) : (
          <RobotOutlined className="text-base text-coach-assistant-icon" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Sender Name */}
        <Typography
          variant="text"
          className="text-xs font-medium text-muted-foreground px-1"
        >
          {isUser ? t("messages.user") : t("messages.assistant")}
        </Typography>

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-coach-user-message-bg text-coach-user-message-text rounded-tr-sm"
              : "bg-coach-assistant-message-bg text-coach-assistant-message-text border border-coach-assistant-message-border rounded-tl-sm"
          }`}
        >
          <Typography variant="text" className="whitespace-pre-wrap break-words leading-relaxed">
            {displayContent}
          </Typography>
        </div>

        {/* Timestamp */}
        <Typography variant="text" className="text-xs text-muted-foreground px-1">
          {getTimeAgo(message.created_at)}
        </Typography>
      </div>
    </div>
  );
}
