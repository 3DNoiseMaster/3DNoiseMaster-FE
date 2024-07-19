import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; 

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
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h2 style={styles.title}>3D Noise Master</h2>
        {userName ? (
          <div style={styles.loginContainer}>
            <span style={styles.userName}>Hello, {userName}</span>
            <button onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user_name');
              setUserName(null);
            }} style={styles.logout}>로그아웃</button>
          </div>
        ) : (
          <Link to="/api/display/login" style={styles.login}>로그인</Link>
        )}
      </div>
      <div style={styles.pageContainer}>
        <h1 style={styles.heading}>
          3D메쉬 잡음제거 및<br />
          자체 학습을 통한 추가 기능 지원<br />
        </h1>
        <h5 style={styles.subheading}>
          3D 모델의 잡음 제거 및 오차율 측정 기능을 제공하며<br />
          혹은 연구를 위해 잡음을 임의로 생성할 수도 있습니다<br />
        </h5>
        <Link to="/api/display/workspace" style={styles.workSpace}>Get Denoising the 3D mesh</Link>
      </div>
      <Footer />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
  },
  titleContainer: {
    marginTop: '20px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
  },
  loginContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  login: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  logout: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
  },
  userName: {
    marginRight: '10px',
    fontSize: '1rem',
    color: '#333',
  },
  pageContainer: {
    textAlign: 'center',
    margin: '40px 0',
  },
  heading: {
    fontSize: '2rem',
    color: '#555',
    lineHeight: 1.5,
  },
  subheading: {
    fontSize: '1.2rem',
    color: '#777',
    lineHeight: 1.5,
    marginTop: '20px',
  },
  workSpace: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '15px 30px',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  workSpaceHover: {
    backgroundColor: '#218838',
  },
  dataContainer: {
    marginTop: '40px',
  },
};

export default MainPage;
