import React from 'react'
import { useEffect,useState } from 'react';
import SideBar from '../../SideBar';
import Header from '../../Header';
import Footer from '../../Footer';
import { updateUserService } from '../../service/UserService';
import { listStudent2 } from '../../service/StudentService';
import { useNavigate, useParams } from 'react-router-dom';
import { listRole } from '../../service/RoleService';

const Account = () => {
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
    const [studentId, setStudentId] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const { userId } = useParams(); // Lấy userId từ URL
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (userId) {
            console.log('Fetching data for userId:', userId);
            listStudent2(userId)
                .then((response) => {
                    console.log('API response:', response.data);
                    const users = response.data.data;
    
                    // Tìm user có userId tương ứng
                    const user = users.find(u => u.userDTO.userId === userId);
    
                    if (user) {
                        setStudentId(user.studentDTO.studentId);
                        setFullname(user.studentDTO.fullname);
                        setUsername(user.userDTO.username);
                        setPassword(user.userDTO.password);
                        
                        // Kiểm tra role trước khi set
                        if (user.userDTO.role) {
                            setRole(user.userDTO.role.roleId);
                        } else {
                            setRole(''); // Không có role
                        }
                    } else {
                        console.error(`User with ID ${userId} not found`);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    
        // Gọi API lấy danh sách role
        listRole()
            .then((response) => {
                console.log('Role API response:', response.data);
                setRoles(response.data.data); // Lưu danh sách role vào state
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
            });
    
        const handleResize = () => {
            setIsActive(window.innerWidth >= 1200);
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [userId]);

    const saveOrUpdateAccount = (e) => {
        e.preventDefault();

        const updatedUser = { username, password,role: { roleId: role}}; // Gửi roleId

        console.log("Updated User Data: ", updatedUser);
        updateUserService(userId, updatedUser).then((response) => {
            console.log(response.data);
            navigate('/admin/accounts');
        }).catch((error) => {
            alert("Tài khoản đã tồn tại");
            console.error(error);
        });
    };
    

    const toggleSidebar = () => {
        setIsActive(prev => !prev);
    };

    return (
        <div id='app'>
            <div id='main'>
                <Header onToggleSidebar={toggleSidebar} />
                <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
                <div id='main-content'>
                    <section id="multiple-column-form">
                        <div className="row match-height">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header pb-0">
                                        <h4 className="card-title">Cập nhật tài khoản</h4>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-body">
                                            <form className="form">
                                                <div className="row">
                                                    <div className="col-md-6 col-12">
                                                        <div className="form-group">
                                                            <label htmlFor="studentId">Mã sinh viên</label>
                                                            <input type="text" className="form-control" id="studentId" value={studentId} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12">
                                                        <div className="form-group">
                                                            <label htmlFor="fullname">Tên sinh viên</label>
                                                            <input type="text" className="form-control" id="fullname" value={fullname} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12">
                                                        <div className="form-group">
                                                            <label htmlFor="username">Tài khoản</label>
                                                            <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12">
                                                        <div className="form-group">
                                                            <label htmlFor="password">Mật khẩu</label>
                                                            <input type="text" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                    <label htmlFor="role">Role</label>
                                                    <select 
    className="form-select" 
    id="role" 
    value={role || ''} // Giá trị mặc định nếu chưa có role
    onChange={(e) => {
        console.log("Selected Role ID: ", e.target.value); // Log để kiểm tra giá trị role
        setRole(e.target.value); // Cập nhật role khi thay đổi
    }}>
    <option value="" disabled>Chưa có role</option> {/* Tùy chọn mặc định */}
    {roles.length > 0 && roles.map((roleItem) => (
        <option key={roleItem.roleId} value={roleItem.roleId}>
            {roleItem.roleName}
        </option>
    ))}
</select>
</div>
                                                    </div>
                                                    

                                                    <div className="col-12 d-flex justify-content-end">
                                                        <button type="submit" className="btn btn-primary me-1 mb-1" onClick={saveOrUpdateAccount}>Cập nhật</button>
                                                        <button type="reset" className="btn btn-light-secondary me-1 mb-1">Reset</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Account;