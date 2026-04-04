import { Flex as AntFlex, FlexProps } from 'antd';
import React from 'react';

interface IFlex extends FlexProps {
  children: React.ReactNode;
  classes?: string;
}

const Flex = ({ children, classes, style, ...props }: IFlex) => {
  return (
    <AntFlex 
      justify="center" 
      align="center" 
      className={classes} 
      style={style}
      {...props}
    >
      {children}
    </AntFlex>
  );
};

export default React.memo(Flex);
