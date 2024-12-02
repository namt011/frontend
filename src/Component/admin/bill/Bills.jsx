import React, { useEffect, useState } from 'react';
import SideBar from '../../SideBar';
import Footer from '../../Footer';
import Header from '../../Header';
import { listBill, deleteBillService } from '../../service/BillService';

const Bills = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [bills, setBills] = useState([]); // State to store bills data

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsActive((prev) => !prev);
  };

  // Fetch data from the API and update the state
  useEffect(() => {
    // Replace with your actual API call
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

  // Render the table rows based on the bills data
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
         <button className="btn btn-danger" onClick={() => handleDelete(bill.billId)}>
           Delete
         </button>
       </td>
     </tr>
   ));
 };
  const handleDelete = (billId) => {
    // Call deleteBillService and update the state accordingly
    deleteBillService(billId).then(() => {
      setBills((prevBills) => prevBills.filter((bill) => bill.billId !== billId));
    });
  };

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

export default Bills;
