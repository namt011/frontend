import React from 'react'
import { useEffect, useState } from 'react';
import SideBar from '../../SideBar';
import Header from '../../Header';
import Footer from '../../Footer';
import { listUser, deleteUserService } from '../../service/UserService';
import { useNavigate } from 'react-router-dom';
import { listStudent2 } from '../../service/StudentService';

const Accounts = () => {
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
    const [users, setUsers] = useState([]);
    const [students, setStudents] = useState([]);
    const navigator = useNavigate();

    useEffect(() => {
        getAllUser();
        getAllStudent();
        const handleResize = () => {
            setIsActive(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    function getAllUser(){
        listUser().then((response) => {
            setUsers(response.data.data);
        }).catch(error => {
            console.error(error);
        })
    }

    function getAllStudent(){
        listStudent2().then((response) => {
            setStudents(response.data.data);
        }).catch(error => {
            console.error(error);
        })
    }

    function updateUser(userId) {
      navigator(`/admin/update-account/${userId}`);  // Remove the state object
  }

    const deleteUser = (userId) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
        if (confirmDelete) {
            deleteUserService(userId).then((response) => {
                getAllUser();
            }).catch(error => {
                console.error(error);
            });
        }
    }

    const toggleSidebar = () => {  
        setIsActive(prev => !prev); 
    }; 


    return (
        <div id='app'>
            <div id='main'>
                <Header onToggleSidebar={toggleSidebar} />
                <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
                <div id='main-content'>
                    <section className="section">
                        <div className="row" id="table-hover-row">
                            <div className="col-12">
                                <div className="card p-2">
                                    <div className="card-header pb-0">
                                        <h4 className="card-title">Danh sách tài khoản</h4>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-body d-flex">
                                            <div className='m-2'></div>
                                            <form>
                                                <div className="input-group ml-3">
                                                    <input type="text" className="form-control" placeholder="Search"/>
                                                    <div className="input-group-btn">
                                                        <button className="btn btn-default" type="submit">
                                                            <i className="bi bi-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Mã sinh viên</th>
                                                        <th>Tên sinh viên</th>
                                                        <th>Tài khoản</th>
                                                        <th>Mật khẩu</th>
                                                        <th>Role</th>
                                                        <th>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                      students.map((student,index) =>
                                                         <tr key={student.userDTO.userId}>
                                                            <td>{index + 1}</td>
                                                            <td>{student.studentDTO.studentId}</td>
                                                            <td>{student.studentDTO.fullname}</td>
                                                            <td>{student.userDTO.username}</td>
                                                            <td>{student.userDTO.password}</td>
                                                            <td>{student.userDTO.role ? student.userDTO.role.roleName : "Chưa có role"}</td>
                                                            <td>
                                       <div className="buttons">
                                          <a href="" className="btn btn-primary rounded-pill mb-0 mr-0" onClick={()=>updateUser(student.userDTO.userId)}>Sửa </a>
                                          <a href="" className="btn btn-danger rounded-pill mb-0 mr-0" onClick={()=>deleteUser(student.userDTO.userId)}>Xóa </a>
                                       </div>
                                    </td>
                                                         </tr>
                                                       )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer/>
            </div>
        </div>
    )
}

export default Accounts