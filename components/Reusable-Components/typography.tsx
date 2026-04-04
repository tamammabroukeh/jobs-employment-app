import { Typography as AntTypography } from 'antd';
import React from 'react';
import { cn } from '@/lib/utils';

const { Title, Text, Paragraph, Link } = AntTypography;

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'text' | 'link' | 'small' | 'muted' | 'error' | 'success' | 'warning';
type TypographyTitleLevel = 1 | 2 | 5 | 3 | 4 | undefined

interface TypographyProps {
  variant?: TypographyVariant;
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  children?: React.ReactNode;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  italic?: boolean;
  mark?: boolean;
  code?: boolean;
  disabled?: boolean;
  copyable?: boolean;
  ellipsis?: boolean | { rows?: number; expandable?: boolean };
  href?: string;
  onClick?: () => void;
}

const WEIGHT_CLASSES = {
  thin: 'font-thin',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
} as const;

const ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
} as const;

export const Typography: React.FC<TypographyProps> = ({
  variant = 'text',
  weight,
  align,
  className,
  children,
  underline,
  delete: deleteProp,
  strong,
  italic,
  mark,
  code,
  disabled,
  copyable,
  ellipsis,
  href,
  onClick,
}) => {
  const classes = cn(weight && WEIGHT_CLASSES[weight], align && ALIGN_CLASSES[align], className);

  const baseProps = {
    className: classes,
    underline,
    delete: deleteProp,
    strong,
    italic,
    mark,
    code,
    disabled,
    onClick,
  };

  // Heading variants
  const variantIsHeading:boolean = variant.startsWith("h");
  const variantLevel = variantIsHeading ? +variant[1] : undefined
  if(variantIsHeading) return <Title level={variantLevel as TypographyTitleLevel} {...baseProps} copyable={copyable} ellipsis={ellipsis}>{children}</Title>;

  // Paragraph
  if (variant === 'p') return <Paragraph {...baseProps} copyable={copyable} ellipsis={ellipsis}>{children}</Paragraph>;

  // Link
  if (variant === 'link' || href) return <Link {...baseProps} href={href} copyable={copyable}>{children}</Link>;

  // Text variants with custom styling
  if (variant === 'small') return <Text {...baseProps} copyable={copyable} className={cn('text-sm', classes)}>{children}</Text>;
  if (variant === 'muted') return <Text {...baseProps} type="secondary" copyable={copyable} className={cn('text-sm', classes)}>{children}</Text>;
  if (variant === 'error') return <Text {...baseProps} type="danger" copyable={copyable} className={cn('text-sm font-medium', classes)}>{children}</Text>;
  if (variant === 'success') return <Text {...baseProps} type="success" copyable={copyable} className={cn('text-sm font-medium', classes)}>{children}</Text>;
  if (variant === 'warning') return <Text {...baseProps} type="warning" copyable={copyable} className={cn('text-sm font-medium', classes)}>{children}</Text>;

  // Default text
  return <Text {...baseProps} copyable={copyable}>{children}</Text>;
};
