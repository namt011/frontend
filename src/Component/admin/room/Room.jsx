import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar';
import Header from '../../Header';
import Footer from '../../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { createRoomService, updateRoomService, get1RoomService } from '../../service/RoomService';
import { listRoomType } from '../../service/RoomService';
import { listFloor } from '../../service/RoomService';
import { listStudent2, updateStudentService } from '../../service/StudentService';

const Room = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [roomName, setRoomName] = useState('');
  const [roomDes, setRoomDes] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomStatus, setRoomStatus] = useState('');
  const [roomGender, setRoomGender] = useState('');
  const [floor, setFloor] = useState('');
  const [floors, setFloors] = useState([]); // Now includes floor and building data
  const [roomTypes, setRoomTypes] = useState([]);
  const [students, setStudents] = useState([]); // State to store students in the room
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      get1RoomService(roomId)
        .then((response) => {
          const room = response.data.data;
          setRoomName(room.roomName);
          setRoomDes(room.roomDes);
          setRoomNumber(room.roomNumber);
          setRoomType(room.roomType.roomTypeId);
          setRoomStatus(room.roomStatus);
          setRoomGender(room.roomGender);
          setFloor(room.floor.floorId);

          // Fetch students for the room when updating
          listStudent2()
          .then((res) => {
            if (Array.isArray(res.data.data)) {
              // Filter students who are in the current room
              const studentsInRoom = res.data.data.filter(student => student.roomDTO && student.roomDTO.roomId === roomId);
              setStudents(studentsInRoom);
            } else {
              console.error('Expected an array but got:', res.data);
            }
          })
          .catch((error) => {
            console.error('Error fetching students:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching room data:', error);
      });
  }

    listFloor()
      .then((response) => {
        setFloors(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching floors:', error);
      });

    listRoomType()
      .then((response) => {
        setRoomTypes(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching room types:', error);
      });

    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [roomId]);

  const addStudentRoom = () =>{
    navigate('/admin/add-student-room', { state: { roomName } });
  }

  const deleteStudentFromRoom = (studentId) => {
    // Find the student in the students array by their ID
    const studentToUpdate = students.find(student => student.studentDTO.studentId === studentId);
    
    if (studentToUpdate) {
      const updatedStudent = {
        ...studentToUpdate.studentDTO,
        roomName: null,  // Remove student from the room
      };
    
      updateStudentService(studentId, updatedStudent)
        .then((response) => {
          // Update students state to reflect the removal
          setStudents(prevStudents => prevStudents.filter(student => student.studentDTO.studentId !== studentId));
          
          // After removing a student, update the room's number of students
          const updatedRoomData = {
            ...roomData,
            roomNumber: roomData.roomNumber - 1,  // Decrease room number by 1
          };
  
          updateRoomService(roomId, updatedRoomData)
            .then((response) => {
              console.log('Room updated with new number of students');
            })
            .catch((error) => {
              console.error('Error updating room number:', error);
            });
        })
        .catch((error) => {
          console.error('Error removing student from room:', error);
        });
    }
  };
  
  const saveOrUpdateRoom = (e) => {
    e.preventDefault();
  
    // Find the building name based on the selected floor
    const selectedFloor = floors.find(floorItem => floorItem.floorId === floor);
    const buildingName = selectedFloor ? selectedFloor.building.buildingName : '';
  
    // Append building name to roomName only when creating a new room
    const fullRoomName = roomId ? roomName : `${roomName}${buildingName}`;
  
    // Prepare the room data
    const roomData = {
      roomName: fullRoomName,  // Use fullRoomName for new rooms only
      roomDes,
      roomType: { roomTypeId: roomType },
      floor: { floorId: floor },
      roomNumber: 0, // Default value, will be updated later
      roomStatus,
      roomGender: roomGender,
    };
  
    // Fetch students in the room to calculate the current roomNumber
    if (roomId) {
      // If updating an existing room, fetch the current list of students in the room
      listStudent2()
        .then((res) => {
          if (Array.isArray(res.data.data)) {
            // Filter students who are currently in this room
            const studentsInRoom = res.data.data.filter(student => student.roomDTO && student.roomDTO.roomId === roomId);
            const updatedRoomData = {
              ...roomData,
              roomNumber: studentsInRoom.length,  // Set roomNumber to the number of students in the room
            };
  
            // Call updateRoomService with the updated room data
            updateRoomService(roomId, updatedRoomData)
              .then((response) => {
                navigate('/admin/rooms');
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            console.error('Expected an array but got:', res.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching students:', error);
        });
    } else {
      // If creating a new room, no students yet, so roomNumber remains 0
      createRoomService(roomData)
        .then((response) => {
          navigate('/admin/rooms');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  
  const toggleSidebar = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div id='app'>
      <div id='main'>
        <Header onToggleSidebar={toggleSidebar} />
        <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id='main-content'>
          <section id='multiple-column-form'>
            <div className='row match-height'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header'>
                    <h4 className='card-title'>{roomId ? 'Cập nhật phòng' : 'Thêm mới phòng'}</h4>
                  </div>
                  <div className='card-content'>
                    <div className='card-body'>
                      <form className='form'>
                        <div className='row'>
                          <div className='col-md-6 col-12'>
                            <div className='form-group'>
                              <label htmlFor='roomName'>Tên phòng</label>
                              <input
                                type='text'
                                className='form-control'
                                id='roomName'
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className='col-md-6 col-12'>
                            <div className='form-group'>
                              <label htmlFor='roomDes'>Mô tả</label>
                              <input
                                type='text'
                                className='form-control'
                                id='roomDes'
                                value={roomDes}
                                onChange={(e) => setRoomDes(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className='col-md-6 col-12'>
                            <div className='form-group'>
                              <label htmlFor='roomNumber'>Số người tối đa</label>
                              <input
                                type='number'
                                className='form-control'
                                id='roomNumber'
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className='col-md-6 col-12'>
                            <label htmlFor='roomType' className='fw-bold'>Loại phòng</label>
                            <select
                              className='form-select'
                              id='roomType'
                              value={roomType}
                              onChange={(e) => setRoomType(e.target.value)}
                            >
                              <option value='' disabled>Chọn loại phòng</option>
                              {roomTypes.map((type) => (
                                <option key={type.roomTypeId} value={type.roomTypeId}>
                                  {type.roomTypeName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className='col-md-6 col-12'>
                            <label htmlFor='roomStatus' className='fw-bold mt-2'>Trạng thái</label>
                            <select
                              className='form-select'
                              id='roomStatus'
                              value={roomStatus}
                              onChange={(e) => setRoomStatus(e.target.value)}
                            >
                              <option value='' disabled>Chọn trạng thái</option>
                              <option value='1'>Trống</option>
                              <option value='2'>Hết chỗ</option>
                              <option value='3'>Bảo trì</option>
                            </select>
                          </div>
                          <div className='col-md-6 col-12'>
                            <label htmlFor='roomGender'className='fw-bold mt-2'>Giới tính</label>
                            <select
                              className='form-select'
                              id='roomGender'
                              value={roomGender ? '1' : '0'}
                              onChange={e => setRoomGender(e.target.value === '1')}
                            >
                              <option value='' disabled>Chọn giới tính</option>
                              <option value='1'>Nam</option>
                              <option value='0'>Nữ</option>
                            </select>
                          </div>
                          <div className='col-md-6 col-12'>
                            <label htmlFor='floor' className='fw-bold mt-2'>Vị trí</label>
                            <select
                              className='form-select'
                              id='floor'
                              value={floor}
                              onChange={(e) => setFloor(e.target.value)}
                            >
                              <option value='' disabled>Chọn vị trí phòng</option>
                              {floors.map((floorItem) => (
                                <option key={floorItem.floorId} value={floorItem.floorId}>
                                  {floorItem.floorName} tòa {floorItem.building.buildingName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className='col-12 d-flex justify-content-end'>
                            <button
                              type='submit'
                              className='btn btn-primary me-1 mb-1'
                              onClick={saveOrUpdateRoom}
                            >
                              {roomId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            <button type='reset' className='btn btn-light-secondary me-1 mb-1'>Reset</button>
                          </div>
                        </div>
                      </form>
                      {/* Display students in the room if in update mode */}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {roomId && (
                        <div className='card'>
                        <div className='card-header'>
                          <h4 className='card-title'>Danh sách sinh viên trong phòng</h4>
                        </div>
                        <div className='card-content'>
                          <div className='card-body'>
                        <div className='table-responsive'>
                          <table className='table table-bordered'>
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Họ và tên</th>
                                <th>Ngày sinh</th>
                                <th>Lớp</th>
                                <th>Giới tính</th>
                                <th>Hành động </th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((student) => (
                                <tr key={student.studentDTO.studentId}>
                                  <td>{student.studentDTO.studentId}</td>
                                  <td>{student.studentDTO.fullname}</td>
                                  <td>{new Date(student.studentDTO.dateOfBirth).toLocaleDateString()}</td>
                                  <td>{student.studentDTO.studentClass}</td>
                                  <td>{student.studentDTO.studentGender ? 'Nam' : 'Nữ'}</td>
                                  <td>
                                  <div className="buttons">
                                  <button
            className="btn btn-danger rounded-pill mb-0 mr-0"
            onClick={() => deleteStudentFromRoom(student.studentDTO.studentId)}
          >
            Xóa
          </button>
                                          </div>
                                  </td>
                                </tr>
                              ))}
                              {students.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="text-center">Chưa có sinh viên trong phòng này</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className='col-12 d-flex justify-content-end'>
                            <button
                              type='submit'
                              className='btn btn-primary me-1 mb-1'
                              onClick={addStudentRoom}
                            >
                              Thêm sinh viên
                            </button>
                            <button type='reset' className='btn btn-light-secondary me-1 mb-1'>Reset</button>
                          </div>
                        </div>
                        </div>
                        </div>
                      )}
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Room;
