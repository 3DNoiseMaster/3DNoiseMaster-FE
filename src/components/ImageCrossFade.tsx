import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

interface ImageCrossFadeProps {
  firstImage: string;
  secondImage: string;
}

const CrossFadeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CrossFadeImage = styled(animated.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageCrossFade: React.FC<ImageCrossFadeProps> = ({ firstImage, secondImage }) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [prevScrollY, setPrevScrollY] = useState<number>(0);

  const handleScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    setScrollDirection(scrollY > prevScrollY ? 'down' : 'up');
    setPrevScrollY(scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY]);

  const fstAnimationProps = useSpring({
    opacity: scrollDirection === 'down' && inView ? 0 : 1,
  });

  const secAnimationProps = useSpring({
    opacity: scrollDirection === 'down' && inView ? 1 : 0,
  });

  return (
    <CrossFadeContainer ref={ref}>
      <CrossFadeImage src={firstImage} style={fstAnimationProps} />
      <CrossFadeImage src={secondImage} style={secAnimationProps} />
    </CrossFadeContainer>
  );
};

export default ImageCrossFade;