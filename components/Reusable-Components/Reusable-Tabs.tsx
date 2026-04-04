'use client';

import { Tabs } from 'antd';
import React from 'react';
import type { TabsProps } from 'antd';

interface IReusableTabs {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  styleForTab?: string;
  styleForTabList?: string;
  styleForTabTrigger?: string;
  tabContentValues?: { value: string; children: React.ReactNode }[];
  tabTriggerValues?: { value: string; title: string }[];
  value?: string;
}

const ReusableTabs = ({
  defaultValue,
  onValueChange,
  styleForTab,
  tabContentValues,
  tabTriggerValues,
  value,
}: IReusableTabs) => {
  const items: TabsProps['items'] = tabTriggerValues?.map((trigger) => {
    const content = tabContentValues?.find((c) => c.value === trigger.value);
    return {
      key: trigger.value,
      label: trigger.title,
      children: content?.children,
    };
  });

  return (
    <Tabs
      activeKey={value}
      defaultActiveKey={defaultValue}
      onChange={onValueChange}
      items={items}
      className={styleForTab}
    />
  );
};

export default React.memo(ReusableTabs);
