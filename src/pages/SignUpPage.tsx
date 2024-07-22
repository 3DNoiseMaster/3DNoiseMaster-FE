import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUpPage.css'; 

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

  return (
    <div className="container">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          ID:
          <input type="text" name="id" value={formData.id} onChange={handleChange} className="input" required />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input" required />
        </label>
        <label>
          Username:
          <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} className="input" required />
        </label>
        <label>
          Password:
          <div className="passwordContainer">
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="input" 
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="showButton"
            >
              {showPassword ? 'Hide' : 'Show'}
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
              className="input"
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="showButton"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        {passwordError && <p className="error">{passwordError}</p>}
        <button type="submit" className="button">회원가입</button>
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
      <Link to="/api/display/main" className="homeButton">홈</Link>
    </div>
  );
};

export default SignUpPage;
