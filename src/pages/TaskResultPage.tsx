import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import GlobalStyles from '../styles/GlobalStyles';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group, Box3, Vector3, MeshNormalMaterial } from 'three';
import backIcon from '../assets/icon/back.png';

interface Task {
  task_id: string;
  task_name: string;
  status: number;
  date: string;
  
  noise_type: string;
  noise_level: number;
}

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const ObjModel = ({ url, wireframe }: { url: string, wireframe: boolean }) => {
  const obj = useLoader(OBJLoader, url) as Group;

  useEffect(() => {
    const box = new Box3().setFromObject(obj);
    const size = box.getSize(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const desiredSize = 2.8;
    const scaleFactor = desiredSize / maxDimension;

    obj.scale.set(scaleFactor, scaleFactor, scaleFactor);

    obj.traverse((child) => {
      if ((child as any).isMesh) {
        (child as any).material = new MeshNormalMaterial({
          wireframe: wireframe,
        });
      }
    });
  }, [obj, wireframe]);

  return <primitive object={obj} />;
};

const TaskResultPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { fileURL, taskName } = location.state || { fileURL: '', taskName: '' };
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get<{ success: boolean; data: { tasks: Task[] } }>(`${process.env.REACT_APP_API_WORKSPACE_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => {
            if (response.data.success) {
              setTasks(response.data.data.tasks);
            }
          })
          .catch(() => {
            setError('Error fetching tasks');
          });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!fileURL) {
      navigate('/api/display/workspace');
    }
  }, [fileURL, navigate]);

  const toggleWireframe = () => {
    setIsWireframe(!isWireframe);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = `${taskName}_result.obj`;
    link.click();
  };

  const currentTask = tasks.find((task) => task.task_name === taskName);
  console.log(currentTask); 

  return (
    <div style={styles.container}>
      <GlobalStyles />
      <div style={styles.uploadSection}>
        {error ? (
          <p>{error}</p>
        ) : (
          fileURL ? (
            <Canvas style={styles.canvas}>
              <ambientLight />
              <pointLight position={[100, 100, 100]} />
              <Suspense fallback={<Loader />}>
                <ObjModel url={fileURL} wireframe={isWireframe} />
              </Suspense>
              <OrbitControls />
            </Canvas>
          ) : (
            <p>결과 파일을 로드하는 중...</p>
          )
        )}
      </div>
      <div style={styles.rightPane}>
        <img src={backIcon} alt="작업 공간" style={styles.backButton} onClick={() => navigate('/api/display/workspace')} />
        <h1 style={styles.heading}>Task Result</h1>
        {currentTask && (
          <div style={styles.taskInfo}>
            <h4>{currentTask.task_name}</h4>
            <p>생성 일자 : {new Date(currentTask.date).toLocaleString()}</p>
            <p>잡음 유형 : {currentTask.noise_type}</p>
            <p>잡음 레벨 : {currentTask.noise_level}</p>
          </div>
        )}
        <button
          onClick={toggleWireframe}
          style={{
            ...styles.wireframeButton,
            backgroundColor: isWireframe ? '#007bff' : 'white',
            color: isWireframe ? 'white' : 'black',
          }}
        >
          {isWireframe ? 'Wireframe 비활성화' : 'Wireframe 활성화'}
        </button>
        <button
          onClick={handleDownload}
          style={{
            ...styles.downloadButton,
          }}
        >
          다운로드
        </button>
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
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '30px',
    width: '50px', 
    height: '50px',
    cursor: 'pointer',
  },
  heading: {
    padding: '10px 20px',
    position: 'absolute',
    top: '60px',
    textAlign: 'center',
  },
  taskInfo: {
    marginBottom: '50px',
    fontSize: '22px',
    textAlign: 'left',
    width: '100%',
  },
  wireframeButton: {
    padding: '10px 20px',
    border: '1px solid #333',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'NanumSquare_R',
  },
  downloadButton: {
    padding: '10px 20px',
    border: '1px solid #333',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'NanumSquare_R',
    backgroundColor: '#28a745',
    color: 'white',
    marginTop: '10px',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
};

export default TaskResultPage;
