import React from 'react'
import { useEffect, useState } from 'react';
import SideBar from '../../../SideBar';
import Header from '../../../Header';
import Footer from '../../../Footer';
import { updateUserService, get1UserService } from '../../../service/UserService';
import { useNavigate, useParams } from 'react-router-dom';
import { listRole } from '../../../service/RoleService';
import { listEmployee } from '../../../service/EmployeeService';

const EAccount = () => {
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
    const [staffId, setStaffId] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [currentEmployee, setCurrentEmployee] = useState(null);

    const { userId } = useParams();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Fetch roles
        listRole()
            .then((response) => {
                setRoles(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
            });

        // Fetch employees list
        listEmployee()
            .then((response) => {
                setEmployees(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
            });

        // Fetch user details if userId exists
        if (userId) {
            get1UserService(userId)
                .then((userResponse) => {
                    const userData = userResponse.data.data;
                    setUsername(userData.username);
                    setPassword(userData.password);
                    
                    setRole(userData.role?.roleId || '');

                    // Find matching employee by username
                    const matchedEmployee = employees.find(
                        emp => emp.userResponse?.userName === userData.username
                    );

                    if (matchedEmployee) {
                        setCurrentEmployee(matchedEmployee);
                        setStaffId(matchedEmployee.staffId);
                        setFullname(matchedEmployee.fullname);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                });
        }

        const handleResize = () => {
            setIsActive(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [userId]); // Added employees to dependency array to recheck when employees list changes

    const saveOrUpdateAccount = (e) => {
        e.preventDefault();
    
        const updatedUser = { 
            username,
            password,
            role: role ? { roleId: role } : null // Handle case where no role is selected
        };
    
        updateUserService(userId, updatedUser)
            .then((response) => {
                navigate('/admin/e-accounts');
            })
            .catch((error) => {
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
                                                            <label htmlFor="username">Tài khoản</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="username" 
                                                                value={username} 
                                                                onChange={(e) => setUsername(e.target.value)} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12">
                                                        <div className="form-group">
                                                            <label htmlFor="password">Mật khẩu</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="password" 
                                                                value={password} 
                                                                onChange={(e) => setPassword(e.target.value)} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                    <label htmlFor="role">Role</label>
                                                    <select 
        className="form-select" 
        id="role" 
        value={role || ''} 
        onChange={(e) => {
            const selectedRoleId = e.target.value;
            console.log("Selected Role ID: ", selectedRoleId);
            setRole(selectedRoleId);
        }}
    >
        <option value="">Chọn role</option>
        {roles.map((roleItem) => (
            <option key={roleItem.roleId} value={roleItem.roleId}>
                {roleItem.roleName}
            </option>
        ))}
    </select>
</div>
</div>
                                                    <div className="col-12 d-flex justify-content-end">
                                                        <button 
                                                            type="submit" 
                                                            className="btn btn-primary me-1 mb-1" 
                                                            onClick={saveOrUpdateAccount}
                                                        >
                                                            Cập nhật
                                                        </button>
                                                        <button 
                                                            type="reset" 
                                                            className="btn btn-light-secondary me-1 mb-1"
                                                        >
                                                            Reset
                                                        </button>
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

export default EAccount;