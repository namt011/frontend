import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../../SideBar.jsx';
import Header from '../../../Header.jsx';
import Footer from '../../../Footer.jsx';
import { listFloor, deleteFloorService } from '../../../service/RoomService.js';

const Floors = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [floors, setFloors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchTerm, setSearchTerm] = useState(''); // State để lưu giá trị tìm kiếm
  const navigator = useNavigate();

  useEffect(() => {
    getAllFloor();
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function getAllFloor() {
    listFloor().then((response) => {
      setFloors(response.data.data);
    }).catch((error) => {
      console.error(error);
    });
  }

  function addNewFloor() {
    navigator('/admin/add-floor');
  }

  function updateFloor(floorId) {
    navigator(`/admin/update-floor/${floorId}`, { state: { floorId } });
  }

  const deleteFloor = (floorId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tầng này?");
    if (confirmDelete) {
      deleteFloorService(floorId).then(() => {
        getAllFloor();
      }).catch(error => {
        console.error(error);
      });
    }
  };

  const toggleSidebar = () => {
    setIsActive(prev => !prev);
  };

  // Logic phân trang
  const indexOfLastFloor = currentPage * itemsPerPage;
  const indexOfFirstFloor = indexOfLastFloor - itemsPerPage;

  // Lọc danh sách tầng theo từ khóa tìm kiếm
  const filteredFloors = floors.filter(floor =>
    floor.floorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.building.buildingName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentFloors = filteredFloors.slice(indexOfFirstFloor, indexOfLastFloor);

  const totalPages = Math.ceil(filteredFloors.length / itemsPerPage);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Cập nhật giá trị tìm kiếm
    setCurrentPage(1); // Quay lại trang đầu khi tìm kiếm mới
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div id="app">
      <div id="main">
        <Header onToggleSidebar={toggleSidebar} />
        <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id="main-content">
          <section className="section">
            <div className="row" id="table-hover-row">
              <div className="col-12">
                <div className="card p-2">
                  <div className="card-header pb-0">
                    <h4 className="card-title">Danh sách các tầng</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div><a href="/admin/add-floor" className="btn btn-success">Thêm mới</a></div>
                      <div className='m-2'></div>
                      <form>
                        <div className="input-group ml-3">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Tìm kiếm..." 
                            value={searchTerm} 
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
                            <th>STT</th>
                            <th>Tên Tầng</th>
                            <th>Tòa</th>
                            <th>Hành Động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentFloors.map((floor, index) =>
                            <tr key={floor.floorId}>
                              <td>{index + 1}</td>
                              <td>{floor.floorName}</td>
                              <td>{floor.building.buildingName}</td>
                              <td>
                                <button className='btn btn-primary rounded-pill mb-0 mr-0' onClick={() => updateFloor(floor.floorId)}>Sửa</button>
                                <button className='btn btn-danger rounded-pill mb-0 mr-0' onClick={() => deleteFloor(floor.floorId)}>Xóa</button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="pagination justify-content-end">
                      <ul className="pagination ">
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

export default Floors;
