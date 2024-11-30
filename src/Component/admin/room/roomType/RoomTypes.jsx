import React, { useState, useEffect, useRef } from 'react';
import SideBar from '../../../SideBar';
import Header from '../../../Header';
import Footer from '../../../Footer';
import { listRoomType, deleteRoomTypeService } from '../../../service/RoomService';
import { useNavigate } from 'react-router-dom';

const RoomTypes = () => {
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
    const [roomtypes,setRoomtypes] = useState([]);
    const navigator  = useNavigate();

    useEffect(() => {
      getAllRoomtype();
      const handleResize = () => {
        setIsActive(window.innerWidth >= 1200);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
      
    }, []);
    
    function getAllRoomtype(){
      listRoomType().then((response)=>{
         setRoomtypes(response.data.data)
      }).catch(error =>{
         console.error(error);
      })
    }

    function updateRoomtype(roomTypeId) {
      navigator(`/admin/update-roomtype/${roomTypeId}`, {
          state: {
            roomTypeId
          }
      })
  }
  const deleteRoomtype = (roomTypeId) => {
   const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa loại này?");
   if (confirmDelete) {
      deleteRoomTypeService(roomTypeId).then((response) => {
         getAllRoomtype();
       }).catch(error => {
           console.error(error);
       });
   }
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
                        <h4 className="card-title">Danh sách loại phòng  </h4>
                     </div>
                     <div className="card-content">
                        <div className="card-body d-flex">
                           <div><a href="/admin/add-roomtype" className="btn btn-success">Thêm mới</a></div>
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
                                    <th>Tên loại phòng  </th>
                                    <th>Mô tả </th>
                                    <th>Tiền </th>
                                    <th>Hành động</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    roomtypes.map((roomtype,index)=>
                                       <tr key={roomtype.roomTypeId}>
                                          <td>{index +1}</td>
                                          <td>{roomtype.roomTypeName}</td>
                                          <td>{roomtype.roomTypeDes}</td>
                                          <td>{roomtype.roomTypePrice}</td>
                                          <td>
                                       <div className="buttons">
                                          <a href="" className="btn btn-primary rounded-pill mb-0 mr-0" onClick={()=>updateRoomtype(roomtype.roomTypeId)}>Sửa </a>
                                          <a href="" className="btn btn-danger rounded-pill mb-0 mr-0" onClick={()=>deleteRoomtype(roomtype.roomTypeId)}>Xóa </a>
                                       </div>
                                    </td>
                                       </tr>
                                    )
                                 }
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

export default RoomTypes