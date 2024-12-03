import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar';
import Footer from '../../Footer';
import Header from '../../Header';
import { useNavigate } from 'react-router-dom';
import { listRequirement, deleteRequirementService } from '../../service/RequestService';

const Requests = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);
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
      hour12: false,
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(d);
  };

  function getAllRequirements() {
    listRequirement()
      .then((response) => {
        setRequests(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function updateRequest(requirementId) {
    navigator(`/admin/update-request/${requirementId}`, {
      state: { requirementId },
    });
  }

  const deleteRequest = (requirementId) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?');
    if (confirmDelete) {
      deleteRequirementService(requirementId)
        .then(() => {
          getAllRequirements();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const toggleSidebar = () => {
    setIsActive((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.requirementName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.student.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredRequests.length / requestsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div id='app'>
      <div id='main'>
        <Header onToggleSidebar={toggleSidebar} />
        <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id='main-content'>
          <section className='section'>
            <div className='row' id='table-hover-row'>
              <div className='col-12'>
                <div className='card p-2'>
                  <div className='card-header pb-0'>
                    <h4 className='card-title'>Danh sách yêu cầu</h4>
                  </div>
                  <div className='card-content'>
                    <div className='card-body d-flex'>
                      <div>
                        <a href='/admin/add-request' className='btn btn-success'>
                          Thêm mới
                        </a>
                      </div>
                      <div className='m-2'></div>
                      <form>
                        <div className='input-group ml-3'>
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Tìm kiếm'
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                          <div className='input-group-btn'>
                            <button className='btn btn-default' type='submit'>
                              <i className='bi bi-search'></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className='table-responsive'>
                      <table className='table table-hover'>
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên yêu cầu</th>
                            <th>Nội dung yêu cầu</th>
                            <th>Người yêu cầu</th>
                            <th>Ngày gửi</th>
                            <th>Cập nhật</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRequests.map((request, index) => (
                            <tr key={request.requirementId}>
                              <td>{index + 1}</td>
                              <td>{request.requirementName}</td>
                              <td>{request.requirementDes}</td>
                              <td>{request.student.fullname}</td>
                              <td>{formatDateWithTime(request.createAt)}</td>
                              <td>{formatDateWithTime(request.updateAt)}</td>
                              <td>{request.status}</td>
                              <td>
                                <div className='buttons'>
                                  <a
                                    href=''
                                    className='btn btn-primary rounded-pill mb-0 mr-0'
                                    onClick={() => updateRequest(request.requirementId)}
                                  >
                                    Sửa
                                  </a>
                                  <a
                                    href=''
                                    className='btn btn-danger rounded-pill mb-0 mr-0'
                                    onClick={() => deleteRequest(request.requirementId)}
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
            <div className='pagination justify-content-end'>
              <ul className='pagination'>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className='page-link'
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {pageNumbers.map((number) => (
                  <li
                    key={number}
                    className={`page-item ${currentPage === number ? 'active' : ''}`}
                  >
                    <button onClick={() => handlePageChange(number)} className='page-link'>
                      {number}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                  <button
                    className='page-link'
                    onClick={handleNext}
                    disabled={currentPage === pageNumbers.length}
                  >
                    Next
                  </button>
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

export default Requests;
