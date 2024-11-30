import React, { useState, useEffect, useRef } from 'react';
import SideBar from '../../SideBar.jsx'
import Header from '../../Header.jsx'
import Footer from '../../Footer.jsx';
import { useNavigate,useParams } from 'react-router-dom';
import { listContract } from '../../service/ContractService.js';

const Contracts = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [contracts, setContracts] = useState([])

  const navigator  = useNavigate();
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
   setLoading(true);
   setError(null);

   // Simulate API call with mock data
   const fetchData = async () => {
     try {
       // Simulate API delay
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
             staff: contract.staff
           }));
           setContracts(processedData);
         } else {
           throw new Error('Data structure is invalid');
         }
       })
       .catch(error => {
         console.error('Error fetching contracts:', error);
         setError(error.message);
         setContracts([]);
       })
       .finally(() => {
         setLoading(false);
       });

     } catch (error) {
       console.error('Error fetching contracts:', error);
       setError(error.message);
       setContracts([]);
       setLoading(false);
     }
   };

   fetchData();
 }, []);


  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

    
    
  }, []);


  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}



  const toggleSidebar = () => {  
    setIsActive(prev => !prev); // Trả về giá trị ngược lại
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
                           <h4 className="card-title">Danh sách hợp đồng </h4>
                        </div>
                        <div className="card-content">
                           <div className="card-body d-flex">
                              <div><a href="/admin/add-contract" className="btn btn-success">Thêm mới</a></div>
                              <div className='m-2'></div>
                              <form>
                                 <div className="input-group ml-3">
                                    <input type="text" className="form-control" placeholder="Search"/>
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
                                       <th>Mã sinh viên </th>
                                       <th>Tên sinh viên </th>
                                       <th>Ngày bắt đầu  </th>
                                       <th>Ngày kết thúc </th>
                                       <th>Nhân viên </th>
                                       <th>Hành động</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                 {loading ? (
  <tr><td colSpan="6">Loading...</td></tr>
) : error ? (
  <tr><td colSpan="6">Error: {error}</td></tr>
) : contracts && contracts.length > 0 ? (
  contracts.map(contract => (
    <tr key={contract.contractId}>
      <td>{contract.student?.studentId}</td>
      <td>{contract.student?.fullname}</td>
      <td>{formatDate(contract.startDate)}</td>
      <td>{formatDate(contract.endDate)}</td>
      <td>{contract.staff?.fullname}</td>
      <td>
        <div className="buttons">
          <a href="#" className="btn btn-primary rounded-pill mb-0 mr-0">Sửa</a>
          <a href="#" className="btn btn-danger rounded-pill mb-0 mr-0">Xóa</a>
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
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </div>
         <Footer/>
      </div>
   </div>
    )
  }
  
  export default Contracts;