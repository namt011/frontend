import React, { useEffect, useState } from 'react';
import SideBar from '../../../SideBar';
import Header from '../../../Header';
import Footer from '../../../Footer';
import { listUser, deleteUserService } from '../../../service/UserService';
import { useNavigate } from 'react-router-dom';
import { listEmployee } from '../../../service/EmployeeService';

const EAccounts = () => {
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);  // You can adjust the items per page
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const navigator = useNavigate();

    useEffect(() => {
        getAllUser();
        getAllEmployee();
        const handleResize = () => {
            setIsActive(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        filterEmployees();  // Reapply filtering when search query changes
    }, [searchQuery, employees]);

    const getAllUser = () => {
        listUser().then((response) => {
            setUsers(response.data.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const getAllEmployee = () => {
        listEmployee().then((response) => {
            setEmployees(response.data.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const updateUser = (userId) => {
        navigator(`/admin/update-e-account/${userId}`);
    };

    const deleteUser = (userId) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
        if (confirmDelete) {
            deleteUserService(userId).then((response) => {
                getAllUser();
            }).catch(error => {
                console.error(error);
            });
        }
    };

    const toggleSidebar = () => {
        setIsActive(prev => !prev);
    };

    // Link user and employee info
    const enrichedEmployees = employees.map(employee => {
        const matchedUser = users.find(user => user.username === employee.userResponse.userName);
        return {
            ...employee,
            userId: matchedUser ? matchedUser.userId : null,
            roleName: matchedUser && matchedUser.role ? matchedUser.role.roleName : "Chưa có role"
        };
    });

    // Filter employees based on the search query (by name)
    const filterEmployees = () => {
        const filtered = enrichedEmployees.filter(employee =>
            employee.fullname.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEmployees(filtered);
    };

    // Pagination Logic
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const currentEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
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
                                            <form onSubmit={(e) => e.preventDefault()}>
                                                <div className="input-group ml-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by name"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
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
                                                        <th>Tên nhân viên</th>
                                                        <th>Tài khoản</th>
                                                        <th>Mật khẩu</th>
                                                        <th>Role</th>
                                                        <th>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentEmployees.map((employee, index) => (
                                                        <tr key={employee.userResponse.userName}>
                                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                            <td>{employee.fullname}</td>
                                                            <td>{employee.userResponse.userName}</td>
                                                            <td>{employee.userResponse.passWord}</td>
                                                            <td>{employee.roleName}</td>
                                                            <td>
                                                                <div className="buttons">
                                                                    <a
                                                                        href=""
                                                                        className="btn btn-primary rounded-pill mb-0 mr-0"
                                                                        onClick={() => updateUser(employee.userId)}
                                                                        disabled={!employee.userId}
                                                                    >
                                                                        Sửa
                                                                    </a>
                                                                    <a
                                                                        href=""
                                                                        className="btn btn-danger rounded-pill mb-0 mr-0"
                                                                        onClick={() => deleteUser(employee.userId)}
                                                                        disabled={!employee.userId}
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
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button onClick={() => handlePageChange(index + 1)} className="page-link">
                                            {index + 1}
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

export default EAccounts;
