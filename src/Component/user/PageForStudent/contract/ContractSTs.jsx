import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBarStudent from '../../SideBarStudent.jsx';
import HeaderStudent from '../../HeaderStudent.jsx';
import Footer from '../../../Footer.jsx';
import { listContract, deleteContractService } from '../../../service/ContractService.js';

const ContractSTs = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage, setContractsPerPage] = useState(5); // Set per page value
  const navigate = useNavigate();

  // Get the student ID from localStorage
  const studentIdFromLocalStorage = localStorage.getItem('ID');

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
                contractStatus: contract.contractStatus
              }));

              // Filter contracts by student ID from localStorage
              const filteredContracts = processedData.filter(contract =>
                contract.student?.studentId === studentIdFromLocalStorage
              );
              
              setContracts(filteredContracts);
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
  }, [studentIdFromLocalStorage]); // Re-fetch contracts if the student ID changes

  // Delete contract
  const deleteContract = (contractId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này?");
    if (confirmDelete) {
      deleteContractService(contractId)
        .then((response) => {
          setContracts(contracts.filter(contract => contract.contractId !== contractId));
        })
        .catch((error) => {
          setError("Không thể xóa hợp đồng.");
          alert('Không thể xóa hợp đồng.')
        });
    }
  };

  // Update contract
  const updateContract = (contractId) => {
    navigate(`/detail-contract/${contractId}`, {
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

  // Resize handler for sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Filtered contracts based on search
  const filteredContracts = contracts.filter(contract =>
    contract.student?.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contractStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirstContract, indexOfLastContract);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

  return (
    <div id="app">
      <div id="main">
        <HeaderStudent onToggleSidebar={() => setIsActive(prev => !prev)} />
        <SideBarStudent isActive={isActive} onToggleSidebar={() => setIsActive(prev => !prev)} />
        <div id="main-content">
          <section className="section">
            <div className="row" id="table-hover-row">
              <div className="col-12">
                <div className="card p-2">
                  <div className="card-header pb-0">
                    <h4 className="card-title">Danh sách hợp đồng</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <form>
                        <div className="input-group ml-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm hợp đồng..."
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

                    {/* Display message when no contracts are found */}
                    {loading ? (
                      <div className="text-center">Loading...</div>
                    ) : error ? (
                      <div className="text-center text-danger">Error: {error}</div>
                    ) : filteredContracts.length === 0 ? (
                      <div className="text-center">Chưa có hợp đồng được tạo.</div>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>STT</th>
                                <th>Mã sinh viên</th>
                                <th>Tên sinh viên</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Hành động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentContracts.map((contract, index) => (
                                <tr key={contract.contractId}>
                                  <td>{index + 1}</td>
                                  <td>{contract.student?.studentId}</td>
                                  <td>{contract.student?.fullname}</td>
                                  <td>{formatDate(contract.startDate)}</td>
                                  <td>{formatDate(contract.endDate)}</td>
                                  <td>
                                    <div className="buttons">
                                      <button className="btn btn-primary" onClick={() => updateContract(contract.contractId)}>Chi tiết </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                       
                      </>
                    )}
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

export default ContractSTs;
