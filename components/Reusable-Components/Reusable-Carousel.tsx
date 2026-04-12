import { Carousel, CarouselProps } from 'antd';
import { ReactNode } from 'react';

interface ReusableCarouselProps extends Omit<CarouselProps, 'ref'> {
  children: ReactNode;
  showArrows?: boolean;
  arrowClassName?: string;
  containerClassName?: string;
}

export default function ReusableCarousel({
  children,
  containerClassName = '',
  ...carouselProps
}: ReusableCarouselProps) {

  return (
    <div className={`relative ${containerClassName}`}>

      {/* Carousel */}
      <Carousel
        dots={true}
        autoplay
        autoplaySpeed={3000}
        slidesToShow={4}
        slidesToScroll={1}
        infinite
        arrows
        responsive={[
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 1,
            },
          },
        ]}
        {...carouselProps}
      >
        {children}
      </Carousel>
    </div>
  );
}
