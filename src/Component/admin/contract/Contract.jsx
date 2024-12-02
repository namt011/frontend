import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../../SideBar';
import Header from '../../Header';
import Footer from '../../Footer';
import { format } from 'date-fns';
import { get1ContractService, updateContractService, createContractService } from '../../service/ContractService';

const Contract = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [contract, setContract] = useState(null);  // State to store contract data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contractStatus, setContractStatus] = useState('');
  const { contractId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

    
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  useEffect(() => {
    // Fetch contract details when the component loads
      // Get contractId from route params or elsewhere
      console.log(contractId)
      get1ContractService(contractId)
      .then((response) => {
          setContract(response.data.data);
          setStartDate(formatDate(response.data.data.startDate));
          setEndDate(formatDate(response.data.data.endDate));
          setContractStatus(response.data.data.contractStatus);
      })
      .catch((error) => {
        console.error("Error fetching contract details", error);
      });
  }, [contractId]);

  const toggleSidebar = () => {
    setIsActive(prev => !prev);
  };

  const handleSave = () => {
    if (contract) {
      const updatedContract = {
        ...contract,
        startDate,
        endDate,
        contractStatus,
      };

      // If any fields have changed, update the contract
      if (startDate !== contract.startDate || endDate !== contract.endDate || contractStatus !== contract.contractStatus) {
        updateContractService(contractId, updatedContract)
          .then(response => {
            if (response.data.code === '200') {
              alert('Contract updated successfully');
            } else {
              alert('Failed to update contract');
            }
          })
          .catch(error => {
            console.error("Error updating contract", error);
            alert('An error occurred while updating the contract');
          });
      }
    }
  };

  return (
    <div id='app'>
      <div id='main'>
        <Header onToggleSidebar={toggleSidebar} />
        <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id='main-content'>
          <section className="section">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Sửa hợp đồng</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="basicInput">Mã sinh viên</label>
                      <input type="text" className="form-control" id="basicInput" disabled
                        value={contract ? contract.student.studentId : ''} />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="helpInputTop">Tên sinh viên</label>
                      <input type="text" className="form-control" id="helpInputTop" disabled
                        value={contract ? contract.student.fullname : ''} />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="startDate">Ngày bắt đầu</label>
                      <input type="date" id="startDate" className="form-control" 
                        value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="endDate">Ngày kết thúc</label>
                      <input type="date" id="endDate" className="form-control"
                        value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <label htmlFor="contractStatus" className="fw-bold mt-2">Trạng thái</label>
                    <select className="form-select" id="contractStatus"
                      value={contractStatus} onChange={(e) => setContractStatus(e.target.value)}>
                      <option value='' disabled>Chọn trạng thái</option>
                      <option value='WAITING'>Chờ thanh toán</option>
                      <option value='ACTIVE'>Có hiệu lực</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-primary mt-3" onClick={handleSave}>Lưu</button>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contract;
