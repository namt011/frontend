// Đảm bảo rằng axiosInstance được import đúng
import axiosInstance from "./axiosInstance ";

// Định nghĩa các endpoint API
const REST_API_CONTRACT_ALL = '/contract/getAll';
export const listContract = () => axiosInstance.get(REST_API_CONTRACT_ALL);

const REST_API_CONTRACT = '/contract';
export const createContractService = (contract) => axiosInstance.post(REST_API_CONTRACT, contract);
export const deleteContractService = (contractId) => axiosInstance.delete(`${REST_API_CONTRACT}/${contractId}`);
export const get1ContractService = (contractId) => axiosInstance.get(`${REST_API_CONTRACT}/${contractId}`);
export const updateContractService = (contractId, contract) => axiosInstance.put(`${REST_API_CONTRACT}/${contractId}`, contract);
