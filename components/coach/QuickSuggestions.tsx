"use client";

import { Typography, Flex } from "@/components/Reusable-Components";
import { useCoachTranslations } from "@/hooks/use-translations";
import { BulbOutlined } from "@ant-design/icons";

interface QuickSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

export default function QuickSuggestions({ onSelectSuggestion }: QuickSuggestionsProps) {
  const t = useCoachTranslations();

  const suggestions = [
    t("suggestions.items.0"),
    t("suggestions.items.1"),
    t("suggestions.items.2"),
    t("suggestions.items.3"),
    t("suggestions.items.4"),
  ];

  return (
    <div className="space-y-3">
      <Flex classes="items-center gap-2">
        <BulbOutlined className="text-warning text-lg" />
        <Typography variant="h4" className="text-sm font-semibold">
          {t("suggestions.title")}
        </Typography>
      </Flex>
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            className="text-left p-3 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary transition-all group"
          >
            <Typography variant="text" className="text-sm text-foreground group-hover:text-primary">
              {suggestion}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
}
