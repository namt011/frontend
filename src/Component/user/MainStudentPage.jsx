import React from 'react'

const MainStudentPage = () => {
    const roomData = {
        tang4toaA1: [
            { id: 403, current: 3, max: 4, facility: "Quạt", description: "" },
            { id: 404, current: 0, max: 4, facility: "Quạt", description: "" },
            { id: 405, current: 2, max: 4, facility: "Quạt", description: "" }
        ],
        // Add more data for other locations here
    };
    function updateRooms() {
        const location = document.getElementById('locationSelect').value;
        const rooms = roomData[location] || [];
        const roomList = document.getElementById('roomList');
        roomList.innerHTML = rooms.map(room => `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Chi tiết</h5>
                        <p>Phòng: ${room.id}</p>
                        <p>Số người hiện tại: ${room.current}</p>
                        <p>Số người tối đa: ${room.max}</p>
                        <p>Vật chất cung cấp: ${room.facility}</p>
                        <p>Mô tả: ${room.description}</p>
                        <a class="btn btn-secondary btn-sm" href="#">Xem chi tiết</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Initialize rooms
    updateRooms();
  return (
    <div>
        <header class="bg-light border-bottom p-3">
        <div class="container-fluid d-flex justify-content-between align-items-center">
            <h3 class="m-0">KTX GTVT</h3>

            <div class="d-flex align-items-center">
                <a href="#" class="text-decoration-none me-4">
                    <i class="bi bi-bell fs-4"></i>
                </a>
                <div class="dropdown">
                    <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <div class="text-end">
                            <div id="studentName" class="fw-bold">Nguyễn Thị Phương Anh</div>
                            <div id="studentId" class="text-muted">211240962</div>
                        </div>
                        <img src="https://via.placeholder.com/40" alt="Avatar" class="rounded-circle ms-3"/>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#">Thông tin cá nhân</a></li>
                        <li><a class="dropdown-item" href="#">Cài đặt</a></li>
                        <li><hr class="dropdown-divider"/></li>
                        <li><a class="dropdown-item text-danger" href="#">Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    <div class="row">
        <aside class="col-lg-3 col-md-4 col-sm-12 bg-light p-3 border-end">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="nav-link text-primary fw-bold" href="#"><i class="bi bi-house me-2"></i>Đăng ký phòng</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#"><i class="bi bi-exclamation-circle me-2"></i>Yêu cầu khiếu nại</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#"><i class="bi bi-file-text me-2"></i>Hợp đồng</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#"><i class="bi bi-wallet2 me-2"></i>Thanh toán</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#"><i class="bi bi-telephone me-2"></i>Thông tin liên lạc</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#"><i class="bi bi-person me-2"></i>Tài khoản</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#"><i class="bi bi-box-arrow-left me-2"></i>Đăng xuất</a>
                </li>
            </ul>
        </aside>

        <main class="col-lg-9 col-md-8 col-sm-12 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5>Đăng ký phòng</h5>
            </div>

            <div class="mb-3">
                <label for="locationSelect" class="form-label">Vị trí</label>
                <select class="form-select" id="locationSelect" onchange="updateRooms()">
                    <option value="tang4toaA1">Tầng 4 - Tòa A1</option>
                    <option value="tang5toaA1">Tầng 5 - Tòa A1</option>
                    <option value="tang1toaB1">Tầng 1 - Tòa B1</option>
                </select>
            </div>
            <div id="roomList" class="row g-3">
            </div>

            <nav class="mt-3">
                <ul class="pagination justify-content-center">
                    <li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1"><i class="bi bi-chevron-left"></i></a>
                    </li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>
                    </li>
                </ul>
            </nav>
        </main>
    </div>

    <footer class="bg-light text-center text-lg-start mt-4">
        <div class="container p-4">
            <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                    <h5 class="text-uppercase">Section</h5>
                    <ul class="list-unstyled">
                        <li><a href="#!" class="text-dark">Home</a></li>
                        <li><a href="#!" class="text-dark">Features</a></li>
                        <li><a href="#!" class="text-dark">Pricing</a></li>
                        <li><a href="#!" class="text-dark">FAQs</a></li>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <h5 class="text-uppercase">Section</h5>
                    <ul class="list-unstyled">
                        <li><a href="#!" class="text-dark">Home</a></li>
                        <li><a href="#!" class="text-dark">Features</a></li>
                        <li><a href="#!" class="text-dark">Pricing</a></li>
                        <li><a href="#!" class="text-dark">FAQs</a></li>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <h5 class="text-uppercase">Section</h5>
                    <ul class="list-unstyled">
                        <li><a href="#!" class="text-dark">Home</a></li>
                        <li><a href="#!" class="text-dark">Features</a></li>
                        <li><a href="#!" class="text-dark">Pricing</a></li>
                        <li><a href="#!" class="text-dark">FAQs</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    </div>
  )
}

export default MainStudentPage