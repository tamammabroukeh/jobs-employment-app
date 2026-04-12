'use client';

import { Typography as AntTypography } from 'antd';
import React from 'react';
import { cn } from '@/lib/utils';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'text' | 'link' | 'xsmall'| 'small' | 'muted' | 'error' | 'success' | 'warning';
type TypographyTitleLevel = 1 | 2 | 5 | 3 | 4 | undefined

interface TypographyProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
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
  color?: string;
  style?: React.CSSProperties;
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

const Typography: React.FC<TypographyProps> = ({
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
  color,
  style,
  ...restProps
}) => {
  const classes = cn(weight && WEIGHT_CLASSES[weight], align && ALIGN_CLASSES[align], className);

  // Merge custom style with color
  const customStyle: React.CSSProperties = {
    ...style,
    ...(color && { color }),
  };

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
    style: customStyle,
    ...restProps,
  };

  // Heading variants
  const variantIsHeading:boolean = variant.startsWith("h");
  const variantLevel = variantIsHeading ? +variant[1] : undefined
  if(variantIsHeading) return <AntTypography.Title level={variantLevel as TypographyTitleLevel} {...baseProps} copyable={copyable} ellipsis={ellipsis}>{children}</AntTypography.Title>;

  // Paragraph
  if (variant === 'p') return <AntTypography.Paragraph {...baseProps} copyable={copyable} ellipsis={ellipsis}>{children}</AntTypography.Paragraph>;

  // Link
  if (variant === 'link' || href) return <AntTypography.Link {...baseProps} href={href} copyable={copyable}>{children}</AntTypography.Link>;

  // Text variants with custom styling
  if (variant === 'xsmall') return <AntTypography.Text {...baseProps} copyable={copyable} className={cn('text-xs', classes)}>{children}</AntTypography.Text>;

  if (variant === 'small') return <AntTypography.Text {...baseProps} copyable={copyable} className={cn('text-sm', classes)}>{children}</AntTypography.Text>;
  if (variant === 'muted') return <AntTypography.Text {...baseProps} type="secondary" copyable={copyable} className={cn('text-sm', classes)}>{children}</AntTypography.Text>;
  if (variant === 'error') return <AntTypography.Text {...baseProps} type="danger" copyable={copyable} className={cn('text-sm font-medium', classes)}>{children}</AntTypography.Text>;
  if (variant === 'success') return <AntTypography.Text {...baseProps} type="success" copyable={copyable} className={cn('text-sm font-medium', classes)}>{children}</AntTypography.Text>;
  if (variant === 'warning') return <AntTypography.Text {...baseProps} type="warning" copyable={copyable} className={cn('text-sm font-medium', classes)}>{children}</AntTypography.Text>;

  // Default text
  return <AntTypography.Text {...baseProps} copyable={copyable}>{children}</AntTypography.Text>;
};

export { Typography };