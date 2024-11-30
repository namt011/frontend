// studentServices.js
import axiosInstance from "./axiosInstance ";

// Định nghĩa các endpoint API
const REST_API_STUDENT_ALL = '/student/getAll';  // Endpoint tương đối
export const listStudent = () => axiosInstance.get(REST_API_STUDENT_ALL);

const REST_API_STUDENT_ALL_2 = '/student/getAll2';  // Endpoint tương đối
export const listStudent2 = () => axiosInstance.get(REST_API_STUDENT_ALL_2);

const REST_API_STUDENT = '/student';  // Endpoint tương đối
export const createStudentService = (student) => axiosInstance.post(REST_API_STUDENT, student);
export const deleteStudentService = (studentId) => axiosInstance.delete(`${REST_API_STUDENT}/${studentId}`);
export const get1StudentService = (studentId) => axiosInstance.get(`${REST_API_STUDENT}/${studentId}`);
export const updateStudentService = (studentId, student) => axiosInstance.put(`${REST_API_STUDENT}/${studentId}`, student);
