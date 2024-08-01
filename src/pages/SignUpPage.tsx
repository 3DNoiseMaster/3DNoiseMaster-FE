import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlobalStyles from '../styles/GlobalStyles';
import eyeOpenIcon from '../assets/icon/eye_open.png';
import eyeCloseIcon from '../assets/icon/eye_close.png';
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
  const navigate = useNavigate();
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

    if (formData.password.length < 8) {
      setPasswordError('비밀번호는 최소 8자 이상이여야 합니다.');
      return;
    }

    if (formData.phone.length < 10) {
      setPasswordError('유효한 전화번호를 입력하세요 (예시: 01012345678)');
      return;
    }

    const signUpUrl = `${process.env.REACT_APP_API_USER_URL}/signup`;
    axios.post<SignUpResponse>(signUpUrl, formData)
      .then(res => {
        setResponse(res.data);
        navigate('/api/display/login');
      })
      .catch(error => {
        console.error('Error during sign up:', error);
        setResponse({ success: false, code: 500, message: 'Sign up failed' });
      });
  };

  return (
    <div className="signup-container">
      <GlobalStyles />
      <div className="signup-box">
        <h1 className="signup-header">SIGN-UP</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <label>
            ID
            <input type="text" name="id" value={formData.id} onChange={handleChange} className="input" required />
          </label>
          <label>
            Phone
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input" required />
          </label>
          <label>
            Username
            <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} className="input" required />
          </label>
          <label>
            Password
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
                <img
                  src={showPassword ? eyeOpenIcon : eyeCloseIcon} 
                  alt={showPassword ? 'Hide' : 'Show'} 
                  className="eyeIcon"
                />
              </button>
            </div>
          </label>
          <label>
            Confirm Password
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
                <img 
                  src={showConfirmPassword ? eyeOpenIcon : eyeCloseIcon} 
                  alt={showConfirmPassword ? 'Hide' : 'Show'} 
                  className="eyeIcon"
                />
              </button>
            </div>
          </label>
          {passwordError && <p className="error">{passwordError}</p>}
          <div className="signup-button-container">
            <button type="submit" className="signup-button">Sign-Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
