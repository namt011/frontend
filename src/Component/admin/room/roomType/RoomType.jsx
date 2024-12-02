import React, { useEffect, useState } from 'react';
import SideBar from '../../../SideBar';
import Header from '../../../Header';
import Footer from '../../../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { createRoomTypeService, updateRoomTypeService, get1RoomTypeService } from '../../../service/RoomService';

const Roomtype = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [roomTypeName, setRoomTypeName] = useState('');
  const [roomTypeDes, setRoomTypeDes] = useState('');
  const [roomTypePrice, setRoomTypePrice] = useState(0);
  const [roomNumber, setRoomNumber] = useState(0);
  const [roomTypeDeposit, setRoomTypeDeposit] = useState(0);
  
  const { roomTypeId } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    if (roomTypeId) {
      get1RoomTypeService(roomTypeId).then((response) => {
        const data = response.data.data;
        setRoomTypeName(data.roomTypeName);
        setRoomTypeDes(data.roomTypeDes);
        setRoomTypePrice(data.roomTypePrice);
      }).catch(error => {
        console.error(error);
      });
    }

    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [roomTypeId]);

  function saveOrUpdateRoomType(e) {
    e.preventDefault();

    const roomType = { roomTypeName, roomTypeDes, roomTypePrice, roomNumber, roomTypeDeposit };
    console.log(roomType);

    if (roomTypeId) {
      updateRoomTypeService(roomTypeId, roomType).then((response) => {
        console.log(response.data);
        navigator('/admin/roomtypes');
      }).catch(error => {
        console.error(error);
      });
    } else {
      createRoomTypeService(roomType).then((response) => {
        console.log(response.data);
        navigator('/admin/roomtypes');
      }).catch(error => {
        console.error(error);
      });
    }
  }

  const toggleSidebar = () => {
    setIsActive(prev => !prev);
  };

  function pageTitle() {
    return roomTypeId ? <h4 className="card-title">Cập nhật loại phòng</h4> : <h4 className="card-title">Thêm loại phòng</h4>;
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
                    {pageTitle()}
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <form className="form">
                        <div className='row'>
                        <div className="col-md-4 col-12">
                          <label htmlFor="roomTypeName" className="form-label">Tên loại phòng</label>
                          <input type="text" className="form-control" id="roomTypeName" name='roomTypeName' value={roomTypeName} onChange={e => setRoomTypeName(e.target.value)} required />
                        </div>
                        <div className="col-md-4 col-12">
                          <label htmlFor="roomNumber" className="form-label">Số người ở tối đa</label>
                          <input type="number" className="form-control" id="roomNumber" name='roomNumber' value={roomNumber} onChange={e => setRoomNumber(e.target.value)} required />
                        </div>
                        <div className="col-md-2 col-12">
                          <label htmlFor="roomTypePrice" className="form-label">Tiền</label>
                          <input type="number" className="form-control" id="roomTypePrice" name='roomTypePrice' value={roomTypePrice} onChange={e => setRoomTypePrice(e.target.value)} required />
                        </div>
                        <div className="col-md-2 col-12">
                          <label htmlFor="roomTypeDeposit" className="form-label">Tiền cọc</label>
                          <input type="number" className="form-control" id="roomTypeDeposit" name='roomTypeDeposit' value={roomTypeDeposit} onChange={e => setRoomTypeDeposit(e.target.value)} required />
                        </div>
                        <div className="col-md-12 col-12">
                          <label htmlFor="roomTypeDes" className="form-label">Mô tả</label>
                          <input placeholder="Các dịch vụ mà loại phòng này cung cấp" type="text" className="form-control" id="roomTypeDes" name='roomTypeDes' value={roomTypeDes} onChange={e => setRoomTypeDes(e.target.value)} required />
                        </div>
                        
                        <div className="col-12 d-flex justify-content-end mt-3">
                          <button type="submit" className="btn btn-primary me-1 mb-1" onClick={saveOrUpdateRoomType}>Submit</button>
                          <button type="reset" className="btn btn-light-secondary me-1 mb-1">Reset</button>
                        </div>
                        </div>
                      </form>
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

export default Roomtype;
