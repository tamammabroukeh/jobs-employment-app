import { Card, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph } = Typography;

interface IReusableCard {
  children: React.ReactNode;
  description?: string;
  specificDescription?: string;
  title?: string;
  descriptionStyle?: string;
  titleStyle?: string;
  headerStyle?: string;
  styleForCard?: string;
  styleForContent?: string;
  icon?: string;
  iconClasses?: string;
}

const ReusableCard = ({
  children,
  description,
  specificDescription,
  title,
  descriptionStyle,
  titleStyle,
  headerStyle,
  styleForCard,
  styleForContent,
  icon,
  iconClasses,
}: IReusableCard) => {
  return (
    <Card className={`p-4 ${styleForCard || ''}`}>
      <div className={`text-center p-5 ${headerStyle || ''}`}>
        {icon && (
          <div className="p-8 mx-auto border-2 rounded-full w-fit">
            <i className={`${icon} ${iconClasses || ''} text-[40px] block`} />
          </div>
        )}
        {title && (
          <Title level={2} className={`${icon ? 'mt-4' : ''} ${titleStyle || ''}`}>
            {title}
          </Title>
        )}
        {description && (
          <Paragraph className={`text-(--antd-text) ${descriptionStyle || ''}`}>
            {description}
            {specificDescription && (
              <span className="font-semibold block text-center">
                {specificDescription}
              </span>
            )}
          </Paragraph>
        )}
      </div>
      <div className={`mt-2 ${styleForContent || ''}`}>
        {children}
      </div>
    </Card>
  );
};

export default React.memo(ReusableCard);
