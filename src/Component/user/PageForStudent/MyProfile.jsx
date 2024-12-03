import React, { useState, useEffect } from 'react';
import SideBarStudent from '../SideBarStudent.jsx';
import HeaderStudent from '../HeaderStudent.jsx';
import Footer from '../../Footer.jsx';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createStudentService , updateStudentService, get1StudentService,listStudent2 } from '../../service/StudentService.js';

const MyProfile = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);

  // Student information states
  const [studentId, setStudentId] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [fullname, setFullname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [studentIdentification, setStudentIdentification] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relativesPhone, setRelativesPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentGender, setStudentGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [studentStatus, setStudentStatus] = useState('');
  const [studentPriority, setStudentPriority] = useState('');
  const [roomName, setRoomName] = useState('');

  // Validation state
  const [errors, setErrors] = useState({});

  const ID = localStorage.getItem('ID');

  const location = useLocation();
  const { state } = location;
  const studentIdFromState = state?.studentId;
  const navigator = useNavigate();

  useEffect(() => {
    const effectiveStudentId = ID || studentIdFromState;
    if (effectiveStudentId) {
      get1StudentService(effectiveStudentId).then((response) => {
        const student = response.data.data;
        setStudentId(effectiveStudentId);
        setStudentClass(student.studentClass);
        setFullname(student.fullname);
        setDateOfBirth(student.dateOfBirth);
        setStudentIdentification(student.studentIdentification);
        setStudentAddress(student.studentAddress);
        setPhoneNumber(student.phoneNumber);
        setRelativesPhone(student.relativesPhone);
        setStudentEmail(student.studentEmail);
        setStudentGender(student.studentGender);
        setEthnicity(student.ethnicity);
        setStudentStatus(student.studentStatus);
        setStudentPriority(student.studentPriority);
        setRoomName(student.roomName || '');
      }).catch(error => {
        console.error(error);
      });
    }

    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ID, studentIdFromState]);

  const toggleSidebar = () => {  
    setIsActive(prev => !prev);
  };

  const validateForm = async () => {
    const newErrors = {};
    let isValid = true;
  
    try {
      const response = await listStudent2();
      const students = response.data?.data || [];
  
      // Validate student ID
      if (!studentId.trim()) {
        newErrors.studentId = 'Mã sinh viên là bắt buộc.';
        isValid = false;
      } else if (
        students.some(
          student => 
            student.studentDTO?.studentId === studentId && 
            student.studentDTO?.studentId !== (ID || studentIdFromState)
        )
      ) {
        newErrors.studentId = 'Mã sinh viên đã tồn tại trong hệ thống.';
        isValid = false;
      }
  
      // Validate student identification (citizen ID)
      if (!studentIdentification.trim()) {
        newErrors.studentIdentification = 'Số căn cước là bắt buộc.';
        isValid = false;
      } else if (
        students.some(
          student => 
            student.studentDTO?.studentIdentification === studentIdentification && 
            student.studentDTO?.studentId !== (ID || studentIdFromState)
        )
      ) {
        newErrors.studentIdentification = 'Số căn cước đã tồn tại trong hệ thống.';
        isValid = false;
      }
  
      // Validate phone number
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Số điện thoại là bắt buộc.';
        isValid = false;
      } else if (!/^\d{10,11}$/.test(phoneNumber)) {
        newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10 hoặc 11 chữ số).';
        isValid = false;
      } else if (
        students.some(
          student => 
            student.studentDTO?.phoneNumber === phoneNumber && 
            student.studentDTO?.studentId !== (ID || studentIdFromState)
        )
      ) {
        newErrors.phoneNumber = 'Số điện thoại đã tồn tại trong hệ thống.';
        isValid = false;
      }
  
      // Validate email
      if (!studentEmail.trim()) {
        newErrors.studentEmail = 'Email là bắt buộc.';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(studentEmail)) {
        newErrors.studentEmail = 'Email không hợp lệ.';
        isValid = false;
      } else if (
        students.some(
          student => 
            student.studentDTO?.studentEmail === studentEmail && 
            student.studentDTO?.studentId !== (ID || studentIdFromState)
        )
      ) {
        newErrors.studentEmail = 'Email đã tồn tại trong hệ thống.';
        isValid = false;
      }
  
      // Rest of the validation remains the same...
      if (!studentClass.trim()) {
        newErrors.studentClass = 'Lớp-Khóa là bắt buộc.';
        isValid = false;
      } else {
        const classPattern = /^[A-Za-z0-9]+-\d{2}$/;
        const classList = studentClass.split(/\s+/);
      
        for (let i = 0; i < classList.length; i++) {
          if (!classPattern.test(classList[i].trim())) {
            newErrors.studentClass = 'Lớp-Khóa không hợp lệ (định dạng: TênLớp-SốKhóa).';
            isValid = false;
            break;
          }
        }
      }
  

    if (!studentAddress.trim()) {
      newErrors.studentAddress = 'Địa chỉ là bắt buộc.';
      isValid = false;
    }


    // Validate fullname
    if (!fullname.trim()) {
      newErrors.fullname = 'Họ và tên là bắt buộc.';
      isValid = false;
    }

    // Validate date of birth
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc.';
      isValid = false;
    } else if (!/\d{4}-\d{2}-\d{2}/.test(dateOfBirth)) {
      newErrors.dateOfBirth = 'Ngày sinh không hợp lệ (định dạng: yyyy-mm-dd).';
      isValid = false;
    }


    if (!relativesPhone.trim()) {
      newErrors.relativesPhone = 'Số điện thoại người thân là bắt buộc.';
      isValid = false;
    } else if (!/^\d{10,11}$/.test(relativesPhone)) {
      newErrors.relativesPhone = 'Số điện thoại người thân không hợp lệ (10 hoặc 11 chữ số).';
      isValid = false;
    }

    // Validate gender
    if (studentGender === '') {
      newErrors.studentGender = 'Giới tính là bắt buộc.';
      isValid = false;
    }

    // Validate ethnicity
    if (!ethnicity) {
      newErrors.ethnicity = 'Dân tộc là bắt buộc.';
      isValid = false;
    }

    // Validate student status
    if (!studentStatus) {
      newErrors.studentStatus = 'Trạng thái là bắt buộc.';
      isValid = false;
    }

    // Validate student priority
    if (!studentPriority) {
      newErrors.studentPriority = 'Ưu tiên là bắt buộc.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  } catch (error) {
    console.error('Error fetching student list:', error);
    return false;
  }
  };
  async function saveOrUpdateStudent(e) {
    e.preventDefault();
    const isValid = await validateForm();
    
    if (isValid) {
      const student = {
        studentId: ID || studentId,
        studentClass,
        fullname,
        dateOfBirth,
        studentIdentification,
        studentAddress,
        phoneNumber,
        relativesPhone,
        studentEmail,
        studentGender: studentGender,
        ethnicity,
        studentStatus: parseInt(studentStatus),
        studentPriority,
        roomName
      };
  
      if (ID || studentIdFromState) {
        updateStudentService(ID || studentIdFromState, student).then((response) => {
          navigator('/admin/students');
        }).catch(error => {
          console.error(error);
        });
      } else {
        createStudentService(student).then((response) => {
          navigator('/admin/students');
        }).catch(error => {
          console.error(error);
        });
      }
    }
  }
  function pageTitle() {
    if (ID || studentIdFromState) {
      return <h4 className="card-title">Cập nhật thông tin sinh viên</h4>;
    } else {
      return <h4 className="card-title">Thêm mới sinh viên</h4>;
    }
  }

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
                  <div className="card-header">
                    {pageTitle()}
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
  value={ID ? ID : studentId}
  onChange={e => setStudentId(e.target.value)}
  required
  readOnly={!!ID || studentIdFromState} // Đảm bảo readOnly được áp dụng khi có ID
/>

                              {errors.studentId && <small className="text-danger">{errors.studentId}</small>}
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
                              {errors.fullname && <small className="text-danger">{errors.fullname}</small>}
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
                              {errors.studentClass && <small className="text-danger">{errors.studentClass}</small>}
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
                            {errors.dateOfBirth && <small className="text-danger">{errors.dateOfBirth}</small>}
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
                            {errors.studentIdentification && <small className="text-danger">{errors.studentIdentification}</small>}
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
                            {errors.studentAddress && <small className="text-danger">{errors.studentAddress}</small>}
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
                            {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
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
                            {errors.relativesPhone && <small className="text-danger">{errors.relativesPhone}</small>}
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
                            {errors.studentEmail && <small className="text-danger">{errors.studentEmail}</small>}
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
                            {errors.studentGender && <small className="text-danger">{errors.studentGender}</small>}
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
                            {errors.ethnicity && <small className="text-danger">{errors.ethnicity}</small>}
                            </div>
                          
                          <div className="col-md-6 col-12 mt-1">
                            <label className='fw-bold'>Trạng thái</label>
                            <select 
                              className="form-select" 
                              value={studentStatus}
                              onChange={e => setStudentStatus(e.target.value)}
                              required
                            >
                              <option value="" disabled>Vui lòng chọn trạng thái</option>
                              <option value="1">Không còn học</option>
                              <option value="2">Còn học</option>
                            </select>
                            {errors.studentStatus && <small className="text-danger">{errors.studentStatus}</small>}
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
                          
                        </div>
                      </form>
                      <div className="col-12 d-flex justify-content-end mt-3">
                      <a href="/forgotpassword">
  <button 
    type="submit"
    className="btn btn-primary me-2"
  >
    Đổi mật khẩu
  </button>
</a>
                          </div>
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

export default MyProfile;
