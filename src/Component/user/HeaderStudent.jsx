import React, { useState, useEffect } from 'react';
import { listUser } from '../service/UserService';
import { listStudent } from '../service/StudentService';
import { useNavigate } from 'react-router-dom';

const HeaderStudent = ({ onToggleSidebar }) => {
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('User');
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem('accessToken');
  
    // Nếu không có accessToken, không thực hiện việc gọi API
    if (!accessToken) {
      console.log('No access token found, skipping data fetch.');
      return; // Dừng lại nếu không có accessToken
    }
  
    // Tìm người dùng dựa trên accessToken
    const findUserByAccessToken = (users) => {
      let userList = [];
      if (Array.isArray(users)) {
        userList = users;
      } else if (users.data && users.data.data && Array.isArray(users.data.data)) {
        userList = users.data.data;
      } else if (users.users && Array.isArray(users.users)) {
        userList = users.users;
      }
  
      if (Array.isArray(userList)) {
        return userList.find(user => 
          user.accessToken === accessToken || 
          user.accessToken === localStorage.getItem('accessToken')
        );
      }
  
      console.error('Không tìm thấy danh sách người dùng hợp lệ');
      return null;
    };
  
    const fetchUserData = async () => {
      try {
        // Gọi API để lấy dữ liệu người dùng và sinh viên
        const userResponse = await listUser();
        const studentResponse = await listStudent();
  
        const foundUser = findUserByAccessToken(userResponse);
  
        if (foundUser) {
          let studentList = [];
          if (Array.isArray(studentResponse.data)) {
            studentList = studentResponse.data.data;
          } else if (studentResponse.data.data && Array.isArray(studentResponse.data.data)) {
            studentList = studentResponse.data.data;
          }
  
          if (Array.isArray(studentList)) {
            const foundStudent = studentList.find(
              student => student.userResponse.userName === foundUser.username
            );
  
            if (foundStudent) {
              setUserName(foundStudent.fullname);
              setUserRole(foundUser.role?.roleName || 'User');
            }
          } else {
            console.error('Student list is not valid:', studentList);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
    };
  
    fetchUserData(); // Gọi hàm fetchUserData nếu có accessToken
  
  }, []); // Chạy useEffect một lần khi component được mount
  

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        navigate('/login');
      };

  return (
    <div>
      <header className='mb-3'>
        <nav className="navbar navbar-expand navbar-light shadow-sm p-3 bg-body rounded ">
          <div className="container-fluid">
            <a href="#" className="burger-btn d-block sidebar-hide d-xl-none d-block" onClick={onToggleSidebar}>
              <i className="bi bi-justify fs-3"></i>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item dropdown me-1">
                  <a className="nav-link active dropdown-toggle" href="#" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className='bi bi-envelope bi-sub fs-4 text-gray-600'></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li>
                      <h6 className="dropdown-header">Mail</h6>
                    </li>
                    <li><a className="dropdown-item" href="#">No new mail</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown me-3">
                  <a className="nav-link active dropdown-toggle" href="#" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className='bi bi-bell bi-sub fs-4 text-gray-600'></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li>
                      <h6 className="dropdown-header">Notifications</h6>
                    </li>
                    <li><a className="dropdown-item">No notification available</a></li>
                  </ul>
                </li>
              </ul>
              <div className="dropdown">
                <a className='links' href="#" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="user-menu d-flex">
                    <div className="user-name text-end me-3">
                      <h6 className="mb-0 text-gray-600">{userName}</h6>
                      <p className="mb-0 text-sm text-gray-600">{userRole}</p>
                    </div>
                    <div className="user-img d-flex align-items-center">
                      <div className="avatar avatar-md">
                        <img src="https://yt3.ggpht.com/lSClN1ModrCoiB02Xwx5KyiUbBWkO9Qc1Tgnw4LGByp4f6a4y9ZrKnLxGOYK0jcxGGzwoYj1qQ=s108-c-k-c0x00ffffff-no-rj"/>
                      </div>
                    </div>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                  <li>
                    <h6 className="dropdown-header">Hello, {userName}!</h6>
                  </li>
                  <li>
                    <hr className="dropdown-divider"/>
                  </li>
                  <li>
                    <a href="" className="d-flex justify-content-center me-5" onClick={handleLogout}>
                    <i className="icon-mid bi bi-box-arrow-left me-2 text-danger"></i><span className='text-danger'>Đăng xuất</span></a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default HeaderStudent;
