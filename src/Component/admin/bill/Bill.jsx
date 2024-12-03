import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar.jsx';
import Header from '../../Header.jsx';
import Footer from '../../Footer.jsx';
import { listRoom, listBuilding, listFloor } from '../../service/RoomService.js';
import { listStudent2 } from '../../service/StudentService.js';
import { createBill2Service } from '../../service/BillService.js';

const Bill = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedRoomData, setSelectedRoomData] = useState(null);

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  // New state for electric and water meter readings
  const [startWater, setStartWater] = useState('');
  const [endWater, setEndWater] = useState('');
  const [startElectric, setStartElectric] = useState('');
  const [endElectric, setEndElectric] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedRoom) {
        try {
          const response = await listStudent2({ roomId: selectedRoom });
          if (response.data.code === '200') {
            setStudents(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching students in room', error);
        }
      }
    };

    fetchStudents();
  }, [selectedRoom]);

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await listBuilding();
        if (response.data.code === '200') {
          setBuildings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching buildings data', error);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    const fetchFloors = async () => {
      if (selectedBuilding) {
        try {
          const response = await listFloor();
          if (response.data.code === '200') {
            const filteredFloors = response.data.data.filter(floor => floor.building.buildingId === selectedBuilding);
            setFloors(filteredFloors);
          }
        } catch (error) {
          console.error('Error fetching floors data', error);
        }
      }
    };
    fetchFloors();
  }, [selectedBuilding]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedFloor) {
        try {
          const response = await listRoom();
          if (response.data.code === '200') {
            const filteredRooms = response.data.data.filter(room => room.floor.floorId === selectedFloor);
            setRooms(filteredRooms);
          }
        } catch (error) {
          console.error('Error fetching rooms data', error);
        }
      }
    };
    fetchRooms();
  }, [selectedFloor]);

  const handleBuildingChange = (event) => {
    const buildingId = event.target.value;
    setSelectedBuilding(buildingId);
    setSelectedFloor('');
    setSelectedRoom('');
    setFloors([]);
    setRooms([]);
  };

  const handleFloorChange = (event) => {
    const floorId = event.target.value;
    setSelectedFloor(floorId);
    setSelectedRoom('');
    setRooms([]);
  };

  const handleRoomChange = (event) => {
    const roomId = event.target.value;
    setSelectedRoom(roomId);

    // Find the selected room's data and set it in the state
    const room = rooms.find((room) => room.roomId === roomId);
    setSelectedRoomData(room); // Store the room data

    // Update the endWater and endElectric values based on the selected room
    setStartWater(room?.lastWater || '');
    setStartElectric(room?.lastElectronic || '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!selectedRoom || !endWater || !endElectric) {
      setError('All fields are required.');
      return;
    }

    const waterIndex = parseInt(endWater);
    const electricIndex = parseInt(endElectric);

    if (isNaN(waterIndex) || isNaN(electricIndex)) {
      setError('Invalid meter readings.');
      return;
    }

    // Prepare request body
    const requestBody = {
      roomDTO: { roomId: selectedRoom },
      waterIndex: waterIndex,
      eindex: electricIndex
    };

    try {
      const response = await createBill2Service(requestBody);
      if (response.data.code === '200') {

        alert("Thành công")
      } else {
        setError('Lỗi');
      }
    } catch (error) {
      setError('Lỗi');
    }
  };

  return (
    <div id="app">
      <div id="main">
        <Header onToggleSidebar={() => setIsActive(prev => !prev)} />
        <SideBar isActive={isActive} onToggleSidebar={() => setIsActive(prev => !prev)} />
        <div id="main-content">
          <section id="multiple-column-form">
            <div className="row match-height">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Thêm mới thanh toán</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <form className="form" onSubmit={handleSubmit}>
                        <div className="row">

                          <div className="col-md-2 col-12 mt-1">
                            <label className="fw-bold">Chọn tòa</label>
                            <select
                              className="form-select"
                              value={selectedBuilding}
                              onChange={handleBuildingChange}
                              required
                            >
                              <option value="" disabled>Chọn tòa</option>
                              {buildings.map(building => (
                                <option key={building.buildingId} value={building.buildingId}>
                                  {building.buildingName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-2 col-12 mt-1">
                            <label className="fw-bold">Chọn tầng</label>
                            <select
                              className="form-select"
                              value={selectedFloor}
                              onChange={handleFloorChange}
                              required
                              disabled={!selectedBuilding}
                            >
                              <option value="" disabled>Chọn tầng</option>
                              {floors.map(floor => (
                                <option key={floor.floorId} value={floor.floorId}>
                                  {floor.floorName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-2 col-12 mt-1">
                            <label className="fw-bold">Chọn phòng</label>
                            <select
                              className="form-select"
                              value={selectedRoom}
                              onChange={handleRoomChange}
                              required
                              disabled={!selectedFloor}
                            >
                              <option value="" disabled>Chọn phòng</option>
                              {rooms.map(room => (
                                <option key={room.roomId} value={room.roomId}>
                                  {room.roomName}
                                </option>
                              ))}
                            </select>
                          </div>

                    

                          <div className="col-md-3 col-12">
                            <div className="form-group">
                              <label>Số điện ## số trước: {startElectric} </label>
                              <input
                                type="text"
                                className="form-control"
                                value={endElectric}
                                onChange={(e) => setEndElectric(e.target.value)}
                                placeholder="Số điện cuối"
                                required
                              />
                            </div>
                          </div>


                          <div className="col-md-3 col-12">
                            <div className="form-group">
                              <label>Số nước ## số trước: {startWater}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={endWater}
                                onChange={(e) => setEndWater(e.target.value)}
                                placeholder="Số nước cuối"
                                required
                              />
                            </div>
                          </div>

                          <div className="col-12 d-flex justify-content-end mt-3">
                            <button type="submit" className="btn btn-primary me-2">
                              Lưu
                            </button>
                          </div>
                        </div>
                      </form>
                      {error && <div className="alert alert-danger">{error}</div>}
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

export default Bill;
