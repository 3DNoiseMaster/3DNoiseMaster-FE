import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import GlobalStyles from '../styles/GlobalStyles';
import ImageSlider from '../components/ImageSlider';

import bunnyImage from '../assets/icon/bunny_black.png';
import noiseImage from '../assets/image/noise.png';
import denoisingImage from '../assets/image/denoising.png';
import originalImage from '../assets/image/original.png';
import '../styles/MainPage.css'; 

const MainPage: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('user_name');
    if (token && storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div className="main-container">
      <GlobalStyles />
      <div className="header">
        <h2 className="title">
          <img src={bunnyImage} alt="main bunny icon" className="image-bunny" />
          GCN-Denoiser
        </h2>
        {userName ? (
        <div className="login-container">
          <span className="user-name">Hello, {userName}</span>
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_name');
            setUserName(null);
          }} className="button-logout">로그아웃</button>
        </div>
        ) : (
          <Link to="/api/display/login" className="button-login">LOGIN</Link>
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
          연구를 위해 잡음을 임의로 생성할 수도 있습니다<br />
        </h5>
        <Link to="/api/display/workSpace" className="work-space">Get Denoising the 3D mesh</Link>
      </div>

      <div className="image-container">
        <div className="image-section">
          <img src={noiseImage} alt="Noise" className="image"/>
          <p className="image-label">NOISE</p>
        </div>
        <div className="image-section">
          <img src={denoisingImage} alt="Denoising" className="image"/>
          <p className="image-label">DENOISING</p>
        </div>
        <div className="image-section">
          <img src={originalImage} alt="Original" className="image"/>
          <p className="image-label">ORIGINAL</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;