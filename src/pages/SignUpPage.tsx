import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div style={styles.container}>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          ID:
          <input type="text" name="id" value={formData.id} onChange={handleChange} style={styles.input} required />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} required />
        </label>
        <label>
          Username:
          <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} style={styles.input} required />
        </label>
        <label>
          Password:
          <div style={styles.passwordContainer}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              style={styles.input} 
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={styles.showButton}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        <label>
          Confirm Password:
          <div style={styles.passwordContainer}>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              style={styles.input}
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              style={styles.showButton}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        {passwordError && <p style={styles.error}>{passwordError}</p>}
        <button type="submit" style={styles.button}>회원가입</button>
      </form>
      {response && (
        <div style={styles.response}>
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
      <Link to="/api/display/main" style={styles.homeButton}>홈</Link>
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
    width: 'calc(100% - 40px)',
  },
  passwordContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  showButton: {
    marginLeft: '10px',
    padding: '8px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
  error: {
    color: 'red',
    fontSize: '14px',
  },
  homeButton: {
    display: 'inline-block',
    margin: '0 10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  }
};

export default SignUpPage;
