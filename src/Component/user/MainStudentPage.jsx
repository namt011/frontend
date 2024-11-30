import React, { useState, useEffect } from 'react';

const MainStudentPage = () => {
    const [location, setLocation] = useState('tang4toaA1');
    const [rooms, setRooms] = useState([]);

    // Sample room data
    const roomData = {
        tang4toaA1: [
            { id: 403, current: 3, max: 4, facility: "Quạt", description: "" },
            { id: 404, current: 0, max: 4, facility: "Quạt", description: "" },
            { id: 405, current: 2, max: 4, facility: "Quạt", description: "" }
        ],
        tang5toaA1: [
            { id: 501, current: 2, max: 4, facility: "Máy lạnh", description: "" },
            { id: 502, current: 1, max: 4, facility: "Máy lạnh", description: "" }
        ],
        tang1toaB1: [
            { id: 101, current: 4, max: 4, facility: "Quạt", description: "" },
            { id: 102, current: 0, max: 4, facility: "Quạt", description: "" }
        ]
    };

    // Update rooms based on selected location
    useEffect(() => {
        setRooms(roomData[location] || []);
    }, [location]);

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    return (
        <div>
            <header className="bg-light border-bottom p-3">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <h3 className="m-0">KTX GTVT</h3>

                    <div className="d-flex align-items-center">
                        <a href="#" className="text-decoration-none me-4">
                            <i className="bi bi-bell fs-4"></i>
                        </a>
                        <div className="dropdown">
                            <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="text-end">
                                    <div id="studentName" className="fw-bold">Nguyễn Thị Phương Anh</div>
                                    <div id="studentId" className="text-muted">211240962</div>
                                </div>
                                <img src="https://via.placeholder.com/40" alt="Avatar" className="rounded-circle ms-3"/>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" href="#">Thông tin cá nhân</a></li>
                                <li><a className="dropdown-item" href="#">Cài đặt</a></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><a className="dropdown-item text-danger" href="#">Đăng xuất</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <div className="row">
                <aside className="col-lg-3 col-md-4 col-sm-12 bg-light p-3 border-end">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link text-primary fw-bold" href="#"><i className="bi bi-house me-2"></i>Đăng ký phòng</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="#"><i className="bi bi-exclamation-circle me-2"></i>Yêu cầu khiếu nại</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="#"><i className="bi bi-file-text me-2"></i>Hợp đồng</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="#"><i className="bi bi-wallet2 me-2"></i>Thanh toán</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="#"><i className="bi bi-telephone me-2"></i>Thông tin liên lạc</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="#"><i className="bi bi-person me-2"></i>Tài khoản</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="#"><i className="bi bi-box-arrow-left me-2"></i>Đăng xuất</a>
                        </li>
                    </ul>
                </aside>

                <main className="col-lg-9 col-md-8 col-sm-12 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5>Đăng ký phòng</h5>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="locationSelect" className="form-label">Vị trí</label>
                        <select className="form-select" id="locationSelect" value={location} onChange={handleLocationChange}>
                            <option value="tang4toaA1">Tầng 4 - Tòa A1</option>
                            <option value="tang5toaA1">Tầng 5 - Tòa A1</option>
                            <option value="tang1toaB1">Tầng 1 - Tòa B1</option>
                        </select>
                    </div>

                    <div id="roomList" className="row g-3">
                        {rooms.map((room) => (
                            <div className="col-md-4" key={room.id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Chi tiết</h5>
                                        <p>Phòng: {room.id}</p>
                                        <p>Số người hiện tại: {room.current}</p>
                                        <p>Số người tối đa: {room.max}</p>
                                        <p>Vật chất cung cấp: {room.facility}</p>
                                        <p>Mô tả: {room.description}</p>
                                        <a className="btn btn-secondary btn-sm" href="#">Xem chi tiết</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <nav className="mt-3">
                        <ul className="pagination justify-content-center">
                            <li className="page-item disabled">
                                <a className="page-link" href="#" tabindex="-1"><i className="bi bi-chevron-left"></i></a>
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
                        <div className="col-lg-4 col-md-6 mb-4">
                            <h5 className="text-uppercase">Section</h5>
                            <ul className="list-unstyled">
                                <li><a href="#!" className="text-dark">Home</a></li>
                                <li><a href="#!" className="text-dark">Features</a></li>
                                <li><a href="#!" className="text-dark">Pricing</a></li>
                                <li><a href="#!" className="text-dark">FAQs</a></li>
                            </ul>
                        </div>
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
    );
};

export default MainStudentPage;
