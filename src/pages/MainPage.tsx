import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import Footer from '../components/Footer';
import GlobalStyles from '../styles/GlobalStyles';
import ImageSlider from '../components/ImageSlider';
import ImageCrossFade from '../components/ImageCrossFade';
import '../styles/MainPage.css';

import noiseImage1 from '../assets/image/noise.png'; 
import noiseImage2 from '../assets/image/denoising.png';
import bunnyIcon from '../assets/icon/BlackBunny.png';
import workSpaceEx1 from '../assets/image/workSpace_example_1.png';
import noiseGenIcon from '../assets/icon/noiseGen.png';
import noiseRemIcon from '../assets/icon/noiseRem.png';
import errorCompIcon from '../assets/icon/errorComp.png';
import WorkspaceEx2_1 from '../assets/image/workSpace_example_2-1.png';
import WorkspaceEx2_2 from '../assets/image/workSpace_example_2-2.png';

const MainPage: React.FC = () => {
  /*로그인 여부에 따른 유저 정보 불러오기*/
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('user_name');
    if (token && storedUserName) {
      setUserName(storedUserName);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });
    
    const elements = document.querySelectorAll('.page-image');
    elements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      elements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  /*page2의 슬라이드 애니메이션*/
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
  
  /*page4에서 마우스 호버 기능*/
  const [containerWidth, setContainerWidth] = useState('45%');

  const handleMouseEnter = () => {
    setContainerWidth('60%');
  };

  const handleMouseLeave = () => {
    setContainerWidth('50%');
  };

  /*폰트 로드 확인*/
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  return (
    <div className={fontsLoaded ? 'fonts-loaded' : ''}>
      <div className="main-container">
        <GlobalStyles />
        <div className="header">
          <div className="headerLeft">
            <img src={bunnyIcon} alt="홈" className="BlackBunny" />
            <h2>3DNoiseMaster</h2>
          </div>
          {userName ? (
            <div className="main-login-container">
              <span className="user-name">Hello, {userName}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user_name');
                  setUserName(null);
                }}
                className="logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons-container">
              <Link to="/api/display/login" className="login">Login</Link>
              <Link to="/api/display/signup" className="signup">Sign Up</Link>
            </div>
          )}
        </div>
        <div className="page-container-1">
          <div className="page-text">
            <h1 className="heading">
              3D메쉬 잡음제거 및<br />
              자체 학습을 통한 추가 기능 지원<br />
            </h1>
            <h5 className="subheading">
              3D 모델의 잡음 제거 및 오차율 측정 기능을 제공하며<br />
              혹은 연구를 위해 잡음을 임의로 생성할 수도 있습니다.<br />
            </h5>
            <Link to="/api/display/workSpace" className="work-space">Get Denoising the 3D mesh</Link>
          </div>
          <div className="image-slider-container">
            <ImageSlider firstImage={noiseImage1} secondImage={noiseImage2}/>
          </div>
        </div>

        <div className='page-container-2'>
          <div className="page-text-2">
            <h1 className='heading-2'>3D 모델의 잡음 제거</h1>
            <h5 className='subheading-2'>
              간편하게 조작 할 수 있는 UI로<br />
              쉽고 빠르게 잡음을 제거할 수 있습니다.
            </h5>
          </div>
          <div className="page-image slide-in-right">
            <animated.img
              src={workSpaceEx1}
              alt="exImge1"
              className="image"
              ref={ref}
              style={animationProps}
            />
          </div>
        </div>

        <div className='page-container-3'>
          <div className='image-cross-container'>
            <ImageCrossFade firstImage={WorkspaceEx2_1} secondImage={WorkspaceEx2_2} />
          </div>

          <div className="page-text-3">
            <h1 className='heading-3'>실제와 유사한 잡음 생성</h1>
            <h5 className='subheading-2'>
              Fourier transform을 이용한<br />
              비패턴화 된 잡음을 생성 및 테스트 할 수 있습니다.
            </h5>
          </div>
        </div>

        <div className="page-container-4">
          <h1 className='heading-4'>원하는 작업을 선택하세요</h1>
          <h5 className='subheading-4'>
            3DNoiseMaster에서 제공하는 다양한 기능으로<br />
            원하는 작업을 실행하고 편집하세요
          </h5>
          <div className="selectionContainer" style={{ width: containerWidth }}>
            <div className="cards">
              <div className='card-container'>
                <div className="card card-noiseGen" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <img src={noiseGenIcon} alt="잡음 생성" className="icon" />
                  <p className="cardText">잡음 생성</p>  
                </div>
                  <div className="hover-text">
                    원하는 유형의<br/>
                    잡음을 생성하고<br/>
                    3D 뷰어로 확인
                  </div>
              </div>
              <div className='card-container'>
                <div className="card card-noiseRem" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <img src={noiseRemIcon} alt="잡음 제거" className="icon" />
                  <p className="cardText">잡음 제거</p>
                </div>
                <div className="hover-text">
                    다양한 형태의<br/>
                    잡음을 쉽게 제거<br/>
                </div>
              </div>
              <div className='card-container'>
                <div className="card card-errorComp" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <img src={errorCompIcon} alt="오차율 비교" className="icon" />
                  <p className="cardText">오차율 비교</p>
                </div>
                  <div className="hover-text">
                    두 메쉬간의<br/>
                    오차율 측정으로<br/>
                    디테일한 비교
                  </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
