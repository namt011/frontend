import React, { useEffect, useState } from 'react';
import SideBar from '../../SideBar';
import Footer from '../../Footer';
import Header from '../../Header';
import { listBill, deleteBillService } from '../../service/BillService';

const Bills = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [bills, setBills] = useState([]); // State to store all bills data
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(5); // Items per page for pagination
  const [searchQuery, setSearchQuery] = useState(""); // Search query for room name

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data from the API and update the state
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await listBill(); // Fetch the list of bills
        if (response?.data.data) {
          setBills(response.data.data); // Set the bills data into state
        }
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, []);

  // Filter bills based on search query (room name)
  const filteredBills = bills.filter(bill => 
    bill.roomDTO?.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic: Slice the bills based on current page and items per page
  const indexOfLastBill = currentPage * itemsPerPage;
  const indexOfFirstBill = indexOfLastBill - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

  // Render table rows for bills
  const renderRows = () => {
    return currentBills.map((bill, index) => (
      <tr key={bill.billId}>
        <td>{index + 1}</td>
        <td>
          {bill.billDetails?.[1]?.services?.serviceName === "WATER" ? "Tiền nước, " : "Tiền điện, "}
          {bill.billDetails?.[0]?.services?.serviceName === "WATER" ? "tiền nước " : "Tiền điện"}
        </td>
        <td>{bill.roomDTO?.roomName}</td>
        <td>{bill.billDetails?.[1]?.value}</td>
        <td>{bill.billDetails?.[0]?.value}</td>
        <td>{new Date(bill.billDetails?.[0]?.services?.createAt).toLocaleDateString()}</td>
        <td>{bill.billStatus}</td>
        <td>
          <button className="btn btn-danger" onClick={() => handleDelete(bill.billId)}>
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const handleDelete = (billId) => {
    deleteBillService(billId).then(() => {
      setBills((prevBills) => prevBills.filter((bill) => bill.billId !== billId));
    });
  };

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
                    <h4 className="card-title">Danh sách thanh toán </h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div>
                        <a href="/admin/add-bill" className="btn btn-success">
                          Thêm mới
                        </a>
                      </div>
                      <div className="m-2"></div>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="input-group ml-3">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Tìm kiếm phòng" 
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
                            <th>STT</th>
                            <th>Loại phí</th>
                            <th>Phòng</th>
                            <th>Tiền điện</th>
                            <th>Tiền nước</th>
                            <th>Ngày đến hạn</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>{renderRows()}</tbody>
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
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
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

export default Bills;
