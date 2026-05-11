'use client';

import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';

interface IReusableButton extends Omit<ButtonProps, 'type' | 'htmlType' | 'variant'> {
  btnText?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  type?: 'button' | 'submit' | 'reset';
  iconOnly?: boolean;
}

export default function ReusableButton({
  btnText,
  type = 'button',
  className,
  disabled,
  isLoading,
  variant = 'default',
  children,
  iconOnly = false,
  icon,
  ...props
}: IReusableButton) {
  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      type={variant}
      htmlType={type}
      className={className}
      icon={isLoading ? <LoadingOutlined spin /> : icon}
      loading={isLoading}
      shape={iconOnly ? 'default' : undefined}
    >
      {!iconOnly && children}
      {!iconOnly && btnText}
    </Button>
  );
}
