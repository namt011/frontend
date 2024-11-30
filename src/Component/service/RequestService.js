// requirementServices.js
import axiosInstance from "./axiosInstance ";

// Định nghĩa các endpoint API
const REST_API_REQUIREMENT_ALL = '/requirement/getAll';  // Endpoint tương đối
export const listRequirement = () => axiosInstance.get(REST_API_REQUIREMENT_ALL);

const REST_API_REQUIREMENT = '/requirement';  // Endpoint tương đối
export const createRequirementService = (requirement) => axiosInstance.post(REST_API_REQUIREMENT, requirement);
export const deleteRequirementService = (requirementId) => axiosInstance.delete(`${REST_API_REQUIREMENT}/${requirementId}`);
export const get1RequirementService = (requirementId) => axiosInstance.get(`${REST_API_REQUIREMENT}/${requirementId}`);
export const updateRequirementService = (requirementId, requirement) => axiosInstance.put(`${REST_API_REQUIREMENT}/${requirementId}`, requirement);
