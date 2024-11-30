// roleServices.js
import axiosInstance from "./axiosInstance ";

// Định nghĩa các endpoint API
const REST_API_ROLE_ALL = '/Role/getAll';  // Endpoint tương đối
export const listRole = () => axiosInstance.get(REST_API_ROLE_ALL);

const REST_API_ROLE = '/Role';  // Endpoint tương đối
export const createRoleService = (role) => axiosInstance.post(REST_API_ROLE, role);
export const deleteRoleService = (roleId) => axiosInstance.delete(`${REST_API_ROLE}/${roleId}`);
export const get1RoleService = (roleId) => axiosInstance.get(`${REST_API_ROLE}/${roleId}`);
export const updateRoleService = (roleId, role) => axiosInstance.put(`${REST_API_ROLE}/${roleId}`, role);
