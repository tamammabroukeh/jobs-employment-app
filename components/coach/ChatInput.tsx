"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import { ReusableButton } from "@/components/Reusable-Components";
import { SendOutlined } from "@ant-design/icons";
import { useCoachTranslations } from "@/hooks/use-translations";

const { TextArea } = Input;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
}: ChatInputProps) {
  const t = useCoachTranslations();
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<any>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage("");
      // Reset textarea height
      if (textAreaRef.current) {
        textAreaRef.current.resizableTextArea?.textArea?.style.setProperty(
          "height",
          "auto"
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    if (textAreaRef.current && !disabled) {
      textAreaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <TextArea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.placeholder")}
            disabled={disabled || isLoading}
            autoSize={{ minRows: 1, maxRows: 6 }}
            maxLength={1000}
            showCount
            className="resize-none"
          />
        </div>
        <ReusableButton
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          isLoading={isLoading}
          variant="primary"
          className="h-10"
        />
      </div>
    </div>
  );
}
