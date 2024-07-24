import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/api/display/main" style={styles.homeButton}>홈</Link>
        <div style={styles.buttonGroup}>
          <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
        </div>
      </div>
      {user ? (
        <div style={styles.userInfo}>
          <h2>{user.user_name} Workspace</h2>
          <button onClick={handleNewProject} style={styles.newProjectButton}>New Project</button>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
      {taskCount && (
        <div style={styles.taskSummary}>
          <p>totalCount : {taskCount.totalCount}</p>
          <p>beforeCount : {taskCount.beforeCount}</p>
          <p>runningCount : {taskCount.runningCount}</p>
          <p>doneCount : {taskCount.doneCount}</p>
        </div>
      )}
      <div style={styles.taskList}>
        <h3>작업 목록</h3>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map(task => (
              <li key={task.task_id} style={styles.taskItem}>
                <p>
                  작업 이름 : {task.task_name} &nbsp;&nbsp;
                  <button onClick={() => handleDeleteTask(task.task_id)} style={styles.deleteButton}>삭제</button>
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
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>로그인이 필요합니다</h2>
            <p>작업공간에 접근하려면 로그인을 해주세요.</p>
            <button onClick={closeModal} style={styles.closeButton}>로그인 페이지로 이동</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  homeButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  newProjectButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  taskSummary: {
    marginTop: '20px',
  },
  taskList: {
    marginTop: '20px',
    textAlign: 'left',
    display: 'inline-block',
  },
  taskItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  deleteButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default WorkspacePage;
