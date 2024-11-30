import { useState } from 'react'
import './App.css'

import MainPage from './Component/MainPage'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './assets/css/bootstrap.css'
import './assets/vendors/iconly/bold.css'
import './assets/vendors/perfect-scrollbar/perfect-scrollbar.css'
import './assets/vendors/bootstrap-icons/bootstrap-icons.css'
import './assets/css/app.css'
import './assets/images/faces/1.jpg'

import './assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js'
import './assets/js/bootstrap.bundle.min.js'

import Students from './Component/admin/student/Students.jsx'
import AddStudent from  './Component/admin/student/AddStudent.jsx'
import Buildings from './Component/admin/room/building/buildings.jsx';
import Floors from './Component/admin/room/floor/floors.jsx';
import Rooms from './Component/admin/room/rooms.jsx';
import Building from './Component/admin/room/building/Building.jsx';
import Floor from './Component/admin/room/floor/Floor.jsx';
import Contracts from './Component/admin/contract/contracts.jsx';
import Employees from './Component/admin/employee/Employees.jsx';
import Requests from './Component/admin/request/Requests.jsx';
import Bills from './Component/admin/bill/Bills.jsx';
import Room from './Component/admin/room/Room.jsx';
import Accounts from './Component/admin/account/Accounts.jsx';
import Account from './Component/admin/account/Account.jsx';
import RoomTypes from './Component/admin/room/roomType/RoomTypes.jsx';
import Roomtype from './Component/admin/room/roomType/RoomType.jsx';
import Contract from './Component/admin/contract/Contract.jsx';
import Employee from './Component/admin/employee/Employee.jsx';
import Login from './Component/Login.jsx';
import RequestUC from './Component/admin/request/request.jsx';
import AddStudentToRoom from './Component/admin/room/AddStudentToRoom.jsx';

import ProtectedRoute from './Component/ProtectedRoute .jsx';
import EAccount from './Component/admin/account/eAcount/EAcount.jsx';
import EAccounts from './Component/admin/account/eAcount/EAcounts.jsx';
import MainStudentPage from './Component/user/MainStudentPage.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/user" element={<MainPage/>}/>
        
        <Route path='/admin/students' element={<ProtectedRoute requiredRole="ROOT"><Students /></ProtectedRoute>}/>
        <Route path='/admin/add-student' element={<ProtectedRoute requiredRole="ROOT"><AddStudent/></ProtectedRoute>}/>
        <Route path='/admin/update-student/:studentId' element={<ProtectedRoute requiredRole="ROOT"><AddStudent/></ProtectedRoute>}/>

        <Route path='/admin/buildings' element={<ProtectedRoute requiredRole="ROOT"><Buildings/></ProtectedRoute>}/>
        <Route path='/admin/add-building' element={<ProtectedRoute requiredRole="ROOT"><Building/></ProtectedRoute>}/>
        <Route path='/admin/update-building/:buildingId' element={<ProtectedRoute requiredRole="ROOT"><Building/></ProtectedRoute>}/>

        <Route path='/admin/floors' element={<ProtectedRoute requiredRole="ROOT"><Floors/></ProtectedRoute>}/>
        <Route path='/admin/add-floor' element={<ProtectedRoute requiredRole="ROOT"><Floor/></ProtectedRoute>}/>
        <Route path='/admin/update-floor/:floorId' element={<ProtectedRoute requiredRole="ROOT"><Floor/></ProtectedRoute>}/>

        <Route path='/admin/roomtypes' element={<ProtectedRoute requiredRole="ROOT"><RoomTypes/></ProtectedRoute>}/>
        <Route path='/admin/add-roomtype' element={<ProtectedRoute requiredRole="ROOT"><Roomtype/></ProtectedRoute>}/>
        <Route path='/admin/update-roomtype/:roomTypeId' element={<ProtectedRoute requiredRole="ROOT"><Roomtype/></ProtectedRoute>}/>

        <Route path='/admin/rooms' element={<ProtectedRoute requiredRole="ROOT"><Rooms/></ProtectedRoute>}/>
        <Route path='/admin/add-room' element={<ProtectedRoute requiredRole="ROOT"><Room/></ProtectedRoute>}/>
        <Route path='/admin/update-room/:roomId' element={<ProtectedRoute requiredRole="ROOT"><Room/></ProtectedRoute>}/>
        <Route path='/admin/add-student-room' element={<ProtectedRoute requiredRole="ROOT"><AddStudentToRoom/></ProtectedRoute>}/>

        <Route path='/admin/accounts' element={<ProtectedRoute requiredRole="ROOT"><Accounts/></ProtectedRoute>}/>
        <Route path='/admin/update-account/:userId' element={<ProtectedRoute requiredRole="ROOT"><Account/></ProtectedRoute>}/>
        <Route path='/admin/e-accounts' element={<ProtectedRoute requiredRole="ROOT"><EAccounts/></ProtectedRoute>}/>
        <Route path='/admin/update-e-account/:userId' element={<ProtectedRoute requiredRole="ROOT"><EAccount/></ProtectedRoute>}/>

        <Route path='/admin/contracts' element={<ProtectedRoute requiredRole="ROOT"><Contracts/></ProtectedRoute>}/>
        <Route path='/admin/add-contract' element={<ProtectedRoute requiredRole="ROOT"><Contract/></ProtectedRoute>}/>
        <Route path='/admin/update-contract/:contractId' element={<ProtectedRoute requiredRole="ROOT"><Contract/></ProtectedRoute>}/>

        <Route path='/admin/employees' element={<ProtectedRoute requiredRole="ROOT"><Employees/></ProtectedRoute>}/>
        <Route path='/admin/add-employee' element={<ProtectedRoute requiredRole="ROOT"><Employee/></ProtectedRoute>}/>
        <Route path='/admin/update-employee/:staffId' element={<ProtectedRoute requiredRole="ROOT"><Employee/></ProtectedRoute>}/>

        <Route path='/admin/requests' element={<ProtectedRoute requiredRole="ROOT"><Requests/></ProtectedRoute>}/>
        <Route path='/admin/add-request' element={<ProtectedRoute requiredRole="ROOT"><RequestUC/></ProtectedRoute>}/>

        <Route path='/admin/bills' element={<ProtectedRoute requiredRole="ROOT"><Bills/></ProtectedRoute>}/>

        <Route path='/login' element={<Login/>}/>

        <Route path='/dangkiphong' element={<MainStudentPage/>}/>
      </Routes>
    </Router>
  )
}

export default App