'use client';

import { Form } from 'antd';
import { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import { ReusableButton } from '.';
import React from 'react';
import ReusableFlex from './Reusable-Flex';
import Link from 'next/link';
import ReusableFormItem from './Reusable-FormItem';

interface ISignFormControls {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

interface IReusableForm<T extends FieldValues> {
  inputs: ISignFormControls[];
  submitHandler: (data: T) => void;
  form: UseFormReturn<T>;
  submitButtonText?: string;
  className?: string;
  isLoading?: boolean;
  errors: FieldErrors<T>;
  renderCustomField?: (field: unknown, inputConfig: ISignFormControls, methods: UseFormReturn) => React.ReactNode;
  children?: React.ReactNode;
  links?: { title: string; path: string; handleClick?: () => void }[];
}

const ReusableForm = <T extends FieldValues>({
  inputs,
  submitHandler,
  form,
  submitButtonText = 'Submit',
  className,
  isLoading,
  errors,
  renderCustomField,
  children,
  links = [{ title: '', path: '', handleClick() {} }],
  // link = { title: '', path: '', handleClick() {} },
}: IReusableForm<T>) => {
  const disabledBtn = isLoading || Object.entries(errors).length > 0;

  return (
    <Form layout="vertical" className={className} onFinish={form.handleSubmit(submitHandler)}>
      {children}
      {inputs.map((input) => {
        const fieldError = errors[input.name as keyof FieldErrors<T>] as unknown;
        return (
          <ReusableFormItem
            key={input.name}
            name={input.name}
            fieldError={fieldError as { message?: string }}
            form={form as UseFormReturn}
            input={input}
            renderCustomField={
              renderCustomField as (field: unknown, inputConfig: ISignFormControls, methods: UseFormReturn) => React.ReactNode
            }
          />
        );
      })}
      {submitButtonText && (
        <ReusableButton
          btnText={submitButtonText}
          isLoading={isLoading}
          className="w-full"
          disabled={disabledBtn}
          type="submit"
          variant="primary"
        />
      )}
      {links && (
        <ReusableFlex classes='flex-col gap-2' >
          {links.map((link) => (
            <Link key={link.path} href={link.path} onClick={link.handleClick} className="text-md font-medium">
              {link.title}
            </Link>
            ))}
          </ReusableFlex>
        )}
    </Form>
  );
};

export default React.memo(ReusableForm) as typeof ReusableForm;
