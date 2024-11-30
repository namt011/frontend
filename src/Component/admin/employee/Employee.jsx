import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../SideBar.jsx';
import Header from '../../Header.jsx';
import Footer from '../../Footer.jsx';
import { createEmployeeService, updateEmployeeService, get1EmployeeService } from '../../service/EmployeeService.js';

const Employee = () => {
  const navigate = useNavigate();
  const { staffId } = useParams();

  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [employeeData, setEmployeeData] = useState({
    staffId: '',
    fullname: '',
    dateOfBirth: '',
    startDate: '',
    endDate: '',
    staffHome: '',
    staffGender: '',
    staffIdentification: '',
    phoneNumber: '',
    relativesPhone: '',
    staffEmail: '',
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (staffId) {
      setIsEditing(true);
      fetchEmployeeData(staffId);
    } else {
      setIsEditing(false);
    }
  }, [staffId]);

  const fetchEmployeeData = (staffId) => {
    get1EmployeeService(staffId)
      .then(response => {
        console.log(response.data.data.staffGender);
        setEmployeeData(response.data.data);
      })
      .catch(err => {
        setErrors({ ...errors, fetchError: 'Không tìm thấy thông tin nhân viên.' });
      });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!employeeData.fullname.trim()) {
      newErrors.fullname = 'Họ và tên là bắt buộc.';
      isValid = false;
    }

    if (!employeeData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc.';
      isValid = false;
    }

    if (!employeeData.dateOfBirth.trim()) {
        newErrors.dateOfBirth = 'Ngày sinh là bắt buộc.';
        isValid = false;
      } else if (!/\d{4}-\d{2}-\d{2}/.test(employeeData.dateOfBirth)) {
        newErrors.dateOfBirth = 'Ngày không hợp lệ (định dạng: yyyy-mm-dd).';
        isValid = false;
      }
      if (!employeeData.startDate.trim()) {
        newErrors.startDate = 'Ngày bắt đầu là bắt buộc.';
        isValid = false;
      } else if (!/\d{4}-\d{2}-\d{2}/.test(employeeData.startDate)) {
        newErrors.startDate = 'Ngày không hợp lệ (định dạng: yyyy-mm-dd).';
        isValid = false;
      }
      if (!employeeData.endDate.trim()) {
        newErrors.endDate = 'Ngày kết thúc là bắt buộc.';
        isValid = false;
      } else if (!/\d{4}-\d{2}-\d{2}/.test(employeeData.endDate)) {
        newErrors.endDate = 'Ngày không hợp lệ (định dạng: yyyy-mm-dd).';
        isValid = false;
      }


    if (!employeeData.staffIdentification.trim()) {
      newErrors.staffIdentification = 'Số căn cước là bắt buộc.';
      isValid = false;
    }

    if (!employeeData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc.';
      isValid = false;
    }

    if (!employeeData.staffEmail.trim()) {
      newErrors.staffEmail = 'Email là bắt buộc.';
      isValid = false;
    }else if (!/\S+@\S+\.\S+/.test(employeeData.staffEmail)) {
        newErrors.staffEmail = 'Email không hợp lệ.';
        isValid = false;
      }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing) {
        updateEmployeeService(staffId, employeeData)
          .then(response => {
            navigate('/admin/employees');
          })
          .catch(err => {
            setErrors({ submitError: 'Có lỗi xảy ra khi cập nhật nhân viên.' });
          });
      } else {
        createEmployeeService(employeeData)
          .then(response => {
            navigate('/admin/employees');
          })
          .catch(err => {
            console.error(err);
            setErrors({ submitError: 'Có lỗi xảy ra khi tạo mới nhân viên.' });
          });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ 
      ...employeeData, 
      [name]: name === 'staffGender' ? parseInt(value) : value 
    });
  };

  const toggleSidebar = () => {
    setIsActive(prev => !prev);
  };

  const resetForm = () => {
    setEmployeeData({
      staffId: '',
      fullname: '',
      dateOfBirth: '',
      startDate: '',
      endDate: '',
      staffHome: '',
      staffGender:'',
      staffIdentification: '',
      phoneNumber: '',
      relativesPhone: '',
      staffEmail: '',
    });
    setErrors({});
  };

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
                  <div className="card-header">
                    <h4 className="card-title">{isEditing ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      {errors.submitError && <div className="alert alert-danger">{errors.submitError}</div>}
                      <form className="form" onSubmit={handleSubmit}>
                        <div className="row">
                          {/* Input fields and error messages */}
                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="fullname">Họ và tên</label>
                              <input
                                type="text"
                                className="form-control"
                                name="fullname"
                                placeholder="Họ và tên"
                                value={employeeData.fullname}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.fullname && <small className="text-danger">{errors.fullname}</small>}
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="dateOfBirth">Ngày sinh</label>
                              <input
                                type="text"
                                className="form-control"
                                name="dateOfBirth"
                                placeholder="yyyy-mm-dd"
                                value={employeeData.dateOfBirth}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.dateOfBirth && <small className="text-danger">{errors.dateOfBirth}</small>}
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="staffGender">Giới tính</label>
                              <select
                                className="form-select"
                                name="staffGender"
                                value={employeeData.staffGender}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="" disabled>Chọn giới tính</option>
                                <option value={1}>Nam</option>
                                <option value={0}>Nữ</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="staffIdentification">Căn cước công dân</label>
                              <input
                                type="text"
                                className="form-control"
                                name="staffIdentification"
                                placeholder="Căn cước công dân"
                                value={employeeData.staffIdentification}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.staffIdentification && <small className="text-danger">{errors.staffIdentification}</small>}
                            </div>
                          </div>

<div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="startDate">Ngày bắt đầu</label>
                              <input
                                type="text"
                                className="form-control"
                                name="startDate"
                                placeholder="yyyy-mm-dd"
                                value={employeeData.startDate}
                                onChange={handleInputChange}
                              />
                              {errors.startDate && <small className="text-danger">{errors.startDate}</small>}

                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="endDate">Ngày kết thúc</label>
                              <input
                                type="text"
                                className="form-control"
                                name="endDate"
                                placeholder="yyyy-mm-dd"
                                value={employeeData.endDate}
                                onChange={handleInputChange}
                              />
                              {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
                              </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="phoneNumber">Số điện thoại</label>
                              <input
                                type="text"
                                className="form-control"
                                name="phoneNumber"
                                placeholder="Số điện thoại "
                                value={employeeData.phoneNumber}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                            </div>
                          </div>
<div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="relativesPhone">Số điện thoại người thân</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Số điện thoại người thân"
                                name="relativesPhone"
                                value={employeeData.relativesPhone}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
<div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="staffHome">Địa chỉ</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Địa chỉ"
                                name="staffHome"
                                value={employeeData.staffHome}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="form-group">
                              <label htmlFor="staffEmail">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                name="staffEmail"
                                placeholder="Email"
                                value={employeeData.staffEmail}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.staffEmail && <small className="text-danger">{errors.staffEmail}</small>}
                            </div>
                          </div>

                          {/* Other fields */}
                        </div>
                        <div className="col-12 d-flex justify-content-end mt-3">
                          <button type="submit" className="btn btn-primary me-2">Lưu</button>
                          <button type="reset" className="btn btn-light" onClick={resetForm}>Hủy</button>
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

export default Employee;
