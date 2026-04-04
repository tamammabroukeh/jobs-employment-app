'use client';

import { Form } from 'antd';
import ReusableInput from './Reusable-Input';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface ISignFormControls {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

interface IReusableFormItem {
  fieldError?: { message?: string };
  form: UseFormReturn;
  input: ISignFormControls;
  renderCustomField?: (field: unknown, inputConfig: ISignFormControls, methods: UseFormReturn) => React.ReactNode;
  name: string;
}

const ReusableFormItem = ({ fieldError, form, input, renderCustomField, name }: IReusableFormItem) => {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.Item
          label={input.label}
          validateStatus={fieldError ? 'error' : ''}
          help={fieldError?.message}
        >
          {renderCustomField ? (
            renderCustomField(field, input, form)
          ) : (
            <ReusableInput
              className={input.className}
              hasError={!!fieldError}
              type={input.type}
              placeholder={input.placeholder}
              {...field}
            />
          )}
        </Form.Item>
      )}
    />
  );
};

export default React.memo(ReusableFormItem);
