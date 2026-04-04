'use client';

import { Select } from 'antd';
import React from 'react';

interface IReusableSelect {
  defaultValue?: string;
  placeholder?: string;
  selectValues: { title: string; value: string }[];
  onValueChange?: (value: string) => void;
  triggerStyle?: string;
}

const ReusableSelect = ({
  defaultValue,
  placeholder,
  selectValues,
  onValueChange,
  triggerStyle,
}: IReusableSelect) => {
  return (
    <Select
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={onValueChange}
      className={triggerStyle}
      style={{ width: '100%' }}
      options={selectValues.map(({ title, value }) => ({
        label: title,
        value: value,
      }))}
    />
  );
};

export default React.memo(ReusableSelect);
