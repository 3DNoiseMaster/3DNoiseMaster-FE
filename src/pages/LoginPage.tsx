import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginResponse {
  message: string;
  user_name?: string;
  token?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const [response, setResponse] = useState<LoginResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginUrl = `${process.env.REACT_APP_API_USER_URL}/login`;
    axios.post<LoginResponse>(loginUrl, formData)
      .then(res => {
        console.log('Login response:', res.data);
        setResponse(res.data);
        if (res.data.token && res.data.user_name) {
          localStorage.setItem('token', res.data.token); 
          localStorage.setItem('user_name', res.data.user_name);
          // navigate('/workspace');
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
      });
  };

  return (
    <div style={styles.container}>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          ID:
          <input type="text" name="id" value={formData.id} onChange={handleChange} style={styles.input} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} required />
        </label>
        <button type="submit" style={styles.button}>로그인</button>
      </form>
      {response && (
        <div style={styles.response}>
          <p>{response.message}</p>
          {response.user_name && response.token && (
            <div>
              <p>User Name: {response.user_name}</p>
              <p style={styles.token}>Token: {response.token}</p>
            </div>
          )}
        </div>
      )}
      <div style={styles.links}>
        <Link to="/api/display/signup" style={styles.linkButton}>회원가입</Link>
        <Link to="/api/display/main" style={styles.linkButton}>홈</Link>
        <Link to="/api/display/workspace" style={styles.linkButton}>작업공간</Link>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  form: {
    display: 'inline-block',
    textAlign: 'left',
  },
  input: {
    display: 'block',
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  response: {
    marginTop: '20px',
  },
  token: {
    wordBreak: 'break-all',
  },
  links: {
    marginTop: '20px',
  },
  linkButton: {
    display: 'inline-block',
    margin: '0 10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  }
};

export default LoginPage;
