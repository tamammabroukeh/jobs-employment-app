'use client';

import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import ReusableButton from './Reusable-Button';

export interface IDropdownMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

interface IReusableDropdown {
  items: IDropdownMenuItem[];
  trigger?: ('click' | 'hover' | 'contextMenu')[];
  placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';
  disabled?: boolean;
  children?: React.ReactNode;
  buttonVariant?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  buttonClassName?: string;
}

export default function ReusableDropdown({
  items,
  trigger = ['click'],
  placement = 'bottomRight',
  disabled = false,
  children,
  buttonVariant = 'text',
  buttonClassName,
}: IReusableDropdown) {
  // Convert our items to Ant Design menu format
  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.key,
    label: (
      <div className="flex items-center gap-2">
        {item.icon && <span>{item.icon}</span>}
        <span>{item.label}</span>
      </div>
    ),
    danger: item.danger,
    disabled: item.disabled,
    onClick: item.onClick,
  }));

  const menuProps: MenuProps = {
    items: menuItems,
  };

  return (
    <Dropdown
      menu={menuProps}
      trigger={trigger}
      placement={placement}
      disabled={disabled}
    >
      {children || (
        <ReusableButton
          variant={buttonVariant}
          icon={<MoreOutlined />}
          className={buttonClassName}
          iconOnly
        />
      )}
    </Dropdown>
  );
}
