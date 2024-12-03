import React, { useState, useEffect } from 'react';
import SideBar from '../../../SideBar';
import Header from '../../../Header';
import Footer from '../../../Footer';
import { listRoomType, deleteRoomTypeService } from '../../../service/RoomService';
import { useNavigate } from 'react-router-dom';

const RoomTypes = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [roomtypes, setRoomtypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoomtypes, setFilteredRoomtypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  
  const navigator = useNavigate();

  useEffect(() => {
    getAllRoomtype();
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    filterRoomtypes(); // Filter room types whenever the search query or roomtypes list changes
  }, [searchQuery, roomtypes]);

  function getAllRoomtype() {
    listRoomType()
      .then((response) => {
        setRoomtypes(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function updateRoomtype(roomTypeId) {
    navigator(`/admin/update-roomtype/${roomTypeId}`, {
      state: {
        roomTypeId,
      },
    });
  }

  const deleteRoomtype = (roomTypeId) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa loại này?');
    if (confirmDelete) {
      deleteRoomTypeService(roomTypeId)
        .then((response) => {
          getAllRoomtype(); // Refresh list after deletion
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const toggleSidebar = () => {
    setIsActive((prev) => !prev);
  };

  // Filter roomtypes based on search query
  const filterRoomtypes = () => {
   const filtered = roomtypes.filter(
     (roomtype) =>
       roomtype.roomTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       roomtype.roomTypeDes.toLowerCase().includes(searchQuery.toLowerCase())
   );
   setFilteredRoomtypes(filtered);
 };

  // Pagination Logic
  const totalPages = Math.ceil(filteredRoomtypes.length / itemsPerPage);
  const currentRoomtypes = filteredRoomtypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <section className='section'>
            <div className='row' id='table-hover-row'>
              <div className='col-12'>
                <div className='card p-2'>
                  <div className='card-header pb-0'>
                    <h4 className='card-title'>Danh sách loại phòng</h4>
                  </div>
                  <div className='card-content'>
                    <div className='card-body d-flex'>
                      <div>
                        <a href='/admin/add-roomtype' className='btn btn-success'>
                          Thêm mới
                        </a>
                      </div>
                      <div className='m-2'></div>
                      <form>
                        <div className='input-group ml-3'>
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Search'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                            <th>Tên loại phòng</th>
                            <th>Mô tả</th>
                            <th>Số người ở tối đa</th>
                            <th>Tiền</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRoomtypes.map((roomtype, index) => (
                            <tr key={roomtype.roomTypeId}>
                              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                              <td>{roomtype.roomTypeName}</td>
                              <td>{roomtype.roomTypeDes}</td>
                              <td>{roomtype.roomNumber}</td>
                              <td>{roomtype.roomTypePrice}</td>
                              <td>
                                <div className='buttons'>
                                  <a
                                    href=''
                                    className='btn btn-primary rounded-pill mb-0 mr-0'
                                    onClick={() => updateRoomtype(roomtype.roomTypeId)}
                                  >
                                    Sửa
                                  </a>
                                  <a
                                    href=''
                                    className='btn btn-danger rounded-pill mb-0 mr-0'
                                    onClick={() => deleteRoomtype(roomtype.roomTypeId)}
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

            {/* Pagination Controls */}
            <div className='pagination justify-content-end'>
              <ul className='pagination'>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className='page-link' onClick={handlePrevious} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button onClick={() => handlePageChange(index + 1)} className='page-link'>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className='page-link' onClick={handleNext} disabled={currentPage === totalPages}>
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

export default RoomTypes;
