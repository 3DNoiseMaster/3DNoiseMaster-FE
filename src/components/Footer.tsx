import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.languageSwitch}>
        <span>한국어</span>
      </div>
      <div style={styles.links}>
        <a href="https://www.remove.bg" style={styles.link}>remove.bg</a> | 
        <a href="https://www.unscreen.com" style={styles.link}>unscreen</a> | 
        <a href="https://www.designify.com" style={styles.link}>designify</a> | 
        <a href="/terms-of-service" style={styles.link}>서비스 약관</a> | 
        <a href="/cookie-policy" style={styles.link}>쿠키 정책</a> | 
        <a href="/privacy-policy" style={styles.link}>개인정보 보호정책</a>
      </div>
      <div style={styles.brand}>
        © Kaleido, a Canva Austria GmbH brand
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f1f1f1',
    borderTop: '1px solid #ddd',
  },
  languageSwitch: {
    marginBottom: '10px',
  },
  links: {
    marginBottom: '10px',
  },
  link: {
    margin: '0 5px',
    color: '#007bff',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  linkHover: {
    color: '#0056b3',
  },
  brand: {
    color: '#777',
  },
};

export default Footer;
