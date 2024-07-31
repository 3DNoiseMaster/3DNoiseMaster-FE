import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface ImageSliderProps {
  firstImage: string;
  secondImage: string;
}

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
`;

const LeftBackground = styled.div<{ position: number }>`
  background-color: black;
  width: ${(props) => props.position}px;
  height: 100%;
`;

const RightBackground = styled.div<{ position: number }>`
  background-color: #2c2c2c;
  width: calc(100% - ${(props) => props.position}px);
  height: 100%;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Image = styled.img<{ clipPath: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  clip-path: ${(props) => props.clipPath};
`;

const Divider = styled.div<{ position: number }>`
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #ffffff00;
  cursor: default;
  left: ${(props) => props.position}px;
`;

const ImageSlider: React.FC<ImageSliderProps> = ({ firstImage, secondImage }) => {
  const [dividerPosition, setDividerPosition] = useState<number>(window.innerWidth / 2);
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateDividerPosition = useCallback((newDividerPosition: number) => {
    setDividerPosition(newDividerPosition);
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const newDividerPosition = event.clientX - rect.left;
      // 가로 이동 폭 제한
      const minPosition = rect.width * 0.1;
      const maxPosition = rect.width * 0.9;
      if (newDividerPosition >= minPosition && newDividerPosition <= maxPosition) {
        requestAnimationFrame(() => updateDividerPosition(newDividerPosition));
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setDividerPosition(window.innerWidth / 2);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <SliderContainer onMouseMove={handleMouseMove} ref={sliderRef}>
      <BackgroundWrapper>
        <LeftBackground position={dividerPosition} />
        <RightBackground position={dividerPosition} />
      </BackgroundWrapper>
      <ImageWrapper>
        <Image
          src={firstImage}
          alt="First Image"
          clipPath={`polygon(0 0, ${dividerPosition}px 0, ${dividerPosition}px 100%, 0 100%)`}
        />
        <Image
          src={secondImage}
          alt="Second Image"
          clipPath={`polygon(${dividerPosition}px 0, 100% 0, 100% 100%, ${dividerPosition}px 100%)`}
        />
      </ImageWrapper>
      <Divider position={dividerPosition} />
    </SliderContainer>
  );
};

export default ImageSlider;