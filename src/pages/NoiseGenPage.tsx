import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group } from 'three';

const NoiseGenPage: React.FC = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null); // for .obj files
  const [noiseType, setNoiseType] = useState<string>('');
  const [noiseLevel, setNoiseLevel] = useState<string>('');

  useEffect(() => {
    return () => {
      // Clean up the object URL when the component unmounts
      if (fileURL) {
        URL.revokeObjectURL(fileURL);
      }
    };
  }, [fileURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setFilePreview(event.target.result);
          if (selectedFile.name.endsWith('.obj')) {
            const url = URL.createObjectURL(selectedFile);
            setFileURL(url);
          } else {
            setFileURL(null);
          }
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !file || !noiseType || !noiseLevel) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('task_name', taskName);
    formData.append('file', file);
    formData.append('noiseType', noiseType);
    formData.append('noiseLevel', noiseLevel);

    try {
      await axios.post(`${process.env.REACT_APP_API_WORKSPACE_URL}/noise-gen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('작업이 성공적으로 생성되었습니다.');
      navigate('/api/display/workspace');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('작업 생성 중 오류가 발생했습니다.');
    }
  };

  const ObjModel = ({ url }: { url: string }) => {
    const obj = useLoader(OBJLoader, url) as Group;
    return <primitive object={obj} />;
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPane}>
        {fileURL && fileURL.endsWith('.obj') ? (
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <ObjModel url={fileURL} />
            </Suspense>
            <OrbitControls />
          </Canvas>
        ) : filePreview ? (
          <img src={filePreview as string} alt="파일 미리보기" style={styles.imagePreview} />
        ) : (
          <p>파일을 업로드하면 여기에 미리보기가 표시됩니다.</p>
        )}
      </div>
      <div style={styles.rightPane}>
        <h1>잡음 생성</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            작업 이름:
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            잡음 유형:
            <input
              type="text"
              value={noiseType}
              onChange={(e) => setNoiseType(e.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            잡음 레벨:
            <input
              type="text"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(e.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            파일 업로드:
            <input
              type="file"
              onChange={handleFileChange}
              required
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.button}>작업 생성</button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  leftPane: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRight: '1px solid #ccc',
  },
  rightPane: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#333',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    width: '100%',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default NoiseGenPage;
