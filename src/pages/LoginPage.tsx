import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css'; 

interface LoginResponse {
  message: string;
  user_name?: string;
  token?: string;
}

const LoginPage: React.FC = () => {
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
    <div className="container">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          ID:
          <input type="text" name="id" value={formData.id} onChange={handleChange} className="input" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="input" required />
        </label>
        <button type="submit" className="button">로그인</button>
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
      <div className="links">
        <Link to="/api/display/signup" className="linkButton">회원가입</Link>
        <Link to="/api/display/main" className="linkButton">홈</Link>
        <Link to="/api/display/workspace" className="linkButton">작업공간</Link>
      </div>
    </div>
  );
};

export default LoginPage;
