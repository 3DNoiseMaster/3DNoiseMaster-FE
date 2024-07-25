import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
            setTasks(response.data.data.tasks);
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
            console.error('Error fetching task count: ', response.data);
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
    navigate('/');
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

  return (
    <div className="workspace-page">
      <div className="header">
        <h2 className='userProfile'>
          <img></img>
          {userName}'s WorkSpace
        </h2>
        <Link to="/api/display/main" className="homeButton">홈</Link>
        <div className="buttonGroup">
          <button onClick={handleLogout} className="logoutButton">로그아웃</button>
        </div>
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
            <button onClick={handleNewProject} className="newProjectButton">New Project</button>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>
      <div className="taskList">
        <h3>작업 목록</h3>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map(task => (
              <li key={task.task_id} className="taskItem">
                <p>
                  작업 이름 : {task.task_name} &nbsp;&nbsp;
                  <button onClick={() => handleDeleteTask(task.task_id)} className="deleteButton">삭제</button>
                </p>
                <p>상태 : {task.status}</p>
                <p>생성일자 : {new Date(task.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>작업물이 없습니다.</p>
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
    </div>
  );
};

export default WorkspacePage;
