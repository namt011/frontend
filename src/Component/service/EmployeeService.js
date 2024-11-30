// employeeServices.js (hoặc file bạn sử dụng)
import axiosInstance from './axiosInstance ';  // Import axiosInstance đã được cấu hình

// Định nghĩa các endpoint API
const REST_API_EMPLOYEE_ALL = '/staff/getAll';  // Endpoint tương đối
export const listEmployee = () => axiosInstance.get(REST_API_EMPLOYEE_ALL);

const REST_API_EMPLOYEE = '/staff';  // Endpoint tương đối
export const createEmployeeService = (employee) => axiosInstance.post(REST_API_EMPLOYEE, employee);
export const deleteEmployeeService = (employeeId) => axiosInstance.delete(`${REST_API_EMPLOYEE}/${employeeId}`);
export const get1EmployeeService = (employeeId) => axiosInstance.get(`${REST_API_EMPLOYEE}/${employeeId}`);
export const updateEmployeeService = (employeeId, employee) => axiosInstance.put(`${REST_API_EMPLOYEE}/${employeeId}`, employee);
