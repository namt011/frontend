// Đảm bảo rằng axiosInstance được import đúng
import axiosInstance from "./axiosInstance ";

// Định nghĩa các endpoint API
const REST_API_BILL_ALL = '/bill/getAll';
export const listBill = () => axiosInstance.get(REST_API_BILL_ALL);

const REST_API_BILL2 = '/bill/testCurrentMonth';
export const createBill2Service = (bill) => axiosInstance.post(REST_API_BILL2, bill);

const REST_API_BILL = '/bill';
export const createBillService = (bill) => axiosInstance.post(REST_API_BILL, bill);
export const deleteBillService = (billId) => axiosInstance.delete(`${REST_API_BILL}/${billId}`);
export const get1BillService = (billId) => axiosInstance.get(`${REST_API_BILL}/${billId}`);
export const updateBillService = (billId, bill) => axiosInstance.put(`${REST_API_BILL}/${billId}`, bill);
