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
  const [roomId, setRoomId] = useState(null);
  const [polling, setPolling] = useState(false); // State to track if polling is active

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
        }
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    if (roomId) {
      fetchBills();
    }
  }, [roomId]);

  // Payment handling function
  const handlePayment = async (bill) => {
    const studentId = localStorage.getItem('ID');
    const amount = (bill.billDetails?.[1]?.value || 0) + (bill.billDetails?.[0]?.value || 0);
    const billId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const params = { amount, studentId, billId };

    try {
      // Trigger payment
      const response = await axiosInstance.get('/api/payment/vn-pay', { params });
      window.open(response.data.data.paymentUrl, '_blank');

      // Start polling for payment status
      setPolling(true); // Set polling to true to begin checking payment status
      let pollCount = 0;

      // Polling function to check the payment status every 5 seconds for 15 minutes
      const interval = setInterval(async () => {
        if (pollCount >= 180) {
          // Stop polling after 15 minutes (180 checks)
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
            clearInterval(interval); // Stop polling once the correct payment is found
            setPolling(false);

            // Handle successful payment, update the bill status
            alert('Thanh toán thành công!');
            const requestBody = { ...bill, studentPay: { ...bill.studentPay, studentId } };
            await updateBillService(bill.billId, requestBody);

            // Re-fetch bills to update the UI
            const billResponse = await listBill();
            if (billResponse?.data.data) {
              const filteredBills = billResponse.data.data.filter((bill) => bill.roomDTO?.roomId === roomId);
              setBills(filteredBills);
            }
          }

        } catch (error) {
          console.error('Error checking payment status:', error);
        }

        pollCount++;
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Có lỗi xảy ra khi thanh toán.');
    }
  };

  // Render the table rows based on bills
  const renderRows = () => {
    return bills.map((bill, index) => (
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
                    <h4 className="card-title">Danh sách thanh toán </h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div className="m-2"></div>
                      <form>
                        <div className="input-group ml-3">
                          <input type="text" className="form-control" placeholder="Search" />
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
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Pays;
