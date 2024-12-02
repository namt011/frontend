import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để chuyển hướng
import HeaderStudent from './HeaderStudent';
import SideBarStudent from './SideBarStudent';
import { listRoomType } from '../service/RoomService'; // Giữ nguyên import listRoomType

const MainStudentPage = () => {
    const [roomTypes, setRoomTypes] = useState([]);  // Lưu trữ các loại phòng
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

    // Lấy danh sách các loại phòng khi component được load
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await listRoomType();  // Gọi API để lấy listRoomType
                if (response && response.data.data) {
                    setRoomTypes(response.data.data);  // Lưu trữ danh sách các loại phòng
                }
            } catch (error) {
                console.error("Error fetching room types:", error);
            }
        };
        fetchRoomTypes();
    }, []);

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
                        <main className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5>Đăng ký phòng</h5>
                                <p>Chọn loại phòng muốn đăng ký</p>
                            </div>

                            {/* Không cần dropdown chọn tòa nhà nữa */}
                            <div id="roomList" className="row">
                                {roomTypes.length === 0 ? (
                                    <p>Không có loại phòng nào.</p>
                                ) : (
                                    roomTypes.map((roomType) => (
                                        <div className="col-md-3 col-12" key={roomType.roomTypeId}>
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
