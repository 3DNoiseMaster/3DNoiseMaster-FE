// src/styles/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';
import NanumSquareOTF_acEB from '../assets/font/NanumSquareOTF_acEB.otf';
import NanumSquareOTF_acB from '../assets/font/NanumSquareOTF_acB.otf';
import NanumSquareOTF_acL from '../assets/font/NanumSquareOTF_acL.otf';
import NanumSquareOTF_acR from '../assets/font/NanumSquareOTF_acR.otf';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'NanumSquare_EB';
    src: url(${NanumSquareOTF_acEB}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'NanumSquare_B';
    src: url(${NanumSquareOTF_acB}) format('opentype');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'NanumSquare_L';
    src: url(${NanumSquareOTF_acL}) format('opentype');
    font-weight: light;
    font-style: normal;
  }

  @font-face {
    font-family: 'NanumSquare_R';
    src: url(${NanumSquareOTF_acR}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'NanumSquare_R', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`;

export default GlobalStyles;
