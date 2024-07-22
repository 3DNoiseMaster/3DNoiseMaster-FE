import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.column}>
        <h3 style={styles.title}>INFORMATION</h3>
        <p style={styles.text}>Git : <a href="https://github.com/3DNoiseMaster" style={styles.link}>https://github.com/3DNoiseMaster</a></p>
      </div>
      <div style={styles.column}>
        <h3 style={styles.title}>HELP</h3>
        <p style={styles.text}>jominhyeok0103@gmail.com</p>
        <p style={styles.text}>dayoung2975@gmail.com</p>
        <p style={styles.text}>minhe8564@gmail.com</p>
        <p style={styles.text}>wlsdka12@gmail.com</p>
      </div>
      <div style={styles.column}>
        <h3 style={styles.title}>DEVELOPER</h3>
        <p style={styles.text}>조민혁</p>
        <p style={styles.text}>강다영</p>
        <p style={styles.text}>이민희</p>
        <p style={styles.text}>백진암</p>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    backgroundColor: '#666',
    color: '#fff',
  },
  column: {
    flex: '1',
    padding: '10px',
  },
  title: {
    fontSize: '16px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  text: {
    fontSize: '14px',
    margin: '5px 0',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
};

export default Footer;
