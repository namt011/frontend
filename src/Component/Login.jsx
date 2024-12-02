import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Sử dụng axios để gọi API
import axiosInstance from './service/axiosInstance ';
// Đảm bảo axiosInstance được định nghĩa và cấu hình đúng

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Xóa dữ liệu cũ khỏi localStorage
    localStorage.setItem('accessToken', null);
    localStorage.setItem('refreshToken', null);
    localStorage.setItem('role', null);
    localStorage.setItem('ID', null);
  }, []);

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Lưu trữ accessToken và refreshToken vào localStorage sau khi đăng nhập thành công
  const saveUserSession = (accessToken, refreshToken,data) => {
    localStorage.setItem('accessToken', accessToken); // Lưu accessToken vào localStorage
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('ID', data); // Lưu refreshToken vào localStorage
  };

  // Gọi API /user/getAll và lấy roleName từ dữ liệu
  const fetchUserRole = async () => {
    try {
      // Gọi API /user/getAll với axiosInstance
      const response = await axiosInstance.get('/user/getAll', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.status === 200) {
        const user = response.data.data.find(
          (user) => user.accessToken === localStorage.getItem('accessToken')
        );

        if (user) {
          const roleName = user.role.roleName;
          console.log('Role Name:', roleName);
          // Lưu roleName vào localStorage hoặc làm gì đó với giá trị này
          localStorage.setItem('role', roleName);

          // Kiểm tra role và điều hướng
          if (roleName !== 'ROOT') {
            navigate('/dangkiphong'); // Nếu role không phải ROOT, chuyển đến trang đăng ký phòng
          } else {
            navigate('/admin/students'); // Nếu role là ROOT, chuyển đến trang admin
          }
        } else {
          console.error('Token không khớp với bất kỳ người dùng nào');
        }
      } else {
        console.error('Không thể lấy dữ liệu người dùng');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Submitting login form...');

    try {
      const response = await axios.post('http://localhost:8080/auth/signin', {
        username: email,
        password: password,
      });

      console.log(response); // Kiểm tra xem phản hồi có đúng không

      if (response.status === 200) { // Kiểm tra status code thay vì `response.code`
        const { accessToken, refreshToken,data } = response.data;

        saveUserSession(accessToken, refreshToken,data); // Lưu accessToken vào localStorage

        // Sau khi lưu accessToken, gọi API lấy role
        await fetchUserRole(); // Lấy roleName và điều hướng sau khi gọi API thành công
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please try again.');
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
                    Sign in to your account
                  </h2>

                  {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="row gy-2 overflow-hidden">
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="name@example.com"
                            value={email}
                            onChange={handleEmailChange}
                            required
                          />
                          <label htmlFor="email" className="form-label">
                            User Name
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <div className="position-relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="form-control"
                              name="password"
                              id="password"
                              value={password}
                              onChange={handlePasswordChange}
                              placeholder="Password"
                              style={{ paddingRight: '40px' }}
                              required
                            />
                            <button
                              type="button"
                              className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                              onClick={togglePasswordVisibility}
                              style={{
                                right: '0.75rem',
                                zIndex: 3,
                              }}
                            >
                              {showPassword ? (
                                <Eye className="w-4 h-4 text-gray-500" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                          <label htmlFor="password" className="form-label"></label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-grid my-3">
                          <button className="btn btn-primary btn-lg" type="submit">
                            Log in
                          </button>
                        </div>
                      </div>

                      <div className="col-12">
                        <p className="m-0 text-secondary text-center">
                          Don't have an account?{' '}
                          <a href="/dangkiphong" className="link-primary text-decoration-none">
                            Sign up
                          </a>
                        </p>
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
  );
};

export default Login;
