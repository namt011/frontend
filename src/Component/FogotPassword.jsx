import React, { useState } from 'react';
import axiosInstance from './service/axiosInstance ';

const FogotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false); // To track if OTP is sent

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle sending OTP
  const handleSendOtp = async () => {
    try {
      const response = await axiosInstance.post('/user/forgot-password', { email });
      if (response.status === 200) {
        setOtpSent(true);
        alert('OTP đã được gửi đến email của bạn');
      }
    } catch (error) {
      console.error(error);
      alert('Thông tin email chưa chính xác');
    }
  };

  // Handle validating OTP
  const handleValidateOtp = async () => {
    try {
      const response = await axiosInstance.post('/user/validate-otp', { email, otp });
      if (response.status === 200) {
        alert('OTP hợp lệ');
        handleResetPassword();
      }
    } catch (error) {
      console.error(error);
      alert('OTP không hợp lệ');
    }
  };

  // Handle resetting password
  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    try {
      const response = await axiosInstance.post('/user/reset-password', { email, otp, newPassword });
      if (response.status === 200) {
        alert('Mật khẩu đã được đổi thành công');
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi đổi mật khẩu');
    }
  };

  return (
    <div>
      <section className="bg-light py-3 py-md-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
              <div className="card border border-light-subtle rounded-3 shadow-sm">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="text-center mb-3">
                    <a href="#!">
                      <img
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/03/Logo-Dai-Hoc-Giao-Thong-Van-Tai-UTC.png"
                        alt="Logo"
                        width="175"
                        height="175"
                      />
                    </a>
                  </div>
                  <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                    Đổi mật khẩu
                  </h2>

                  <form>
                    <div className="row gy-2 overflow-hidden">
                    <div className="col-12">
  <div className="d-flex">
    <div className="form-floating mb-3 me-2 flex-grow-1">
      <input
        type="email"
        className="form-control"
        id="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label htmlFor="email" className="form-label">
        Nhập email
      </label>
    </div>
    <button
      type="button"
      className="btn btn-primary mb-3"
      onClick={handleSendOtp}
    >
      Gửi OTP
    </button>
  </div>
</div>

                      {otpSent && (
                        <>
                          <div className="col-12">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="otp"
                                placeholder="OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                              />
                              <label htmlFor="otp" className="form-label">
                                OTP
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-floating mb-3 pt-3">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                className="form-control"
                                id="newPassword"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                              />
                              <label htmlFor="newPassword" className="form-label">
                                Mật khẩu mới
                              </label>
                              <button
                                type="button"
                                className="btn btn-link text-decoration-none"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? "Ẩn" : "Hiện"}
                              </button>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-floating mb-3">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                id="confirmNewPassword"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                              />
                              <label htmlFor="confirmNewPassword" className="form-label">
                                Nhập lại mật khẩu mới
                              </label>
                              <button
                                type="button"
                                className="btn btn-link text-decoration-none"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? "Ẩn" : "Hiện"}
                              </button>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="d-grid my-3">
                              <button
                                className="btn btn-primary btn-lg"
                                type="button"
                                onClick={handleValidateOtp}
                              >
                                Đổi mật khẩu
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FogotPassword;
