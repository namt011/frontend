import React from 'react'
import { useEffect,useState } from 'react';
import SideBar from '../../SideBar';
import Footer from '../../Footer';
import Header from '../../Header';

const Bills = () => {
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);

    useEffect(() => {
      const handleResize = () => {
        setIsActive(window.innerWidth >= 1200);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
      
    }, []);
    // Hàm để thay đổi giá trị isActive  
  
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
                           <h4 className="card-title">Danh sách thanh toán </h4>
                        </div>
                        <div className="card-content">
                           <div className="card-body d-flex">
                              <div><a href="/add-student" className="btn btn-success">Thêm mới</a></div>
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
                                        <th>STT</th>
                                       <th>Loại phí </th>
                                       <th>Phòng </th>
                                       <th>Tòa </th>
                                       <th>Phải nộp </th>
                                       <th>Đã nộp </th>
                                       <th>Ngày đến hạn</th>
                                       <th>Trạng thái </th>
                                       <th>Hành động</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    
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
export default Bills