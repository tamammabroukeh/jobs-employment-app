"use client";

import { useEffect, useRef } from "react";
import { Typography, Flex } from "@/components/Reusable-Components";
import { ICoachMessage } from "@/apis/services/coach/interface";
import { useCoachTranslations } from "@/hooks/use-translations";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import QuickSuggestions from "./QuickSuggestions";
import { Empty, Spin } from "antd";
import { RobotOutlined, LoadingOutlined } from "@ant-design/icons";

interface ChatWindowProps {
  messages: ICoachMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isSending?: boolean;
  hasActiveSession: boolean;
}

export default function ChatWindow({
  messages,
  onSendMessage,
  isLoading = false,
  isSending = false,
  hasActiveSession,
}: ChatWindowProps) {
  const t = useCoachTranslations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const showWelcome = !hasActiveSession && messages.length === 0;
  const showSuggestions = messages.length === 0 && hasActiveSession;
  console.log('messages', messages)
  return (
    <div className="flex-1 flex flex-col bg-background h-full">
      {/* Chat Header */}
      <div className="border-b border-border bg-card p-4">
        <Flex classes="items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <RobotOutlined className="text-primary text-lg" />
          </div>
          <div>
            <Typography variant="h3" className="text-lg font-semibold">
              {t("title")}
            </Typography>
            <Typography variant="text" className="text-sm text-muted-foreground">
              {t("subtitle")}
            </Typography>
          </div>
        </Flex>
      </div>

      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6"
        style={{ scrollBehavior: "smooth" }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : showWelcome ? (
          // Welcome Screen for no active session
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
              <RobotOutlined className="text-4xl text-primary" />
            </div>
            <Typography variant="h2" className="text-2xl font-bold mb-3">
              {t("chat.welcome")}
            </Typography>
            <Typography variant="text" className="text-muted-foreground mb-8 max-w-lg">
              {t("chat.welcomeMessage")}
            </Typography>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <Typography variant="text" className="text-muted-foreground">
                    {t("chat.emptyState")}
                  </Typography>
                  <Typography variant="p" className="text-sm text-muted-foreground mt-1">
                    {t("chat.emptyStateDescription")}
                  </Typography>
                </div>
              }
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Quick Suggestions (only shown when no messages) */}
            {showSuggestions && (
              <div className="mb-8">
                <QuickSuggestions onSelectSuggestion={onSendMessage} />
              </div>
            )}

            {/* Messages List */}
            {messages?.length > 0 && messages?.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}

            {/* Typing Indicator */}
            {isSending && (
              <div className="flex gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-coach-assistant-avatar-bg border-2 border-coach-assistant-avatar-border flex items-center justify-center">
                  <RobotOutlined className="text-base text-coach-assistant-icon" />
                </div>
                <div className="flex flex-col gap-1">
                  <Typography variant="text" className="text-xs font-medium text-muted-foreground px-1">
                    {t("messages.assistant")}
                  </Typography>
                  <div className="px-4 py-3 rounded-2xl bg-coach-assistant-message-bg border border-coach-assistant-message-border rounded-tl-sm">
                    <Flex classes="items-center gap-2">
                      <LoadingOutlined className="text-primary" />
                      <Typography variant="text" className="text-muted-foreground">
                        {t("chat.thinking")}
                      </Typography>
                    </Flex>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isSending}
        disabled={showWelcome}
      />
    </div>
  );
}
