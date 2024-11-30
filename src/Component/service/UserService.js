// userServices.js
import axiosInstance from "./axiosInstance ";

// Định nghĩa các endpoint API
const REST_API_USER_ALL = '/user/getAll';  // Endpoint tương đối
export const listUser = () => axiosInstance.get(REST_API_USER_ALL);

const REST_API_USER = '/user';  // Endpoint tương đối
export const createUserService = (user) => axiosInstance.post(REST_API_USER, user);
export const deleteUserService = (userId) => axiosInstance.delete(`${REST_API_USER}/${userId}`);
export const get1UserService = (userId) => axiosInstance.get(`${REST_API_USER}/${userId}`);
export const updateUserService = (userId, user) => axiosInstance.put(`${REST_API_USER}/update/${userId}`, user);
