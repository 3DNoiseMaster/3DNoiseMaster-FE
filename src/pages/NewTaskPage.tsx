import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalStyles from '../styles/GlobalStyles';
import noiseGenIcon from '../assets/icon/noiseGen.png';
import noiseRemIcon from '../assets/icon/noiseRem.png';
import errorCompIcon from '../assets/icon/errorComp.png';

const NewTaskPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <GlobalStyles />
      <div style={styles.selectionContainer}>
        <h1>어떤 작업을 원하세요?</h1>
        <div style={styles.cards}>
          <div style={styles.card} onClick={() => navigate('/api/display/workspace/noiseGen')}>
            <img src={noiseGenIcon} alt="잡음 생성" style={styles.icon} />
            <p>잡음 생성</p>
          </div>
          <div style={styles.card} onClick={() => navigate('/api/display/workspace/noiseRem')}>
            <img src={noiseRemIcon} alt="잡음 제거" style={styles.icon} />
            <p>잡음 제거</p>
          </div>
          <div style={styles.card} onClick={() => navigate('/api/display/workspace/errorComp')}>
            <img src={errorCompIcon} alt="오차율 비교" style={styles.icon} />
            <p>오차율 비교</p>
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
  },
  selectionContainer: {
    textAlign: 'center',
    backgroundColor: '#ffffff',  // Background color for the selection container
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cards: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    width: '150px',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    backgroundColor: '#fff',  // Background color for the cards
  },
  icon: {
    width: '50px',
    height: '50px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default NewTaskPage;
