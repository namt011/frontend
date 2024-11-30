import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const SideBar = ({ isActive, onToggleSidebar }) => {
  const [activeSubmenus, setActiveSubmenus] = useState({});
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const toggleSubmenu = (index) => {
    setActiveSubmenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    // Thực hiện điều hướng đến trang đăng nhập
    localStorage.removeItem('accessToken');
  localStorage.removeItem('role');
  navigate('/login'); // Redirect to the login page
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const sidebarItems = [
    { title: 'Quản lý sinh viên', icon: 'bi-grid-fill', link: '/admin/students' },
    {
      title: 'Quản lý phòng',
      icon: 'bi-stack',
      subItems: [
        { title: 'Tòa nhà', icon: 'bi bi-building', link: '/admin/buildings' },
        { title: 'Tầng', icon: 'bi bi-menu-button-wide-fill', link: '/admin/floors' },
        { title: 'Loại phòng ', icon: 'bi bi-menu-button-wide-fill', link: '/admin/roomtypes' },
        { title: 'Phòng', icon: 'bi bi-app', link: '/admin/rooms' }
      ],
    },
    { title: 'Hợp đồng', icon: 'bi bi-newspaper', link: '/admin/contracts' },
    { title: 'Thanh toán ', icon: 'bi bi-credit-card', link: '/admin/bills' },
    { title: 'Nhân viên', icon: 'bi bi-people-fill', link: '/admin/employees' },
    { title: 'Yêu cầu', icon: 'bi bi-chat-right-dots-fill', link: '/admin/requests' },
    {
      title: 'Quản lý tài khoản',
      icon: 'bi-person-circle',
      subItems: [
        { title: 'Sinh viên', icon: 'bi bi-person-circle', link: '/admin/accounts' },
        { title: 'Nhân viên', icon: 'bi bi-person-circle', link: '/admin/e-accounts' }
      ],
    },
    { title: 'Báo cáo ', icon: 'bi-file-earmark-medical-fill', link: '/admin/report' },
  ];

  return (
    <div>
      <div id="sidebar" className={`sidebar ${isActive ? 'active' : ''}`} ref={sidebarRef}>
        <div className="sidebar-wrapper active" data-simplebar data-simplebar-lg>
          <div className="sidebar-header">
            <div className="d-flex justify-content-between">
              <div className="logo min-vh-10 min-vw-10">
                <Link to="/admin/rooms">
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/03/Logo-Dai-Hoc-Giao-Thong-Van-Tai-UTC.png"
                    alt="Logo"   
                    style={{ width: '40px', height: 'auto' }}   
                  />
                </Link>
              </div>
              <div className='pt-3'><h5>Quản lý KTX</h5></div>
              <div className="toggler">
                <a href="#" className="sidebar-hide d-xl-none d-block" onClick={(e) => {
                  e.preventDefault();
                  onToggleSidebar();
                }}>
                  <i className="bi bi-x bi-middle"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="sidebar-menu">
            <ul className="menu">
              <li className="sidebar-title">Menu</li>
              {sidebarItems.map((item, index) => (
                <li key={index} className={`sidebar-item ${item.subItems ? 'has-sub' : ''}`}>
                  {item.subItems ? (
                    <>
                      <a href="#" className="sidebar-link links delay-150" onClick={(e) => { e.preventDefault(); toggleSubmenu(index); }}>
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.title}</span>
                      </a>
                      <ul className={`submenu ${activeSubmenus[index] ? 'active' : ''}`}>
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex} className="submenu-item">
                            <Link to={subItem.link} className='links'>
                              <i className={subItem.icon}></i> {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link to={item.link} className="sidebar-link">
                      <i className={`bi ${item.icon}`}></i>
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              ))}
              {/* Nút đăng xuất riêng biệt */}
              <li className="sidebar-item">
                <a href="#" className="sidebar-link" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Đăng xuất</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hộp thoại xác nhận đăng xuất */}
      <Dialog
        open={showLogoutDialog}
        onClose={cancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Bạn có chắc chắn muốn đăng xuất không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack spacing={1} sx={{ alignItems: 'center' }}/>
      <Stack direction="row" spacing={1}>
        <Chip onClick={cancelLogout} label="Hủy" color="primary" />
        <Chip onClick={confirmLogout} label="Đồng ý" color="success" />
      </Stack>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SideBar;
