import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar.jsx';
import Header from '../../Header.jsx';
import Footer from '../../Footer.jsx';
import { listStudent, deleteStudentService } from '../../service/StudentService.js';
import { useNavigate } from 'react-router-dom';

const Students = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const navigator = useNavigate();

  useEffect(() => {
    getAllStudent();

    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, searchQuery]);

  function getAllStudent() {
    listStudent().then((response) => {
      setStudents(response.data.data);
    }).catch(error => {
      console.error(error);
    });
  }

  const updateStudent = (studentId) => {
    navigator(`/admin/update-student/${studentId}`, {
      state: { studentId },
    });
  };

  const deleteStudent = (studentId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?");
    if (confirmDelete) {
      deleteStudentService(studentId).then(() => {
        getAllStudent();
      }).catch(error => {
        console.error(error);
      });
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const toggleSidebar = () => {
    setIsActive((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = students.filter(student => {
   const lowerSearchQuery = searchQuery.toLowerCase();
   return (
     student.fullname.toLowerCase().includes(lowerSearchQuery) ||
     student.studentId.toString().includes(lowerSearchQuery)
   );
 });

  const pageNumbers = Math.ceil(filteredStudents.length / studentsPerPage);
  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < pageNumbers) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                    <h4 className="card-title">Danh sách sinh viên</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div><a href="/admin/add-student" className="btn btn-success">Thêm mới</a></div>
                      <div className='m-2'></div>
                      <form>
                        <div className="input-group ml-3">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Tìm kiếm" 
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
                            <th>Mã sinh viên</th>
                            <th>Họ và tên</th>
                            <th>Ngày sinh</th>
                            <th>Địa chỉ</th>
                            <th>Giới tính</th>
                            <th>Căn cước công dân</th>
                            <th>Số điện thoại</th>
                            <th>Số điện thoại người thân</th>
                            <th>Email</th>
                            <th>Phòng</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStudents.map(student => (
                            <tr key={student.studentId}>
                              <td>{student.studentId}</td>
                              <td>{student.fullname}</td>
                              <td>{formatDate(student.dateOfBirth)}</td>
                              <td>{student.studentAddress}</td>
                              <td>{student.studentGender ? 'Nam' : 'Nữ'}</td>
                              <td>{student.studentIdentification}</td>
                              <td>{student.phoneNumber}</td>
                              <td>{student.relativesPhone}</td>
                              <td>{student.studentEmail}</td>
                              <td>{student.roomName}</td>
                              <td>
                                <div className="buttons">
                                  <button className="btn btn-primary rounded-pill mb-0 mr-0" onClick={() => updateStudent(student.studentId)}>Sửa</button>
                                  <button className="btn btn-danger rounded-pill mb-0 mr-0" onClick={() => deleteStudent(student.studentId)}>Xóa</button>
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
                {[...Array(pageNumbers)].map((_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button onClick={() => handlePageChange(index + 1)} className="page-link">
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handleNext} disabled={currentPage === pageNumbers}>Next</button>
                </li>
              </ul>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Students;
