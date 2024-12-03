import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar.jsx';
import Header from '../../Header.jsx';
import Footer from '../../Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { listEmployee, deleteEmployeeService } from '../../service/EmployeeService.js';

const Employees = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5); // You can change the number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employees list when the component mounts
    listEmployee().then((response) => {
      setEmployees(response.data.data);
    }).catch((error) => {
      console.error(error);
    });

    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const updateEmployee = (employeeId) => {
    navigate(`/admin/update-employee/${employeeId}`, { state: { employeeId } });
  };

  const deleteEmployee = (employeeId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?");
    if (confirmDelete) {
      deleteEmployeeService(employeeId).then(() => {
        // Reload employee list after deletion
        listEmployee().then((response) => {
          setEmployees(response.data.data);
        }).catch((error) => {
          console.error(error);
        });
      }).catch((error) => {
        console.error(error);
      });
    }
  };

  const toggleSidebar = () => {
    setIsActive(prev => !prev);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on search change
  };

  // Filtered employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current employees for the current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const pageNumbers = [...Array(totalPages)].map((_, index) => index + 1);

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
                    <h4 className="card-title">Danh sách nhân viên</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div>
                        <a href="/admin/add-employee" className="btn btn-success">Thêm mới</a>
                      </div>
                      <div className='m-2'></div>
                      <form>
                        <div className="input-group ml-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
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
                            <th>Họ và tên</th>
                            <th>Ngày sinh</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Địa chỉ</th>
                            <th>Giới tính</th>
                            <th>Identification</th>
                            <th>Số điện thoại</th>
                            <th>Số điện thoại người thân</th>
                            <th>Email</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentEmployees.map(employee => (
                            <tr key={employee.staffId}>
                              <td>{employee.fullname}</td>
                              <td>{formatDate(employee.dateOfBirth)}</td>
                              <td>{formatDate(employee.startDate)}</td>
                              <td>{formatDate(employee.endDate)}</td>
                              <td>{employee.staffHome}</td>
                              <td>{employee.staffGender ? 'Nam' : 'Nữ'}</td>
                              <td>{employee.staffIdentification}</td>
                              <td>{employee.phoneNumber}</td>
                              <td>{employee.relativesPhone}</td>
                              <td>{employee.staffEmail}</td>
                              <td>
                                <div className="buttons">
                                  <a href="" className="btn btn-primary rounded-pill mb-0 mr-0" onClick={() => updateEmployee(employee.staffId)}>Sửa</a>
                                  <a href="" className="btn btn-danger rounded-pill mb-0 mr-0" onClick={() => deleteEmployee(employee.staffId)}>Xóa</a>
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
                {pageNumbers.map(number => (
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

export default Employees;
