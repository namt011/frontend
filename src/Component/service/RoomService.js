// buildingServices.js
import axiosInstance from "./axiosInstance ";

// Định nghĩa các endpoint API
const REST_API_BUILDING_ALL = '/building/getAll';
export const listBuilding = () => axiosInstance.get(REST_API_BUILDING_ALL);

const REST_API_BUILDING = '/building';
export const createBuildingService = (building) => axiosInstance.post(REST_API_BUILDING, building);
export const deleteBuildingService = (buildingId) => axiosInstance.delete(`${REST_API_BUILDING}/${buildingId}`);
export const get1BuildingService = (buildingId) => axiosInstance.get(`${REST_API_BUILDING}/${buildingId}`);
export const updateBuildingService = (buildingId, building) => axiosInstance.put(`${REST_API_BUILDING}/${buildingId}`, building);

// floorServices.js
const REST_API_FLOOR_ALL = '/floor/getAll';
export const listFloor = () => axiosInstance.get(REST_API_FLOOR_ALL);

const REST_API_FLOOR = '/floor';
export const createFloorService = (floor) => axiosInstance.post(REST_API_FLOOR, floor);
export const deleteFloorService = (floorId) => axiosInstance.delete(`${REST_API_FLOOR}/${floorId}`);
export const get1FloorService = (floorId) => axiosInstance.get(`${REST_API_FLOOR}/${floorId}`);
export const updateFloorService = (floorId, floor) => axiosInstance.put(`${REST_API_FLOOR}/${floorId}`, floor);

// roomServices.js
const REST_API_ROOM_URL = '/room/getAll';
export const listRoom = () => axiosInstance.get(REST_API_ROOM_URL);

const REST_API_ROOM = '/room';
export const createRoomService = (room) => axiosInstance.post(REST_API_ROOM, room);
export const deleteRoomService = (roomId) => axiosInstance.delete(`${REST_API_ROOM}/${roomId}`);
export const get1RoomService = (roomId) => axiosInstance.get(`${REST_API_ROOM}/${roomId}`);
export const updateRoomService = (roomId, room) => axiosInstance.put(`${REST_API_ROOM}/${roomId}`, room);

// roomTypeServices.js
const REST_API_ROOMTYPE_URL = '/roomType/getAll';
export const listRoomType = () => axiosInstance.get(REST_API_ROOMTYPE_URL);

const REST_API_ROOMTYPE = '/roomType';
export const createRoomTypeService = (roomType) => axiosInstance.post(REST_API_ROOMTYPE, roomType);
export const deleteRoomTypeService = (roomTypeId) => axiosInstance.delete(`${REST_API_ROOMTYPE}/${roomTypeId}`);
export const get1RoomTypeService = (roomTypeId) => axiosInstance.get(`${REST_API_ROOMTYPE}/${roomTypeId}`);
export const updateRoomTypeService = (roomTypeId, roomType) => axiosInstance.put(`${REST_API_ROOMTYPE}/${roomTypeId}`, roomType);
