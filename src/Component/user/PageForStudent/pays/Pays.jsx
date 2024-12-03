import React, { useEffect, useState } from 'react';
import HeaderStudent from '../../HeaderStudent';
import Footer from '../../../Footer';
import SideBarStudent from '../../SideBarStudent';
import { listBill, updateBillService } from '../../../service/BillService';
import { listStudent2 } from '../../../service/StudentService';
import axiosInstance from '../../../service/axiosInstance ';

const Pays = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]); // Store filtered bills
  const [roomId, setRoomId] = useState(null);
  const [polling, setPolling] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage] = useState(5); // Set number of bills per page

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsActive((prev) => !prev);
  };

  // Fetch student data and roomId
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = localStorage.getItem('ID');
        if (studentId) {
          const response = await listStudent2();
          const student = response?.data.data.find((student) => student.studentDTO.studentId === studentId);
          if (student) {
            setRoomId(student.roomDTO.roomId); // Set roomId for the logged-in student
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  // Fetch bills data
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await listBill();
        if (response?.data.data) {
          const filteredBills = response.data.data.filter((bill) => bill.roomDTO?.roomId === roomId);
          setBills(filteredBills);
          setFilteredBills(filteredBills); // Initialize the filtered bills state
        }
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    if (roomId) {
      fetchBills();
    }
  }, [roomId]);

  // Filter bills based on search query (electricity value)
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  
  useEffect(() => {
    const filtered = bills.filter((bill) =>
      bill.studentPay?.fullname.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by student's name
    );
    setFilteredBills(filtered);
    setCurrentPage(1); // Reset to the first page when the search changes
  }, [searchQuery, bills]);

  // Handle payment
  const handlePayment = async (bill) => {
    const studentId = localStorage.getItem('ID');
    const amount = (bill.billDetails?.[1]?.value || 0) + (bill.billDetails?.[0]?.value || 0);
    const billId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const params = { amount, studentId, billId };

    try {
      const response = await axiosInstance.get('/api/payment/vn-pay', { params });
      window.open(response.data.data.paymentUrl, '_blank');

      setPolling(true);
      let pollCount = 0;

      const interval = setInterval(async () => {
        if (pollCount >= 180) {
          clearInterval(interval);
          setPolling(false);
          alert('Timeout: Payment not confirmed.');
          return;
        }

        try {
          const paymentsResponse = await axiosInstance.get('/api/payment/getAll');
          const payment = paymentsResponse?.data?.body.data.find(
            (p) => p.paymentInfo === `${studentId}_${billId}`
          );

          if (payment) {
            clearInterval(interval);
            setPolling(false);
            alert('Thanh toán thành công!');
            const requestBody = { ...bill, studentPay: { ...bill.studentPay, studentId } };
            await updateBillService(bill.billId, requestBody);

            const billResponse = await listBill();
            if (billResponse?.data.data) {
              const filteredBills = billResponse.data.data.filter((bill) => bill.roomDTO?.roomId === roomId);
              setBills(filteredBills);
              setFilteredBills(filteredBills); // Update filtered bills
            }
          }

        } catch (error) {
          console.error('Error checking payment status:', error);
        }

        pollCount++;
      }, 5000);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Có lỗi xảy ra khi thanh toán.');
    }
  };

  // Pagination helpers
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);

  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

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

  const renderRows = () => {
    return currentBills.map((bill, index) => (
      <tr key={bill.billId}>
        <td>{index + 1 + (currentPage - 1) * billsPerPage}</td>
        <td>
          {bill.billDetails?.[1]?.services?.serviceName === "WATER" ? "Tiền nước, " : "Tiền điện, "}
          {bill.billDetails?.[0]?.services?.serviceName === "WATER" ? "tiền nước " : "Tiền điện"}
        </td>
        <td>{bill.roomDTO?.roomName}</td>
        <td>{bill.billDetails?.[1]?.value}</td>
        <td>{bill.billDetails?.[0]?.value}</td>
        <td>{new Date(bill.billDetails?.[0]?.services?.createAt).toLocaleDateString()}</td>
        <td>
          {bill.billStatus === "COMPLETE" ? (
            <span style={{ color: 'green' }}>Đã thanh toán</span>
          ) : (
            <span style={{ color: 'red' }}>Chưa thanh toán</span>
          )}
        </td>
        <td>{bill.studentPay?.fullname}</td> {/* Added column for student's name */}
        <td>
          <button
            className={`btn ${bill.billStatus === "COMPLETE" ? 'btn-secondary' : 'btn-success'}`}
            onClick={() => handlePayment(bill)}
            disabled={bill.billStatus === "COMPLETE" || polling}
          >
            Thanh toán
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div id="app">
      <div id="main">
        <HeaderStudent onToggleSidebar={toggleSidebar} />
        <SideBarStudent isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id="main-content">
          <section className="section">
            <div className="row" id="table-hover-row">
              <div className="col-12">
                <div className="card p-2">
                  <div className="card-header pb-0">
                    <h4 className="card-title">Danh sách thanh toán</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div className="m-2"></div>
                      <form>
                        <div className="input-group ml-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm theo người thanh toán"
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
                            <th>Loại phí</th>
                            <th>Phòng</th>
                            <th>Tiền điện</th>
                            <th>Tiền nước</th>
                            <th>Ngày đến hạn</th>
                            <th>Trạng thái</th>
                            <th>Sinh viên thanh toán</th>
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

            {/* Pagination */}
            <div className="pagination justify-content-end">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Pays;
