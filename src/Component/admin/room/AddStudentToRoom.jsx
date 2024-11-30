import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar.jsx';
import Header from '../../Header.jsx';
import Footer from '../../Footer.jsx';
import { listStudent, updateStudentService } from '../../service/StudentService.js';
import { useNavigate, useLocation } from 'react-router-dom';

const AddStudentToRoom = () => {
   const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
   const [students, setStudents] = useState([]);
   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
   const [studentsPerPage] = useState(10);  // Số sinh viên hiển thị mỗi trang
   const location = useLocation();
   const roomName = location.state?.roomName;
   const navigate = useNavigate();

   useEffect(() => {
     getAllStudent();

     const handleResize = () => {
       setIsActive(window.innerWidth >= 1200);
     };

     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);

   function getAllStudent() {
      listStudent().then((response) => {
        const filteredStudents = response.data.data.filter(student => !student.roomName);
        setStudents(filteredStudents);
      }).catch(error => {
        console.error(error);
      });
    }

   function updateStudent(studentId) {
     const student = students.find(s => s.studentId === studentId);
     if (student) {
       updateStudentService(student.studentId, {
         ...student,
         roomName: roomName
       }).then((response) => {
         navigate('/admin/rooms');
       }).catch(error => {
         console.error(error);
       });
     }
   }

   const formatDate = (date) => {
     const d = new Date(date);
     const day = String(d.getDate()).padStart(2, '0');
     const month = String(d.getMonth() + 1).padStart(2, '0');
     const year = d.getFullYear();
     return `${day}-${month}-${year}`;
   };

   const toggleSidebar = () => {
     setIsActive(prev => !prev);
   };

   const handleSearchChange = (e) => {
     setSearchQuery(e.target.value);
   };

   const filteredStudents = students.filter(student => {
     const lowerCaseSearchQuery = searchQuery.toLowerCase();
     return (
       student.studentId.toLowerCase().includes(lowerCaseSearchQuery) ||
       student.fullname.toLowerCase().includes(lowerCaseSearchQuery) ||
       student.studentClass.toLowerCase().includes(lowerCaseSearchQuery) ||
       student.studentEmail.toLowerCase().includes(lowerCaseSearchQuery)
     );
   });

   // Xác định số lượng trang
   const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

   // Tính toán phạm vi sinh viên cần hiển thị trên trang hiện tại
   const indexOfLastStudent = currentPage * studentsPerPage;
   const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
   const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

   // Chức năng chuyển trang
   const nextPage = () => {
     if (currentPage < totalPages) {
       setCurrentPage(currentPage + 1);
     }
   };

   const prevPage = () => {
     if (currentPage > 1) {
       setCurrentPage(currentPage - 1);
     }
   };
   const pageNumbers = [];
   for (let i = 1; i <= totalPages; i++) {
     pageNumbers.push(i);
   }

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
                             <th>Mã sinh viên</th>
                             <th>Họ và tên</th>
                             <th>Lớp</th>
                             <th>Ngày sinh</th>
                             <th>Địa chỉ</th>
                             <th>Giới tính</th>
                             <th>Email</th>
                             <th>Ưu tiên</th>
                             <th>Hành động</th>
                           </tr>
                         </thead>
                         <tbody>
                           {currentStudents.map(student =>
                             <tr key={student.studentId}>
                               <td>{student.studentId}</td>
                               <td>{student.fullname}</td>
                               <td>{student.studentClass}</td>
                               <td>{formatDate(student.dateOfBirth)}</td>
                               <td>{student.studentAddress}</td>
                               <td>{student.studentGender ? 'Nam' : 'Nữ'}</td>
                               <td>{student.studentEmail}</td>
                               <td>{student.studentPriority}</td>
                               <td>
                                 <div className="buttons">
                                   <a href="" className="btn btn-primary rounded-pill mb-0 mr-0" onClick={() => updateStudent(student.studentId)}>Thêm vào {roomName}</a>
                                 </div>
                               </td>
                             </tr>
                           )}
                         </tbody>
                       </table>
                     </div>
                   </div>
                   {/* Các nút phân trang */}
                   <div className="pagination justify-content-end">
                      <ul className="pagination ">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                        </li>
                        {pageNumbers.map(number => (
                          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button onClick={() => handlePageChange(number)} className="page-link">
                              {number}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                        </li>
                      </ul>
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
};

export default AddStudentToRoom;
