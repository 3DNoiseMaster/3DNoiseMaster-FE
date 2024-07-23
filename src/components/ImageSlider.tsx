import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import noiseImage from '../assets/image/noise.png';
import denoisingImage from '../assets/image/denoising.png';

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
`;

const RightBackground = styled.div<{ position: number }>`
  background-color: #2c2c2c;
  flex-grow: 1;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* 이미지가 잘리지 않도록 설정 */
`;

const Divider = styled.div<{ position: number }>`
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #ffffff00;;
  cursor: ew-resize;
  left: ${(props) => props.position}px;
`;

const SecondImage = styled(Image)<{ position: number }>`
  clip-path: inset(0 0 0 ${(props) => props.position}px);
`;

const ImageSlider: React.FC = () => {
  const [dividerPosition, setDividerPosition] = useState<number>(window.innerWidth / 2);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const newDividerPosition = event.clientX - rect.left;
      setDividerPosition(newDividerPosition);
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
        <Image src={noiseImage} alt="First Image" />
        <SecondImage src={denoisingImage} alt="Second Image" position={dividerPosition} />
      </ImageWrapper>
      <Divider position={dividerPosition} />
    </SliderContainer>
  );
};

export default ImageSlider;
