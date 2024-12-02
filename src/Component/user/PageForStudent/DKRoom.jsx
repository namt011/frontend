import React, { useState, useEffect } from 'react';
import HeaderStudent from '../HeaderStudent.jsx';
import SideBarStudent from '../SideBarStudent.jsx';
import Footer from '../../Footer.jsx';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { listRoomType } from '../../service/RoomService.js';
import axios from 'axios';
import axiosInstance from '../../service/axiosInstance .jsx';

const DKRoom = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [studentId, setStudentId] = useState('');
  const [fullname, setFullname] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [studentIdentification, setStudentIdentification] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relativesPhone, setRelativesPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentGender, setStudentGender] = useState(true);  // default to male (true)
  const [ethnicity, setEthnicity] = useState('');
  const [studentPriority, setStudentPriority] = useState('1');
  const [errors, setErrors] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [polling, setPolling] = useState(false);
  const { state } = useLocation();

  const navigator = useNavigate();
  
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await listRoomType();  
        setRoomTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  const roomTypeId = state?.roomTypeId;
  useEffect(() => {
    if (roomTypeId && roomTypes.length > 0) {
        const roomType = roomTypes.find(room => room.roomTypeId === roomTypeId);
        setSelectedRoomType(roomType);
    }
  }, [roomTypeId, roomTypes]);

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



  const handlePayment = async () => {
    if (polling) return;
    setPolling(true);
  
    const billId = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Tạo billId ngẫu nhiên với 20 ký tự
    const amount = selectedRoomType?.roomTypePrice + selectedRoomType?.roomTypeDeposit; // Tính tổng amount
    const studentPaymentInfo = `${studentId}_${billId}`; // Tạo paymentInfo để kiểm tra
    
    const studentData = {
      student: {
        studentId,
        fullname,
        dateOfBirth,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        studentClass,
        ethnicity,
        studentAddress,
        studentGender,
        studentIdentification,
        phoneNumber,
        relativesPhone,
        studentEmail,
        studentPriority,
        studentStatus: 1,  // Default student status is 1
      },
      staff: null,
      roomType: selectedRoomType,  // Assuming selectedRoomType is set correctly
      reduceCost: 0  // Default reduce cost
    };
  
    try {
      // Gọi API GET /api/payment/vn-pay trước khi tiếp tục đăng ký
      const paymentResponse = await axiosInstance.get('/api/payment/vn-pay', {
        params: {
          amount: amount,
          studentId: studentId,
          billId: billId
        }
      });
  
      const paymentUrl = paymentResponse.data.data.paymentUrl;
      
      // Mở tab mới với URL thanh toán
      window.open(paymentUrl, '_blank');
  
      // Bắt đầu kiểm tra thanh toán mỗi 5 giây trong 15 phút
      const intervalId = setInterval(async () => {
        try {
          const getAllPaymentsResponse = await axiosInstance.get('/api/payment/getAll');
          const payments = getAllPaymentsResponse.data.body.data;
          
          // Kiểm tra nếu paymentInfo khớp với studentPaymentInfo
          const paymentFound = payments.some(payment => payment.paymentInfo === studentPaymentInfo);
          
          if (paymentFound) {
            clearInterval(intervalId); // Dừng việc gọi API
            
            // Thanh toán thành công, tiếp tục đăng ký sinh viên
            const signupResponse = await axiosInstance.post('/auth/signup', studentData);
           
            alert("Đăng ký thành công!");
            navigator('/login')
          }
        } catch (error) {
          console.error('Error fetching payment data:', error);
        }
      }, 5000); // Gọi mỗi 5 giây
  
      // Sau 15 phút (900.000 ms), dừng kiểm tra nếu không có kết quả
      setTimeout(() => {
        clearInterval(intervalId);
        alert("Hết thời gian chờ thanh toán");
      }, 900000); // 15 phút
  
    } catch (error) {
      console.error('Error during payment or signup:', error);
    } finally {
      setPolling(false);
    }
  };
  return (
    <div id='app'>
      <div id='main'>
        <HeaderStudent onToggleSidebar={toggleSidebar} />
        <SideBarStudent isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id='main-content'>
          <section id="multiple-column-form">
            <div className="row match-height">
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title">Điền thông tin sinh viên để đăng ký phòng</h4>
                  <p>Lưu ý: sau khi điền đầy đủ thông tin sẽ cần phải thanh toán tiền phòng để có thể đăng ký</p>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <form className="form">
                        <div className="row">
                          {/* Render input fields with error messages */}
                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label>Mã sinh viên</label>
                              <input
  type="text"
  className="form-control"
  placeholder="Mã sinh viên"
  value={studentId}
  onChange={e => setStudentId(e.target.value)}
  required// Đảm bảo readOnly được áp dụng khi có ID
/>

                              
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label>Họ và tên</label>
                              <input 
                                type="text" 
                                className="form-control"
                                placeholder="Họ và tên" 
                                value={fullname}
                                onChange={e => setFullname(e.target.value)}
                                required
                              />
                             
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label>Lớp - Khóa</label>
                              <input 
                                type="text" 
                                className="form-control"
                                placeholder="Lớp-Khóa" 
                                value={studentClass}
                                onChange={e => setStudentClass(e.target.value)}
                                required
                              />
                             
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                          <div className="form-group">
                            <label>Ngày sinh</label>
                            <input 
                              type="text" 
                              className="form-control"
                              placeholder="yyyy-mm-dd"
                              value={dateOfBirth}
                              onChange={e => setDateOfBirth(e.target.value)}
                              required
                            />
                           
                          </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="form-group">
                            <label>Căn cước công dân</label>
                            <input 
                              type="number" 
                              className="form-control"
                              placeholder="Căn cước công dân" 
                              value={studentIdentification}
                              onChange={e => setStudentIdentification(e.target.value)}
                              required
                            />
                            
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="form-group">
                            <label>Địa chỉ</label>
                            <input 
                              type="text" 
                              className="form-control"
                              placeholder="Địa chỉ" 
                              value={studentAddress}
                              onChange={e => setStudentAddress(e.target.value)}
                              required
                            />
                            
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="form-group">
                            <label>Số điện thoại</label>
                            <input 
                              type="number" 
                              className="form-control"
                              placeholder="Số điện thoại" 
                              value={phoneNumber}
                              onChange={e => setPhoneNumber(e.target.value)}
                              required
                            />
                            
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="form-group">
                            <label>Số điện thoại người thân</label>
                            <input 
                              type="number" 
                              className="form-control"
                              placeholder="Số điện thoại người thân " 
                              value={relativesPhone}
                              onChange={e => setRelativesPhone(e.target.value)}
                              required
                            />
                           
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="form-group">
                            <label>Email</label>
                            <input 
                              type="email" 
                              className="form-control"
                              placeholder="Email" 
                              value={studentEmail}
                              onChange={e => setStudentEmail(e.target.value)}
                              required
                            />
                           
                            </div>
                        </div>
                        
                        <div className="col-md-6 col-12 mt-1">
                          <label className='fw-bold'>Giới tính</label>
                          <select 
  className="form-select" 
  value={studentGender ? '1' : '0'}
  onChange={e => setStudentGender(e.target.value === '1')}
  required
>
<option value="" disabled>Chọn giới tính</option>
  <option value="0">Nữ</option>
  <option value="1">Nam</option>
</select>
                            
                            </div>
                        
                        <div className="col-md-6 col-12 mt-1">
                          <label className='fw-bold'>Dân tộc</label>
                          <select 
                            className="form-select" 
                            value={ethnicity}
                            onChange={e => setEthnicity(e.target.value)}
                            required
                          >
                            <option value="" disabled>Chọn dân tộc</option>
                            <option value="Kinh">Kinh</option>
                            <option value="Tày">Tày</option>
                            <option value="Nùng">Nùng</option>
                            <option value="Hmông">Hmông</option>
                            <option value="Dao">Dao</option>
                            <option value="Thái">Thái</option>
                            <option value="Khmer">Khmer</option>
                            <option value="Chăm">Chăm</option>
                              <option value="Mường">Mường</option>
        <option value="Ê-đê">Ê-đê</option>
        <option value="Ba-na">Ba-na</option>
        <option value="Xơ-đăng">Xơ-đăng</option>
        <option value="Giáy">Giáy</option>
        <option value="Cơ-ho">Cơ-ho</option>
        <option value="Gié-Triêng">Gié-Triêng</option>
        <option value="Brâu">Brâu</option>
        <option value="Ơ-ở">Ơ-ở</option>
        <option value="Hà Nhì">Hà Nhì</option>
        <option value="Chu-ru">Chu-ru</option>
        <option value="Lào">Lào</option>
        <option value="La-chi">La-chi</option>
        <option value="Kháng">Kháng</option>
        <option value="Phù Lá">Phù Lá</option>
        <option value="La Hủ">La Hủ</option>
        <option value="Lự">Lự</option>
        <option value="Chơ-ro">Chơ-ro</option>
        <option value="Xtiêng">Xtiêng</option>
        <option value="Bru-Văn Kiều">Bru-Văn Kiều</option>
        <option value="Thổ">Thổ</option>
        <option value="Vân Kiều">Vân Kiều</option>
        <option value="Mảng">Mảng</option>
        <option value="Pà Thẻn">Pà Thẻn</option>
        <option value="Cơ-tu">Cơ-tu</option>
        <option value="Giẻ-Kơ-mú">Giẻ-Kơ-mú</option>
        <option value="Bố Y">Bố Y</option>
        <option value="Cống">Cống</option>
        <option value="Si La">Si La</option>
        <option value="Pu Péo">Pu Péo</option>
        <option value="Rơ-ôăng">Rơ-ôăng</option>
        <option value="Ng'ânh">Ng'ânh</option>
        <option value="Chứt">Chứt</option>
        <option value="Lô Lô">Lô Lô</option>
        <option value="Mạ">Mạ</option>
        <option value="Ngái">Ngái</option>
        <option value="Co">Co</option>
        <option value="Tri">Tri</option>
        <option value="Xinh-Mun">Xinh-Mun</option>
        <option value="Hơ-Mông">Hơ-Mông</option>
        <option value="Cán">Cán</option>
        <option value="Văn Kiều">Văn Kiều</option>
        <option value="Sán Chay">Sán Chay</option>
        <option value="Sán Dìu">Sán Dìu</option>
        <option value="Pupeo">Pupeo</option>
        </select>
                           
                            </div>
                          
                          <div className="col-md-6 col-12 mt-1">
                            <label className='fw-bold'>Ưu tiên</label>
                            <select 
                              className="form-select" 
                              value={studentPriority}
                              onChange={e => setStudentPriority(e.target.value)}
                              required
                            >
                              <option value="" disabled>Vui lòng chọn ưu tiên</option>
                              <option value="1">Không ưu tiên</option>
                              <option value="2">Sinh viên là anh hùng lực lượng vũ trang nhân dân, anh hùng lao động, người hưởng chính sách như thương binh, sinh viên khuyết tật...</option>
                              <option value="3">Sinh viên là con liệt sĩ, con thương binh, bệnh binh, con của người có công</option>
                              <option value="4">Sinh viên có hộ khẩu thường trú tại vùng cao, vùng có điều kiện kinh tế xã hội đặc biệt khó khăn, con hộ nghèo, hộ cận nghèo theo quy định hiện hành...</option>
                            </select>
                            {errors.studentPriority && <small className="text-danger">{errors.studentPriority}</small>}
                            </div>
                          <div className="col-12 d-flex justify-content-end mt-5 ">
                          <button className='btn btn-success' onClick={handlePayment} disabled={polling}>
            Đăng ký và Thanh toán
          </button>
          <div className='m-2'></div>
                            <button 
                              type="reset" 
                              className="btn btn-danger" 
                              onClick={() => {
                                setStudentId('');
                                setFullname('');
                                setDateOfBirth('');
                                setStudentIdentification('');
                                setStudentAddress('');
                                setPhoneNumber('');
                                setRelativesPhone('');
                                setStudentEmail('');
                                setStudentGender('');
                                setEthnicity('');
                                setStudentStatus('');
                                setStudentPriority('');
                                setErrors({});
                              }}
                            >
                              Reset
                            </button>
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

export default DKRoom;
