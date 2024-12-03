import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar.jsx';
import Header from '../../Header.jsx';
import Footer from '../../Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { listContract, deleteContractService } from '../../service/ContractService.js';

const Contracts = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(10);

  const navigate = useNavigate();

  // Fetch contracts data
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        listContract()
          .then((response) => {
            if (response?.data?.data) {
              const processedData = response.data.data.map(contract => ({
                contractId: contract.contractId,
                student: {
                  studentId: contract.student?.studentId,
                  fullname: contract.student?.fullname
                },
                startDate: contract.startDate,
                endDate: contract.endDate,
                staff: contract.staff,
                contractStatus : contract.contractStatus
              }));
              setContracts(processedData);
              setFilteredContracts(processedData);  // Set filtered data initially
            } else {
              throw new Error('Data structure is invalid');
            }
          })
          .catch(error => {
            setError(error.message);
            setContracts([]);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        setError(error.message);
        setContracts([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete contract
  const deleteContract = (contractId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này?");
    if (confirmDelete) {
      deleteContractService(contractId)
        .then(() => {
          setContracts(contracts.filter(contract => contract.contractId !== contractId));
          setFilteredContracts(filteredContracts.filter(contract => contract.contractId !== contractId));  // Update filtered contracts as well
        })
        .catch((error) => {
          console.error(error);
          setError("Không thể xóa hợp đồng.");
          alert('Không thể xóa hợp đồng.');
        });
    }
  };

  // Update contract
  const updateContract = (contractId) => {
    navigate(`/admin/update-contract/${contractId}`, {
      state: { contractId }
    });
  };

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Search handler
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      setFilteredContracts(contracts.filter(contract =>
        contract.student.fullname.toLowerCase().includes(query) ||
        contract.student.studentId.toLowerCase().includes(query)
      ));
    } else {
      setFilteredContracts(contracts);
    }
    setCurrentPage(1);  // Reset to first page when a search is done
  };

  // Pagination handlers
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirstContract, indexOfLastContract);

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Resize handler for sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
                    <h4 className="card-title">Danh sách hợp đồng </h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div className="m-2"></div>
                      <form>
                        <div className="input-group ml-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm "
                            value={searchQuery}
                            onChange={handleSearch}
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
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr><td colSpan="6">Loading...</td></tr>
                          ) : error ? (
                            <tr><td colSpan="6">Error: {error}</td></tr>
                          ) : currentContracts.length > 0 ? (
                            currentContracts.map((contract, index) => (
                              <tr key={contract.contractId}>
                                <td>{index + 1}</td>
                                <td>{contract.student?.studentId}</td>
                                <td>{contract.student?.fullname}</td>
                                <td>{formatDate(contract.startDate)}</td>
                                <td>{formatDate(contract.endDate)}</td>
                                <td>{contract.contractStatus}</td>
                                <td>
                                  <div className="buttons">
                                    <a href="#" className="btn btn-primary rounded-pill mb-0 mr-0" onClick={() => updateContract(contract.contractId)}>Sửa</a>
                                    <a href="#" className="btn btn-danger rounded-pill mb-0 mr-0" onClick={() => deleteContract(contract.contractId)}>Xóa</a>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="6">No contracts found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    <div className="pagination justify-content-end">
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button onClick={() => handlePageChange(index + 1)} className="page-link">{index + 1}</button>
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

export default Contracts;
