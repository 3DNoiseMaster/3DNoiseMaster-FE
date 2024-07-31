import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import GlobalStyles from '../styles/GlobalStyles';
import bunnyIcon from '../assets/icon/BlackBunny.png';
import workSpaceEx1 from '../assets/image/workSpace_example_1.png';
import ImageSlider from '../components/ImageSlider';
import '../styles/MainPage.css';
import '../styles/fonts.css';

import noiseImage1 from '../assets/image/noise.png'; 
import noiseImage2 from '../assets/image/denoising.png'; 

const MainPage: React.FC = () => {
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

  return (
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
          <img src={workSpaceEx1} alt="exImge1" className="image" />
        </div>
      </div>

      <div className='page-container-3'>
        <div className="page-image slide-in-left">
          <img src={workSpaceEx1} alt="exImge1" className="image" />
        </div>
        <div className="page-text-3">
          <h1 className='heading-3'>실제와 유사한 잡음 생성</h1>
          <h5 className='subheading-2'>
            Fourier transform을 이용한<br />
            비패턴화 된 잡음을 생성 및 테스트 할 수 있습니다.
          </h5>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
