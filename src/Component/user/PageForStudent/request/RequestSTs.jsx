import React, { useState, useEffect } from 'react';
import SideBarStudent from '../../SideBarStudent';
import HeaderStudent from '../../HeaderStudent';
import Footer from '../../../Footer';
import { useNavigate } from 'react-router-dom';
import { listRequirement, deleteRequirementService } from '../../../service/RequestService';

const RequestSTs = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(3);
  const navigator = useNavigate();

  useEffect(() => {
    getAllRequirements();
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDateWithTime = (date) => {
    const d = new Date(date);
    const options = { 
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(d);
  };

  function getAllRequirements() {
    const studentId = localStorage.getItem('ID');
    listRequirement().then((response) => {
      const filteredRequests = response.data.data.filter(request => request.student.studentId === studentId);
      setRequests(filteredRequests);
    }).catch(error => {
      console.error(error);
    });
  }

  const toggleSidebar = () => {
    setIsActive(prev => !prev);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'WAITING':
        return 'text-danger'; 
      case 'IN_PROGRESS':
        return 'text-warning'; 
      case 'ACTIVE':
        return 'text-success'; 
      default:
        return '';
    }
  };

  const updateRequest = (requirementId) => {
    navigator(`/update-request/${requirementId}`, {
      state: { requirementId }
    });
  };

  const deleteRequest = (requirementId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa yêu cầu này?");
    if (confirmDelete) {
      deleteRequirementService(requirementId).then(() => {
        getAllRequirements();
      }).catch(error => {
        console.error(error);
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const filteredRequests = requests.filter(request => 
    request.requirementName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    request.requirementDes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  return (
    <div id='app'>
      <div id='main'>
        <HeaderStudent onToggleSidebar={toggleSidebar} />
        <SideBarStudent isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id='main-content'>
          <main className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5>Yêu cầu khiếu nại đã gửi</h5>
              <button className="btn btn-primary" id="btnNewRequest" onClick={() => navigator('/add-request')}>Gửi yêu cầu mới</button>
            </div>

            <div className="mb-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tìm kiếm yêu cầu..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
              />
            </div>

            {/* Conditional rendering when no requests */}
            {filteredRequests.length === 0 ? (
              <div className="alert alert-info" role="alert">
                Chưa có yêu cầu được tạo.
              </div>
            ) : (
                <div className="card">
                    <div className="card-body">

                
              <div id="complaintList">
                {currentRequests.map((request, index) => (
                  <div key={request.requirementId} className="border rounded p-3 mb-4 shadow-sm">
                    <h6 className="mb-1">{request.requirementName}</h6>
                    <p className="text-muted mb-2">{formatDateWithTime(request.createAt)} | {formatDateWithTime(request.updateAt)}</p>
                    <p><strong>Nội dung:</strong> {request.requirementDes}</p>
                    <p><strong>Tình trạng:</strong> <span className={getStatusColor(request.status)}>
                      {request.status === 'WAITING' && 'Chưa xử lý'}
                      {request.status === 'IN_PROGRESS' && 'Đang xử lý'}
                      {request.status === 'ACTIVE' && 'Đã xử lý'}
                    </span></p>

                    <div className="buttons">
                      {request.status === 'WAITING'&& (
                        <>
                          <button 
                            className="btn btn-primary ps-5 pe-5" 
                            onClick={() => updateRequest(request.requirementId)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => deleteRequest(request.requirementId)}
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>)}

            {/* Pagination */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => currentPage > 1 && paginate(currentPage - 1)}>
                  <a className="page-link" href="#" tabIndex="-1"><i className="bi bi-chevron-left"></i></a>
                </li>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`} onClick={() => paginate(index + 1)}>
                    <a className="page-link" href="#">{index + 1}</a>
                  </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => currentPage < totalPages && paginate(currentPage + 1)}>
                  <a className="page-link" href="#"><i className="bi bi-chevron-right"></i></a>
                </li>
              </ul>
            </nav>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RequestSTs;
