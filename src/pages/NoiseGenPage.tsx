import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlobalStyles from '../styles/GlobalStyles';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group, MeshNormalMaterial } from 'three';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const ObjModel = ({ url, wireframe }: { url: string, wireframe: boolean }) => {
  const obj = useLoader(OBJLoader, url) as Group;
  obj.scale.set(0.2, 0.2, 0.2);

  obj.traverse((child) => {
    if ((child as any).isMesh) {
      (child as any).material = new MeshNormalMaterial({
        wireframe: wireframe,
      });
    }
  });

  return <primitive object={obj} />;
};

const NoiseGenPage: React.FC = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [noiseType, setNoiseType] = useState<string>('Gaussian');
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (fileURL) {
        URL.revokeObjectURL(fileURL);
      }
    };
  }, [fileURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const maxSize = 16 * 1024 * 1024; // 16MB

      if (fileExtension !== 'obj') {
        alert('.obj 확장자 파일을 업로드 해주세요.');
        return;
      }

      if (selectedFile.size > maxSize) {
        alert('파일 크기가 16MB를 초과할 수 없습니다.');
        return;
      }

      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileURL(url);
      setFilePreview(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setFilePreview(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !file || !noiseType || noiseLevel === undefined) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('task_name', taskName);
    formData.append('noiseType', noiseType);
    formData.append('noiseLevel', noiseLevel.toString());
    formData.append('file', file);

    try {
      console.log('Sending form data:', {
        task_name: taskName,
        noiseType: noiseType,
        noiseLevel: noiseLevel,
        file: file,
      });

      const response = await axios.post(`${process.env.REACT_APP_API_WORKSPACE_URL}/request/noiseGen`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Server response:', response);
      alert('작업이 성공적으로 생성되었습니다.');
      navigate('/api/display/workspace');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('작업 생성 중 오류가 발생했습니다.');
    }
  };

  const toggleWireframe = () => {
    setIsWireframe(!isWireframe);
  };

  return (
    <div style={styles.container}>
      <GlobalStyles />
      <div style={styles.uploadSection}>
        {fileURL ? (
          <Canvas style={styles.canvas}>
            <ambientLight />
            <pointLight position={[100, 100, 100]} />
            <Suspense fallback={<Loader />}>
              <ObjModel url={fileURL} wireframe={isWireframe} />
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
        <h1 style={styles.heading}>Noise Generation</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            작업 이름
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label style={{ ...styles.label, ...styles.noiseTypeLabel }}>
            잡음 유형
            <div style={styles.noiseTypeContainer}>
              <button
                type="button"
                onClick={() => setNoiseType('Gaussian')}
                style={{
                  ...styles.noiseTypeButton,
                  backgroundColor: noiseType === 'Gaussian' ? '#007bff' : 'white',
                  color: noiseType === 'Gaussian' ? 'white' : '#333',
                }}
              >
                Gaussian
              </button>
              <button
                type="button"
                onClick={() => setNoiseType('Impulsive')}
                style={{
                  ...styles.noiseTypeButton,
                  backgroundColor: noiseType === 'Impulsive' ? '#007bff' : 'white',
                  color: noiseType === 'Impulsive' ? 'white' : '#333',
                }}
              >
                Impulsive
              </button>
            </div>
          </label>
          <label style={styles.label}>
            잡음 레벨
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
              required
              style={styles.slider}
            />
            <span style={styles.noiseLevelNumber}>{noiseLevel}</span>
          </label>
          <label style={styles.label}>
            파일 업로드 &nbsp;&nbsp;
            <button
            type="button"
            onClick={toggleWireframe}
            style={{
              ...styles.wireframeButton,
              backgroundColor: isWireframe ? '#007bff' : 'white',
              color: isWireframe ? 'white' : 'black',
            }}
          >
            {isWireframe ? 'Wireframe 비활성화' : 'Wireframe 활성화'}
          </button>
            <input
              type="file"
              onChange={handleFileChange}
              required
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    position: 'relative',
  },
  uploadSection: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRight: '1px solid #ccc',
  },
  rightPane: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#333',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heading: {
    padding: '10px 20px',
    position: 'absolute',
    top: '20px',
    textAlign: 'center',
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
    marginBottom: '50px',
    fontSize: '22px',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '8px',
    marginTop: '20px',
    fontSize: '16px',
    maxWidth: '500px',
  },
  noiseTypeLabel: {
    display: 'flex',
    flexDirection: 'column', // Changed to column
    alignItems: 'flex-start', // Align items to the start (left side)
  },
  noiseTypeContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginLeft: '10px',
    marginTop: '20px',
  },
  noiseTypeButton: {
    padding: '10px 20px',
    border: '1px solid #333',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
    fontSize: '14px',
    fontFamily:'NanumSquare_R',
  },
  slider: {
    width: '100%',
    padding: '8px',
    margin: '8px',
    marginTop: '20px',
    fontSize: '16px',
    maxWidth: '500px',
  },
  noiseLevelNumber: {
    fontSize: '14px',
  },
  wireframeButton: {
    padding: '10px 20px',
    border: '1px solid #333',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily:'NanumSquare_R'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    position: 'absolute',
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '20px',
    fontSize: '20px',
    fontFamily:'NanumSquare_B',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
};

export default NoiseGenPage;
