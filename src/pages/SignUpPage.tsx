import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/SignUpPage.css'; 
import useDynamicCss from '../hooks/UseDynamicCss';
import EyeOpenImage from '../assets/icon/eye_open.png';
import EyeCloseImage from '../assets/icon/eye_close.png';

interface SignUpResponse {
  success: boolean;
  code: number;
  message: string;
  data?: {
    user: {
      user_id: string;
      role: string;
      date: string;
      id: string;
      phone: string;
      user_name: string;
      password: string;
    }
  };
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    id: '',
    phone: '',
    user_name: '',
    password: '',
    confirmPassword: ''
  });

  const [response, setResponse] = useState<SignUpResponse | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const signUpUrl = `${process.env.REACT_APP_API_USER_URL}/signup`;
    axios.post<SignUpResponse>(signUpUrl, formData)
      .then(res => setResponse(res.data))
      .catch(error => {
        console.error('Error during sign up:', error);
        setResponse({ success: false, code: 500, message: 'Sign up failed' });
      });
  };

  useDynamicCss('${process.env.PUBLIC_URL}/styles/SignUpPages.css');

  useEffect(() => {
    document.body.classList.add('signup-page');
    return () => {
      document.body.classList.remove('signup-page');
    };
  }, []);

  return (
    <div className="signup-page">
      <div className='container'>
        <h1 className='title'>SIGN-UP</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>
            ID:
            <input type="text" name="id" value={formData.id} onChange={handleChange} className="input-info" required />
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-info" required />
          </label>
          <label>
            Username:
            <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} className="input-info" required />
          </label>
          <label>
            Password:
            <div className="passwordContainer">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="input-info"
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="showButton"
              >
                <img src={showPassword ? EyeOpenImage : EyeCloseImage} alt="Toggle Password" className="button-eye" />
              </button>
            </div>
          </label>
          <label>
            Confirm Password:
            <div className="passwordContainer">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                className="input-info"
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="showButton"
              >
                <img src={showConfirmPassword ? EyeOpenImage : EyeCloseImage} alt="Toggle Confirm Password" className="button-eye" />
              </button>
            </div>
          </label>
          {passwordError && <p className="error">{passwordError}</p>}
          <button type="submit" className="button-signup">회원가입</button>
        </form>
        {response && (
          <div className="response">
            <p>{response.message}</p>
            {response.data && (
              <div>
                <p>User ID: {response.data.user.user_id}</p>
                <p>Role: {response.data.user.role}</p>
                <p>Date: {response.data.user.date}</p>
                <p>ID: {response.data.user.id}</p>
                <p>Phone: {response.data.user.phone}</p>
                <p>Username: {response.data.user.user_name}</p>
              </div>
            )}
          </div>
        )}
        <div className="spacer_type_1"></div>
        <div className="links">
          <Link to="/api/display/login" className="button-link">로그인</Link>
          <span className="divider">|</span>
          <Link to="/api/display/main" className="button-link">홈</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
