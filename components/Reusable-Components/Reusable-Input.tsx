'use client';

import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import React, { forwardRef } from 'react';
import type { InputProps, InputRef } from 'antd';

interface ReusableInputProps extends InputProps {
  hasError?: boolean;
}

const ReusableInput = forwardRef<InputRef, ReusableInputProps>(
  ({ type, className, hasError = false, ...props }, ref) => {
    const isPassword = type === 'password';

    if (isPassword) {
      return (
        <Input.Password
          ref={ref}
          className={className}
          status={hasError ? 'error' : undefined}
          iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          {...props}
        />
      );
    }

    return (
      <Input
        ref={ref}
        type={type}
        className={className}
        status={hasError ? 'error' : undefined}
        {...props}
      />
    );
  }
);

ReusableInput.displayName = 'ReusableInput';
export default React.memo(ReusableInput);
