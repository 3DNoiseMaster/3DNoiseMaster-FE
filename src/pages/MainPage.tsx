import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import GlobalStyles from '../styles/GlobalStyles';
import ImageSlider from '../components/ImageSlider';
import '../styles/MainPage.css'; 

import bunnyImage from '../assets/icon/bunny_black.png';
import workSpaceEx1 from '../assets/image/workSpace_example_1.png'

const MainPage: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('user_name');
    if (token && storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const [direction, setDirection] = useState<string | null>(null);

  const [ref, inView, entry] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  useEffect(() => {
    if (entry) {
      const { boundingClientRect, rootBounds } = entry;
      if (rootBounds && boundingClientRect.top < rootBounds.top) {
        setDirection(null);
      } else {
        setDirection('down');
      }
    }
  }, [entry]);

  const animationProps = useSpring({
    opacity: inView ? 1 : direction === 'down' ? 0.2 : 1, 
    transform: inView
      ? 'translateX(0%)'
      : direction === 'down'
      ? 'translateX(50%)'
      : 'translateX(0%)',  
  });

  return (
    <div className="main-page">
      <GlobalStyles />
      <div className="header">
        <h2 className="title">
          <img src={bunnyImage} alt="main bunny icon" className="image-bunny" />
          GCN-Denoiser
        </h2>
        {userName ? (
        <div className="login-container">
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_name');
            setUserName(null);
          }} className="button-account">LOGOUT</button>
          <span className="user-name">Hello, {userName}</span>
        </div>
        ) : (
          <Link to="/api/display/login" className="button-account">LOGIN</Link>
        )}
      </div>

      <div className="page-container-1">
        <div className="image-slider-container">
          <ImageSlider />
        </div>
        <h1 className="heading">
          3D메쉬 잡음제거 및<br />
          자체 학습을 통한 추가 기능 지원<br />
        </h1>
        <h5 className="subheading">
          3D 모델의 잡음 제거 및 오차율 측정 기능을 제공하며<br />
          연구를 위해 잡음을 임의로 생성할 수도 있습니다
        </h5>
        <Link 
          to="/api/display/workSpace" 
          className="button-workSpace">Get Denoising the 3D mesh</Link>
      </div>

      <div className='page-container-2'>
        <h1 className='heading'>3D 모델의 잡음 제거</h1>
        <h5 className='subheading'>
          간편하게 조작 할 수 있는 UI로<br />
          쉽고 빠르게 잡음을 제거
        </h5>
        <animated.img
          src={workSpaceEx1}
          alt="exImge1"
          className="image"
          ref={ref}
          style={animationProps}
        />
      </div>

      <div className="page-container-3">
        <h1 className='heading'>실제와 유사한 잡음 생성</h1>
        <h5 className='subheading'>
          푸리에 변환을 이용한<br />
          비패턴화 된 잡음을 생성 및 테스트
        </h5>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;