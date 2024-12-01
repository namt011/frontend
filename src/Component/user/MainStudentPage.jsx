import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để chuyển hướng
import HeaderStudent from './HeaderStudent';
import SideBarStudent from './SideBarStudent';
import { listBuilding, listRoom } from '../service/RoomService';

const MainStudentPage = () => {
    const [location, setLocation] = useState('');  // Tòa nhà hiện tại
    const [roomTypes, setRoomTypes] = useState([]);  // Lưu trữ các loại phòng của tòa hiện tại
    const [buildings, setBuildings] = useState([]);  // Lưu trữ danh sách các tòa nhà
    const [allRooms, setAllRooms] = useState([]);  // Lưu trữ tất cả các phòng
    const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
    const navigate = useNavigate(); // Hook chuyển hướng

    // Resize handler để ẩn/hiện sidebar trên các màn hình nhỏ
    useEffect(() => {
        const handleResize = () => {
            setIsActive(window.innerWidth >= 1200);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {  
        setIsActive(prev => !prev);
    }; 

    // Lấy danh sách tòa nhà khi component được load
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await listBuilding();
                if (response && response.data.data) {
                    setBuildings(response.data.data);
                    if (response.data.data.length > 0) {
                        setLocation(response.data.data[0].buildingId);
                    }
                }
            } catch (error) {
                console.error("Error fetching buildings:", error);
            }
        };
        fetchBuildings();
    }, []); 

    // Lấy tất cả danh sách phòng khi component được load
    useEffect(() => {
        const fetchAllRooms = async () => {
            try {
                const response = await listRoom();
                if (response && response.data.data) {
                    setAllRooms(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching all rooms:", error);
            }
        };
        fetchAllRooms();
    }, []); 

    // Khi location (tòa nhà) thay đổi, lọc phòng theo tòa
    useEffect(() => {
        if (!location) return;

        const filteredRooms = allRooms.filter(room => room.floor.building.buildingId === location);

        const roomTypes = filteredRooms.reduce((acc, room) => {
            const roomType = room.roomType;
            if (!acc[roomType.roomTypeId]) {
                acc[roomType.roomTypeId] = {
                    roomTypeId: roomType.roomTypeId,
                    roomTypeName: roomType.roomTypeName,
                    roomTypeDes: roomType.roomTypeDes,
                    roomTypePrice: roomType.roomTypePrice,
                    roomTypeDeposit: roomType.roomTypeDeposit,
                    roomNumber: roomType.roomNumber
                };
            }
            return acc;
        }, {});

        setRoomTypes(Object.values(roomTypes));
    }, [location, allRooms]); 

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    // Hàm xử lý khi click "Đăng ký"
    const handleRegisterClick = (roomTypeId) => {
        // Dùng navigate để chuyển hướng và truyền roomTypeId qua state
        navigate('/dangkiphong-studentInfo', {
            state: { roomTypeId } // Truyền roomTypeId qua state
        });
    };

    return (
        <div id='app'>
            <div id='main'>
                <HeaderStudent onToggleSidebar={toggleSidebar} />
                <SideBarStudent isActive={isActive} onToggleSidebar={toggleSidebar} />
                <div id='main-content'>
                    <div className="row">
                        <main className="col-lg-9 col-md-8 col-sm-12 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5>Đăng ký phòng</h5>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="locationSelect" className="form-label">Vị trí tòa</label>
                                <select className="form-select" id="locationSelect" value={location} onChange={handleLocationChange}>
                                    {buildings.map((building) => (
                                        <option key={building.buildingId} value={building.buildingId}>
                                            {building.buildingName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div id="roomList" className="row g-3">
                                {roomTypes.length === 0 ? (
                                    <p>Không có loại phòng nào.</p>
                                ) : (
                                    roomTypes.map((roomType) => (
                                        <div className="col-md-4" key={roomType.roomTypeId}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">{roomType.roomTypeName}</h5>
                                                    <p><strong>Mô tả:</strong> {roomType.roomTypeDes}</p>
                                                    <p><strong>Giá phòng:</strong> {roomType.roomTypePrice} VND</p>
                                                    <p><strong>Tiền đặt cọc:</strong> {roomType.roomTypeDeposit} VND</p>
                                                    <p><strong>Số người tối đa:</strong> {roomType.roomNumber}</p>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleRegisterClick(roomType.roomTypeId)} // Gọi hàm khi click
                                                    >
                                                        Đăng ký
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <nav className="mt-3">
                                <ul className="pagination justify-content-center">
                                    <li className="page-item disabled">
                                        <a className="page-link" href="#" tabIndex="-1"><i className="bi bi-chevron-left"></i></a>
                                    </li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item">
                                        <a className="page-link" href="#"><i className="bi bi-chevron-right"></i></a>
                                    </li>
                                </ul>
                            </nav>
                        </main>
                    </div>
                </div>

                <footer className="bg-light text-center text-lg-start mt-4">
                    <div className="container p-4">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 mb-4">
                                <h5 className="text-uppercase">Section</h5>
                                <ul className="list-unstyled">
                                    <li><a href="#!" className="text-dark">Home</a></li>
                                    <li><a href="#!" className="text-dark">Features</a></li>
                                    <li><a href="#!" className="text-dark">Pricing</a></li>
                                    <li><a href="#!" className="text-dark">FAQs</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default MainStudentPage;
