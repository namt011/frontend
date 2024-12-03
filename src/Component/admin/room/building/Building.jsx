import React,{useEffect, useState} from 'react'
import SideBar from '../../../SideBar';
import Header from '../../../Header';
import Footer from '../../../Footer';
import { useNavigate,useParams } from 'react-router-dom';
import { createBuildingService,updateBuildingService,get1BuildingService} from '../../../service/RoomService';

const Building = () => {
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
    const [buildingName, setBuildingName]=useState('');
    const [buildingDescription, setBuildingDes]=useState('');
    const [buildingGender, setBuildingGender]=useState('');
  
    const {buildingId}= useParams();
    const navigator = useNavigate();

  useEffect(() => {
    if(buildingId){
        get1BuildingService(buildingId).then((response)=>{
          setBuildingName(response.data.data.buildingName);
            setBuildingDes(response.data.data.buildingDescription);
            setBuildingGender(response.data.data.buildingGender)
        }).catch(error =>{
          console.error(error);
        })
      }
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    
  }, [buildingId]);
  // Hàm để thay đổi giá trị isActive  

  function saveOrUpdateBuilding(e){
    e.preventDefault();

    const building = {buildingName,buildingDescription,buildingGender: buildingGender}
    console.log(building);
    if(buildingId){
      console.log(building);
      updateBuildingService(buildingId,building).then((response)=>{
        console.log(response.data)
        navigator('/admin/buildings')
      }).catch(error =>{
        console.error(error);
      })
    }else{
      createBuildingService(building).then((response) =>{
        console.log(response.data)
        navigator('/admin/buildings')
      }).catch(error =>{
        console.error(error);
      })
    }
  }

  const toggleSidebar = () => {  
    setIsActive(prev => !prev); // Trả về giá trị ngược lại  
  }; 
  function pageTitle(){
    if(buildingId){
      return <h4 className="card-title">Cập nhật thông tin tòa </h4>
    }else{
      return <h4 className="card-title">Thêm tòa </h4>
    }
  }
  return (
    <div id='app'>
   <div id='main'>
      <Header onToggleSidebar={toggleSidebar} />
      <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
      <div id='main-content'>
         <section id="multiple-column-form">
            <div className="row match-height">
               <div className="col-12">
                  <div className="card">
                     <div className="card-header pb-0">
                        {
                        pageTitle()
                        }
                     </div>
                     <div className="card-content">
                        <div className="card-body">
                           <form className="form">
                              <div className="col-md-6">
                                 <label htmlFor="validationCustom02" className="form-label">Tên tòa nhà</label>
                                 <input type="text" className="form-control" id="validationCustom02" name='buildingname' value={buildingName} onChange={e => setBuildingName(e.target.value)} required/>
                                 <div className="valid-feedback">
                                    Looks good!
                                 </div>
                              </div>
                              <div className='col-md-6'>
                            <label htmlFor='roomGender'className='fw-bold mt-2'>Giới tính</label>
                            <select
                              className='form-select'
                              id='roomGender'
                              value={buildingGender}
                              onChange={e => setBuildingGender(Number(e.target.value))}
                            >
                              <option value='' disabled>Chọn giới tính</option>
                              <option value='1'>Nam</option>
                              <option value='0'>Nữ</option>
                            </select>
                          </div>
                              <div className="col-md-16">
                                 <label htmlFor="validationCustom02" className="form-label">Mô tả</label>
                                 <input type="text" className="form-control" id="validationCustom02" name='buildingdes' value={buildingDescription} onChange={e => setBuildingDes(e.target.value)} required/>
                                 <div className="valid-feedback">
                                    Looks good!
                                 </div>
                              </div>
                              <div className="col-12 d-flex justify-content-end">
                                 <button type="submit"
                                    className="btn btn-primary me-1 mb-1" onClick={saveOrUpdateBuilding}>Submit</button>
                                 <button type="reset"
                                    className="btn btn-light-secondary me-1 mb-1">Reset</button>
                              </div>
                           </form>
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

export default Building