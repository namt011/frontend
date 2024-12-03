import React, { useState, useEffect } from 'react';
import SideBar from '../../../SideBar.jsx';
import Header from '../../../Header.jsx';
import Footer from '../../../Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { listBuilding, deleteBuildingService } from '../../../service/RoomService.js';

const Buildings = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [buildings, setBuildings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    getAllBuilding();
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    filterBuildings(); // Reapply filtering when the search query or buildings change
  }, [searchQuery, buildings]);

  function getAllBuilding() {
    listBuilding().then((response) => {
      setBuildings(response.data.data);
    }).catch(error => {
      console.error(error);
    });
  }

  // Update the building
  function updateBuilding(buildingId) {
    navigator(`/admin/update-building/${buildingId}`, {
      state: { buildingId }
    });
  }

  // Delete the building
  const deleteBuilding = (buildingId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tòa nhà này?");
    if (confirmDelete) {
      deleteBuildingService(buildingId).then(() => {
        getAllBuilding(); // Refresh list after deletion
      }).catch(error => {
        console.error(error);
      });
    }
  };

  // Handle toggle of sidebar
  const toggleSidebar = () => {
    setIsActive(prev => !prev);
  };

  // Filter buildings based on search query
  const filterBuildings = () => {
    const filtered = buildings.filter(building =>
      building.buildingName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuildings(filtered);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredBuildings.length / itemsPerPage);
  const currentBuildings = filteredBuildings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    <h4 className="card-title">Danh sách tòa nhà</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div>
                        <a href="/admin/add-building" className="btn btn-success">Thêm mới</a>
                      </div>
                      <div className='m-2'></div>
                      <form>
                        <div className="input-group ml-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
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
                            <th>Tên tòa nhà</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentBuildings.map((building) => (
                            <tr key={building.buildingId}>
                              <td>{building.buildingName}</td>
                              <td>{building.buildingDescription}</td>
                              <td>
                                <div className="buttons">
                                  <a
                                    href=""
                                    className="btn btn-primary rounded-pill mb-0 mr-0"
                                    onClick={() => updateBuilding(building.buildingId)}
                                  >
                                    Sửa
                                  </a>
                                  <a
                                    href=""
                                    className="btn btn-danger rounded-pill mb-0 mr-0"
                                    onClick={() => deleteBuilding(building.buildingId)}
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

export default Buildings;
