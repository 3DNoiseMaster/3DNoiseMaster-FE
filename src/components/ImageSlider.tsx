import React, { useState } from 'react';
import styled from 'styled-components';
import noiseImage1 from '../assets/image/noise.png'; 
import noiseImage2 from '../assets/image/denoising.png'; 

const images = [
  noiseImage1,
  noiseImage2,
];

const Slider = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: auto;
  overflow: hidden;
  border-radius: 10px;
`;

const SliderImages = styled.div`
  display: flex;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: none;
  &.active {
    display: block;
  }
`;

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderWidth = e.currentTarget.offsetWidth;
    const mouseX = e.clientX - e.currentTarget.getBoundingClientRect().left;
    
    if (mouseX < sliderWidth / 2) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(1);
    }
  };

  return (
    <Slider onMouseMove={handleMouseMove}>
      <SliderImages>
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className={index === currentIndex ? 'active' : ''}
          />
        ))}
      </SliderImages>
    </Slider>
  );
};

export default ImageSlider;
