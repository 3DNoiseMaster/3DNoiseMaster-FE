import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group, MeshBasicMaterial } from 'three';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const ObjModel = ({ url, wireframe }: { url: string, wireframe: boolean }) => {
  const obj = useLoader(OBJLoader, url) as Group;
  obj.scale.set(0.1, 0.1, 0.1);

  obj.traverse((child) => {
    if ((child as any).isMesh) {
      (child as any).material = new MeshBasicMaterial({
        color: 0x000000,
        wireframe: wireframe,
      });
    }
  });

  return <primitive object={obj} />;
};

const ErrorCompPage: React.FC = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState<string>('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [fileURL1, setFileURL1] = useState<string | null>(null);
  const [fileURL2, setFileURL2] = useState<string | null>(null);
  const [filePreview1, setFilePreview1] = useState<string | ArrayBuffer | null>(null);
  const [filePreview2, setFilePreview2] = useState<string | ArrayBuffer | null>(null);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (fileURL1) {
        URL.revokeObjectURL(fileURL1);
      }
    };
  }, [fileURL1]);

  useEffect(() => {
    return () => {
      if (fileURL2) {
        URL.revokeObjectURL(fileURL2);
      }
    };
  }, [fileURL2]);

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (fileExtension !== 'obj') {
        alert('.obj 확장자 파일을 업로드 해주세요.');
        return;
      }

      setFile1(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileURL1(url);
      setFilePreview1(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setFilePreview1(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (fileExtension !== 'obj') {
        alert('.obj 확장자 파일을 업로드 해주세요.');
        return;
      }

      setFile2(selectedFile);  // 여기를 수정했습니다.
      const url = URL.createObjectURL(selectedFile);
      setFileURL2(url);
      setFilePreview2(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setFilePreview2(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !file1 || !file2) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('task_name', taskName);
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      console.log('Sending form data:', {
        task_name: taskName,
        file1: file1.name,
        file2: file2.name,
      });

      const response = await axios.post(`${process.env.REACT_APP_API_WORKSPACE_URL}/request/errorComp`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
      <div style={styles.leftPane}>
        {fileURL1 ? (
          <Canvas style={styles.canvas}>
            <ambientLight />
            <pointLight position={[100, 100, 100]} />
            <Suspense fallback={<Loader />}>
              <ObjModel url={fileURL1} wireframe={isWireframe} />
            </Suspense>
            <OrbitControls />
          </Canvas>
        ) : filePreview1 ? (
          <img src={filePreview1 as string} alt="파일 미리보기 1" style={styles.imagePreview} />
        ) : (
          <p>첫 번째 파일을 업로드하면 여기에 미리보기가 표시됩니다.</p>
        )}
      </div>
      <div style={styles.leftPane}>
        {fileURL2 ? (
          <Canvas style={styles.canvas}>
            <ambientLight />
            <pointLight position={[100, 100, 100]} />
            <Suspense fallback={<Loader />}>
              <ObjModel url={fileURL2} wireframe={isWireframe} />
            </Suspense>
            <OrbitControls />
          </Canvas>
        ) : filePreview2 ? (
          <img src={filePreview2 as string} alt="파일 미리보기 2" style={styles.imagePreview} />
        ) : (
          <p>두 번째 파일을 업로드하면 여기에 미리보기가 표시됩니다.</p>
        )}
      </div>
      <div style={styles.rightPane}>
        <h1>오차율 비교</h1>
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
            첫 번째 파일 업로드:
            <input
              type="file"
              onChange={handleFile1Change}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            두 번째 파일 업로드:
            <input
              type="file"
              onChange={handleFile2Change}
              required
              style={styles.input}
            />
          </label>
          <button type="button" onClick={toggleWireframe} style={styles.wireframeButton}>
            {isWireframe ? 'Wireframe 비활성화' : 'Wireframe 활성화'}
          </button>
          <button type="submit" style={styles.submitButton}>작업 생성</button>
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
    flex: 1,
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
  wireframeButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default ErrorCompPage;
