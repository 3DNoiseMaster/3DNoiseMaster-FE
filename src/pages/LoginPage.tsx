import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlobalStyles from '../styles/GlobalStyles';
import eyeOpenIcon from '../assets/icon/eye_open.png';
import eyeCloseIcon from '../assets/icon/eye_close.png';
import '../styles/LoginPage.css'; 

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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          navigate('/api/display/main');
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        setIsModalOpen(true);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/api/display/login');
  };

  const handleSignUp = () => {
    navigate('/api/display/signup');
  };

  return (
    <div className="login-container">
      <GlobalStyles />
      <div className="login-box">
        <h1 className="login-header">LOGIN</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            ID
            <input type="text" name="id" value={formData.id} onChange={handleChange} className="input" required />
          </label>
          <label> 
            Password
            <div className="login-button-container">
            <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="password-input" 
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
          <div className="login-button-container">
            <button type="submit" className="login-button">Login</button>
            <button type="button" onClick={handleSignUp} className="login-signup-button">Sign Up</button>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <div className="login-modalOverlay">
          <div className="login-modalContent">
            <h2>로그인이 필요합니다</h2>
            <p>ID 혹은 Password가 틀렸습니다. <br></br>다시 시도해 주세요.</p>
            <button onClick={closeModal} className="closeButton">닫기</button>
          </div>
      </div>
      )}
    </div>
  );
};

export default LoginPage;
