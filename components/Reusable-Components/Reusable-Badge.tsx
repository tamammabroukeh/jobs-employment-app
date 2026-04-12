import { cn } from "@/lib/utils";
import { Typography } from "./typography";

type BadgeVariant = "primary" | "success" | "warning" | "danger" | "info" | "default";
type BadgeSize = "sm" | "md" | "lg";

interface ReusableBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-accent text-accent-foreground",
  default: "bg-muted text-muted-foreground",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5",
  md: "px-3 py-1",
  lg: "px-4 py-1.5",
};

const typographyVariantMap: Record<BadgeSize, "xsmall" | "small" | "text"> = {
  sm: "xsmall",
  md: "small",
  lg: "text",
};

export default function ReusableBadge({
  children,
  variant = "default",
  size = "md",
  className,
}: ReusableBadgeProps) {
  return (
    <Typography
      variant={typographyVariantMap[size]}
      weight="medium"
      className={cn(
        "inline-flex items-center rounded-full transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </Typography>
  );
}
