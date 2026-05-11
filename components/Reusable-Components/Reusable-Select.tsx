'use client';

import { Select } from 'antd';
import React from 'react';
import type { SelectProps } from 'antd';

interface IReusableSelect {
  defaultValue?: string | string[];
  placeholder?: string;
  selectValues: { title: string; value: string }[];
  onValueChange?: (value: string | string[]) => void;
  triggerStyle?: string;
  label?: string;
  error?: string;
  mode?: 'multiple' | 'tags';
  allowClear?: boolean;
  showSearch?: boolean;
  maxTagCount?: SelectProps['maxTagCount'];
  value?: string | string[];
}

const ReusableSelect = ({
  defaultValue,
  placeholder,
  selectValues,
  onValueChange,
  triggerStyle,
  label,
  error,
  mode,
  allowClear = false,
  showSearch = false,
  maxTagCount,
  value,
}: IReusableSelect) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <Select
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        onChange={onValueChange}
        className={triggerStyle}
        style={{ width: '100%' }}
        mode={mode}
        allowClear={allowClear}
        showSearch={showSearch}
        maxTagCount={maxTagCount}
        filterOption={(input, option) => {
          const label = option?.label;
          if (typeof label === 'string') {
            return label.toLowerCase().includes(input.toLowerCase());
          }
          return false;
        }}
        options={selectValues.map(({ title, value }) => ({
          label: title,
          value: value,
        }))}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default React.memo(ReusableSelect);
