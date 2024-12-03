import React, { useEffect, useState } from 'react';
import SideBar from '../../SideBar';
import Header from '../../Header';
import Footer from '../../Footer';
import { listUser, deleteUserService } from '../../service/UserService';
import { useNavigate } from 'react-router-dom';
import { listStudent2 } from '../../service/StudentService';

const Accounts = () => {
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust the number of items per page as needed
    const [filteredStudents, setFilteredStudents] = useState([]);
    const navigator = useNavigate();

    useEffect(() => {
        getAllStudent();
        const handleResize = () => {
            setIsActive(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Filter the students based on the search term
        if (searchTerm === '') {
            setFilteredStudents(students);
        } else {
            setFilteredStudents(students.filter(student =>
                student.studentDTO.studentId.includes(searchTerm) ||
                student.studentDTO.fullname.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        }
    }, [students, searchTerm]);

    const getAllStudent = () => {
        listStudent2().then((response) => {
            setStudents(response.data.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const updateUser = (userId) => {
        navigator(`/admin/update-account/${userId}`);
    };

    const deleteUser = (userId) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
        if (confirmDelete) {
            deleteUserService(userId).then(() => {
                getAllStudent();
            }).catch(error => {
                console.error(error);
            });
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const paginate = (array) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return array.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    return (
        <div id="app">
            <div id="main">
                <Header onToggleSidebar={() => setIsActive(prev => !prev)} />
                <SideBar isActive={isActive} onToggleSidebar={() => setIsActive(prev => !prev)} />
                <div id="main-content">
                    <section className="section">
                        <div className="row" id="table-hover-row">
                            <div className="col-12">
                                <div className="card p-2">
                                    <div className="card-header pb-0">
                                        <h4 className="card-title">Danh sách tài khoản</h4>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-body d-flex">
                                            <div className="m-2"></div>
                                            <form>
                                                <div className="input-group ml-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
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
                                                    {paginate(filteredStudents).map((student, index) => (
                                                        <tr key={student.userDTO.userId}>
                                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                            <td>{student.studentDTO.studentId}</td>
                                                            <td>{student.studentDTO.fullname}</td>
                                                            <td>{student.userDTO.username}</td>
                                                            <td>{student.userDTO.password}</td>
                                                            <td>{student.userDTO.role ? student.userDTO.role.roleName : "Chưa có role"}</td>
                                                            <td>
                                                                <div className="buttons">
                                                                    <a
                                                                        href=""
                                                                        className="btn btn-primary rounded-pill mb-0 mr-0"
                                                                        onClick={() => updateUser(student.userDTO.userId)}
                                                                    >
                                                                        Sửa
                                                                    </a>
                                                                    <a
                                                                        href=""
                                                                        className="btn btn-danger rounded-pill mb-0 mr-0"
                                                                        onClick={() => deleteUser(student.userDTO.userId)}
                                                                    >
                                                                        Xóa
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pagination justify-content-end">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
                                </li>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
                                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                        <button onClick={() => handlePageChange(number)} className="page-link">
                                            {number}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Accounts;
