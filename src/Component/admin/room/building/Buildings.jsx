import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import SideBar from '../../../SideBar.jsx';
import Header from '../../../Header.jsx';
import Footer from '../../../Footer.jsx';
import {
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  listBuilding
} from '../../../service/RoomService.js';
import {
  deleteBuildingService
} from '../../../service/RoomService.js';

const Buildings = () => {
      const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
      const [buildings, setBuildings] = useState([])
      const navigator = useNavigate();
      useEffect(() => {
          getAllBuilding();
          const handleResize = () => {
              setIsActive(window.innerWidth >= 1200);
          };
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
      }, []);
      
      function getAllBuilding() {
          listBuilding().then((response) => {
              setBuildings(response.data.data);
          }).catch(error => {
              console.error(error);
          })
      }

      function updateBuilding(buildingId) {
          navigator(`/admin/update-building/${buildingId}`, {
              state: {
                  buildingId
              }
          })
      }
      const deleteBuilding = (buildingId) => {
          const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tòa nhà này?");
          if (confirmDelete) {
              deleteBuildingService(buildingId).then((response) => {
                  getAllBuilding();
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
                        <h4 className="card-title">Danh sách tòa nhà </h4>
                     </div>
                     <div className="card-content">
                        <div className="card-body d-flex">
                           <div><a href="/admin/add-building" className="btn btn-success">Thêm mới</a></div>
          
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
                                    <th>Tên tòa nhà </th>
                                    <th>Mô tả </th>
                                    <th>Hành động</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                 buildings.map(building =>
                                 <tr key={building.buildingId}>
                                    <td>{building.buildingName}</td>
                                    <td>{building.buildingDescription}</td>
                                    <td>
                                       <div className="buttons">
                                          <a href="" className="btn btn-primary rounded-pill mb-0 mr-0" onClick={()=>updateBuilding(building.buildingId)}>Sửa </a>
                                          <a href="" className="btn btn-danger rounded-pill mb-0 mr-0" onClick={()=>deleteBuilding(building.buildingId)}>Xóa </a>
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
export default Buildings;