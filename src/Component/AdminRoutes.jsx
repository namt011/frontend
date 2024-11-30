import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './MainPage';
import Students from './admin/student/Students';
import AddStudent from './admin/student/AddStudent';
import Buildings from './admin/room/building/buildings';
import Building from './admin/room/building/Building';
import Floors from './admin/room/floor/floors';
import Floor from './admin/room/floor/Floor';
import Rooms from './admin/room/rooms';
import Room from './admin/room/Room';
import Contracts from './admin/contract/contracts';
import Contract from './admin/contract/Contract';
import Employees from './admin/employee/Employees';
import Employee from './admin/employee/Employee';
import Requests from './admin/request/Requests';
import RequestUC from './admin/request/request';
import Bills from './admin/bill/Bills';
import Accounts from './admin/account/Accounts';
import Account from './admin/account/Account';
import RoomTypes from './admin/room/roomType/RoomTypes';
import Roomtype from './admin/room/roomType/RoomType';
import AddStudentToRoom from './admin/room/AddStudentToRoom';

export default function AdminRoutes () {
  return (
    <>
    <Router>
        <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path='/admin/students' element={<Students/>}/>
        <Route path='/admin/add-student' element={<AddStudent/>}/>
        <Route path='/admin/update-student/:studentId' element={ <AddStudent/>}></Route>

        <Route path='/admin/buildings' element={<Buildings/>}/>
        <Route path='/admin/add-building' element={<Building/>}/>
        <Route path='/admin/update-building/:buildingId' element={ <Building/>}></Route>

        <Route path='/admin/floors' element={<Floors/>}/>
        <Route path='/admin/add-floor' element={<Floor/>}/>
        <Route path='/admin/update-floor/:floorId' element={ <Floor/>}></Route>

        <Route path='/admin/roomtypes' element={<RoomTypes/>} ></Route>
        <Route path='/admin/add-roomtype' element={<Roomtype/>} ></Route>
        <Route path='/admin/update-roomtype/:roomTypeId' element={ <Roomtype/>}></Route>

        <Route path='/admin/rooms' element={<Rooms/>}/>
        <Route path='/admin/add-room' element={<Room/>}/>
        <Route path='/admin/update-room/:roomId' element={ <Room/>}></Route>
        <Route path='/admin/add-student-room' element={<AddStudentToRoom/>}/>

        <Route path='/admin/accounts' element={<Accounts/>}/>
        <Route path='/admin/update-account/:userId' element={<Account/>}/>

        <Route path='/admin/contracts' element={<Contracts/>}/>
        <Route path='/admin/add-contract' element={<Contract/>}/>

        <Route path='/admin/employees' element={<Employees/>}/>
        <Route path='/admin/add-employee' element={<Employee/>}/>

        <Route path='/admin/requests' element={<Requests/>}/>
        <Route path='/admin/add-request' element={<RequestUC/>}/>

        <Route path='/admin/bills' element={<Bills/>}/>
        </Routes>
    </Router>
    
    </>
  )
}
