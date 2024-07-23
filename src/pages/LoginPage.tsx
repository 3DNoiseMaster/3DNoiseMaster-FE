import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/LoginPage.css';
import useDynamicCss from '../hooks/UseDynamicCss';

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

  useDynamicCss(`${process.env.PUBLIC_URL}/styles/LoginPage.css`);
  
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  return (
    <div className='login-page'>
      <div className='login-container'>
        <h1 className='title'>LOGIN</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>
            ID
            <input type="text" name="id"
              value={formData.id} 
              onChange={handleChange} 
              className="input-info" required />
          </label>
          <label>
            Password
            <input type="password" name="password" 
            value={formData.password} 
            onChange={handleChange} 
            className="input-info" required />
          </label>
          <div className="spacer_type_1"></div>
          <button type="submit" className="button-submit">로그인</button>
        </form>
        {response && (
          <div className="response">
            <p>{response.message}</p>
            {response.user_name && response.token && (
              <div>
                <p>User Name: {response.user_name}</p>
                <p className="token">Token: {response.token}</p>
              </div>
            )}
          </div>
        )}
        <div className='spacer_type_1'></div>
        <div className="links">
          <Link to="/api/display/signup" className="Button-link">회원가입</Link>
          <span className="divider">|</span>
          <Link to="/api/display/main" className="Button-link">홈</Link>
          <span className="divider">|</span>
          <Link to="/api/display/workspace" className="Button-link">작업공간</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
