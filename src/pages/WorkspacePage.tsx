import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlobalStyles from '../styles/GlobalStyles';
import homeIcon from '../assets/icon/BlackHome.png';
import '../styles/WorkspacePage.css';

interface LoginStatusResponse {
  success: boolean;
  data?: {
    user: {
      user_name: string;
    };
  };
}

interface Task {
  task_id: string;
  task_name: string;
  status: number;
  date: string;
  
  error_rate: number; 
  task_division: string;
}

interface TaskCount {
  totalCount: number;
  beforeCount: number;
  runningCount: number;
  doneCount: number;
}

interface DeleteTaskResponse {
  success: boolean;
}

const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ user_name: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskCount, setTaskCount] = useState<TaskCount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get<LoginStatusResponse>(`${process.env.REACT_APP_API_USER_URL}/login/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        console.log('Login status response:', response);
        if (response.data.success) {
          const user_name = response.data.data?.user?.user_name;
          if (user_name) {
            setUser({ user_name });
            localStorage.setItem('user_name', user_name);
          }
        } else {
          setIsModalOpen(true);
        }
      })
      .catch(error => {
        console.error('Error verifying token:', error);
        setIsModalOpen(true);
      });
    } else {
      setIsModalOpen(true);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get<{ success: boolean; data: { tasks: Task[] } }>(`${process.env.REACT_APP_API_WORKSPACE_URL}/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          console.log('Tasks response:', response);
          if (response.data.success) {
            const sortedTasks = response.data.data.tasks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTasks(sortedTasks);
          } else {
            console.error('Error fetching tasks: ', response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
        });

        axios.get<{ success: boolean; data: { count: TaskCount } }>(`${process.env.REACT_APP_API_WORKSPACE_URL}/tasks/count`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          console.log('Task count response:', response);
          if (response.data.success) {
            setTaskCount(response.data.data.count);
          } else {
            console.error('Error fetching task count:', response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching task count:', error);
        });
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_name');
    localStorage.removeItem('token');
    navigate('/api/display/main');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/api/display/login');
  };

  const handleNewProject = () => {
    navigate('/api/display/workspace/newTask');
  };

  const handleDeleteTask = (taskId: string) => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.delete<DeleteTaskResponse>(`${process.env.REACT_APP_API_WORKSPACE_URL}/tasks/delete`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { task_id: taskId }
        })
        .then(response => {
            if (response.data.success) {
                setTasks(tasks.filter(task => task.task_id !== taskId));
            } else {
                console.error('Error deleting task: ', response.data);
            }
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
    }
};

const handleDownloadTask = (taskId: string, taskName: string) => {
  const token = localStorage.getItem('token');
  if (token) {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_WORKSPACE_URL}/tasks/download`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { task_id: taskId },
      responseType: 'blob', 
    })
    .then(response => {
      setIsLoading(false);
      const blob = new Blob([response.data as BlobPart], { type: 'application/x-obj' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `${taskName}_result.obj`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => {
      setIsLoading(false);
      console.error('Error downloading task:', error);
    });
  } else {
    console.error('No token found in localStorage');
  }
};

const handleTaskResult = (taskId: string, taskName: string) => {
  const token = localStorage.getItem('token');
  if (token) {
      setIsLoading(true); 
      axios.get(`${process.env.REACT_APP_API_WORKSPACE_URL}/tasks/download`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { task_id: taskId },
          responseType: 'blob',
      })
      .then(response => {
          setIsLoading(false);
          const blob = new Blob([response.data as BlobPart], { type: 'application/x-obj' });
          const url = window.URL.createObjectURL(blob);
          navigate('/api/display/workspace/taskResult', { state: { fileURL: url, taskName: taskName, taskId: taskId } });
      })
      .catch(error => {
          setIsLoading(false);
          console.error('Error downloading task:', error);
      });
  } else {
      console.error('No token found in localStorage');
  }
};

  return (
    <div className="workspace-container">
      <GlobalStyles />
      <div className="header">
      <div className="headerLeft">
        <img src={homeIcon} alt="홈" className="homeButton" onClick={() => navigate('/api/display/main')} />
        {user ? (
          <div className="userInfo">
            <h2>{user.user_name} Workspace</h2>&nbsp;&nbsp;
            <button onClick={handleNewProject} className="newProjectButton">+ &nbsp;New Project</button>
          </div>
        ) : (
          <p>로딩 중...</p>
        )}
        </div>
        <div className="buttonGroup">
          <button onClick={handleLogout} className="logoutButton">Logout</button>
        </div>
      </div>
      {taskCount && (
        <div className="cardContainer">
          <div className="cardContainer-in">
          <div className="card">
            <div className="cardTitle">Total</div>
            <div className="cardNumber">{taskCount.totalCount}</div>
          </div>
          <div className="card">
            <div className="cardTitle">Before</div>
            <div className="cardNumber">{taskCount.beforeCount}</div>
          </div>
          <div className="card">
            <div className="cardTitle">Running</div>
            <div className="cardNumber">{taskCount.runningCount}</div>
          </div>
          <div className="card">
            <div className="cardTitle">Done</div>
            <div className="cardNumber">{taskCount.doneCount}</div>
          </div>
          </div>
        </div>
      )}
      <div className="taskContainer">
        {tasks.length > 0 ? (
          <div className="taskList">
            {tasks.map(task => (
              <div key={task.task_id} className="taskCard">
                <p className="taskDivisionButton">
                  {task.task_division === 'noise_gen' ? '잡음 생성' : 
                  task.task_division === 'noise_rem' ? '잡음 제거' : 
                  task.task_division === 'error_comp' ? '오차율 비교' : 
                  task.task_division}
                </p>
                <h4>{task.task_name}</h4>
                <p>작업 상태 <progress value={task.status} max="100" className="progressBar"></progress> {task.status}%</p>
                <p>생성 일자 :  {new Date(task.date).toLocaleString()}</p>
                {task.status === 100 && task.task_division == 'error_comp' &&(
                  <p>오차 거리 : {task.error_rate}</p>
                )}
                <div className="taskButtons">
                  <button onClick={() => handleDeleteTask(task.task_id)} className="deleteButton">삭제</button>
                  {task.status === 100 && task.task_division != 'error_comp' && (
                    <>
                      <button onClick={() => handleDownloadTask(task.task_id, task.task_name)} className="downloadButton">다운로드</button>
                      <button onClick={() => handleTaskResult(task.task_id, task.task_name)} className="resultButton">작업 결과</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>작업물이 없습니다.</p>
        )}
      </div>
      {isModalOpen && (
        <div className="workspace-modalOverlay">
          <div className="workspace-modalContent">
            <h2>로그인이 필요합니다</h2>
            <p>작업공간에 접근하려면 로그인을 해주세요.</p>
            <button onClick={closeModal} className="closeButton">로그인 페이지로 이동</button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="loadingOverlay">
          <div className="loadingContent">
            로딩 중...
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
