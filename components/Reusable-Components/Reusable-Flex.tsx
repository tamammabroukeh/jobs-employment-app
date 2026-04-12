import { cn } from '@/lib/utils';
import { Flex as AntFlex, FlexProps } from 'antd';
import React from 'react';

interface IFlex extends FlexProps {
  children: React.ReactNode;
  classes?: string;
}

const Flex = ({ children, classes, style, justify = "center", align="center",gap="small", orientation = "horizontal", ...props }: IFlex) => {
  return (
    <AntFlex 
      justify={justify}
      orientation={orientation}
      align={align}
      gap={gap}
      className={cn("text-muted-foreground", classes)} 
      style={style}
      {...props}
    >
      {children}
    </AntFlex>
  );
};

export default React.memo(Flex);
