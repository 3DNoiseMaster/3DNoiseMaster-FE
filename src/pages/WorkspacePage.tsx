import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import GlobalStyles from '../styles/GlobalStyles';
import homeIcon from '../assets/icon/BlackHome.png';
import '../styles/WorkspacePage.css';

import defaultProfile from '../assets/image/default_profile.png'
import menuicon from '../assets/icon/menu.png'

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
  const [userName, setUserName] = useState<string | null>(null);
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
            const sortedTasks = response.data.data.tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

const handleDownloadTask = (taskId: string) => {
  const token = localStorage.getItem('token');
  if (token) {
      axios.get<DeleteTaskResponse>(`${process.env.REACT_APP_API_WORKSPACE_URL}/tasks/download`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { task_id: taskId }
      })
      .then(response => {
          if (response.data.success) {
              setTasks(tasks.filter(task => task.task_id !== taskId));
          } else {
              console.error('Error downloading task: ', response.data);
          }
      })
      .catch(error => {
          console.error('Error downloading task:', error);
      });
  }
};

const menu = (
  <Menu>
    <Menu.Item key="1">
      <Link to="/api/display/main">HOME</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <button onClick={handleLogout}>LOGOUT</button>
    </Menu.Item>
  </Menu>
);

  return (
    <div className="container">
      <GlobalStyles />
      <div className="header">
        <h2 className='userProfile'>
          <h1 className='title'>
            <img
              src={null/*여기에 사용자의 프로필 이미지 삽입*/ || defaultProfile}
              alt="Profile"
              className="profile"
            />
            &nbsp;{userName}'s WorkSpace
          </h1>
        </h2>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button className='button-menu'>
            <img src={menuicon} alt="icon" className='image-menu'/>
          </Button>
        </Dropdown>
      </div>
      <div className='userInfo'>
        {taskCount && (
          <div className="taskSummary">
            <div className='countingBox'>전체<br/><br/> {taskCount.totalCount}</div>
            <div className='countingBox'>대기중<br/><br/> {taskCount.beforeCount}</div>
            <div className='countingBox'>진행중<br/><br/> {taskCount.runningCount}</div>
            <div className='countingBox'>완료됨<br/><br/> {taskCount.doneCount}</div>
          </div>
        )}
        {user ? (
          <div className="userInfo">
            <h2>{user.user_name} Workspace</h2>&nbsp;&nbsp;
            <button onClick={handleNewProject} className="newProjectButton">+ &nbsp;New Project</button>
          </div>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>
      <div className="taskList">
        <h3>작업 목록</h3>
        {tasks.length > 0 ? (
          <ul>
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
                  {task.status === 100 && task.task_division !== 'error_comp' && (
                    <>
                      <button onClick={() => handleDownloadTask(task.task_id, task.task_name)} className="downloadButton">다운로드</button>
                      <button onClick={() => handleTaskResult(task.task_id, task.task_name)} className="resultButton">작업 결과</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="noTasksMessage">작업물이 없습니다.</p>
        )}
      </div>
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
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
