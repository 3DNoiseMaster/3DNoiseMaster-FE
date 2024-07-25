import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalStyles from '../styles/GlobalStyles';
import noiseGenIcon from '../assets/icon/noiseGen.png';
import noiseRemIcon from '../assets/icon/noiseRem.png';
import errorCompIcon from '../assets/icon/errorComp.png';
import homeIcon from '../assets/icon/home.png';
import backIcon from '../assets/icon/back.png';

const NewTaskPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <GlobalStyles />
      <img src={homeIcon} alt="홈" style={styles.homeButton} onClick={() => navigate('/')} />
      <div style={styles.selectionContainer}>
        <h1 style={styles.heading}>어떤 작업을 원하세요?</h1>
        <div style={styles.cards}>
          <div style={styles.card} onClick={() => navigate('/api/display/workspace/noiseGen')}>
            <img src={noiseGenIcon} alt="잡음 생성" style={styles.icon} />
            <p style={styles.cardText}>잡음 생성</p>
          </div>
          <div style={styles.card} onClick={() => navigate('/api/display/workspace/noiseRem')}>
            <img src={noiseRemIcon} alt="잡음 제거" style={styles.icon} />
            <p style={styles.cardText}>잡음 제거</p>
          </div>
          <div style={styles.card} onClick={() => navigate('/api/display/workspace/errorComp')}>
            <img src={errorCompIcon} alt="오차율 비교" style={styles.icon} />
            <p style={styles.cardText}>오차율 비교</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    backgroundColor: '#888',
    minHeight: '100vh', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  homeButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '50px', 
    height: '50px', 
    cursor: 'pointer',
  },
  selectionContainer: {
    textAlign: 'center',
    backgroundColor: '#ffffff',
    padding: '70px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '40%',
  },
  heading: {
    fontSize: '28px', 
    fontFamily: 'NanumSquare_EB', 
    marginBottom: '40px', 
  },
  cards: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    width: '200px',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    backgroundColor: '#fff',
  },
  icon: {
    width: '80px',
    height: '80px',
    marginBottom: '10px',
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: '18px',
    fontFamily: 'NanumSquare_R', 
    marginTop: '15px', 
  },
};

export default NewTaskPage;
