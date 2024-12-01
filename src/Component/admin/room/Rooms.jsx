import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar.jsx';
import Header from '../../Header.jsx';
import Footer from '../../Footer.jsx';
import { listBuilding, listRoom, deleteRoomService } from '../../service/RoomService.js';
import { useNavigate, useParams } from 'react-router-dom';

const Rooms = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [activeTab, setActiveTab] = useState("");
  const [tabsData, setTabsData] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]); // Initialize as empty array instead of undefined
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { roomId } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [buildingResponse, roomResponse] = await Promise.all([
          listBuilding(),
          listRoom()
        ]);
        
        setBuildings(buildingResponse.data.data || []);
        setRooms(roomResponse.data.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (buildings.length > 0) {
      const updatedTabsData = buildings.map((building) => ({
        id: building.buildingId,
        title: building.buildingName
      }));
      setTabsData(updatedTabsData);
      setActiveTab(buildings[0].buildingId);
    }
  }, [buildings]);

  const toggleSidebar = () => {
    setIsActive(prev => !prev);
  };

  // Compute cardDataByTab based on the rooms fetched, with null check
  const cardDataByTab = rooms?.reduce((acc, room) => {
    if (!room?.floor?.building?.buildingId) return acc;
    
    const buildingId = room.floor.building.buildingId;
    if (!acc[buildingId]) {
      acc[buildingId] = [];
    }

    acc[buildingId].push({
      ID: room.roomId,
      title: room.roomName || 'Unnamed Room',
      gender: room.roomGender || 0,
      text: room.roomStatus || 'No status',
      roomMaxNumber: room.roomType.roomNumber || '',
      roomNumber: room.roomNumber || '0'
    });

    return acc;
  }, {}) || {};
  function updateRoom(roomId) {
    navigator(`/admin/update-room/${roomId}`, {
        state: {
          roomId
        }
    })
}
const deleteRoom = (roomId) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
  if (confirmDelete) {
    deleteRoomService(roomId)
      .then(() => {
        // Sau khi xóa thành công, cập nhật lại danh sách phòng
        setRooms((prevRooms) => prevRooms.filter(room => room.roomId !== roomId));
      })
      .catch(error => {
        console.error(error);
        // Xử lý lỗi nếu có
      });
  }
};

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }
  return (
    <div id='app'>
      <div id='main'>
        <Header onToggleSidebar={toggleSidebar} />
        <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id='main-content'>
          <section className="section">
            <div className="row" id="table-hover-row">
              <div className="col-12">
                <div className="card p-2">
                  <div className="card-header pb-0">
                    <h4 className="card-title">Danh sách các phòng</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body d-flex">
                      <div>
                        <a href="/admin/add-room" className="btn btn-success">Thêm mới</a>
                      </div>
                      <div className='m-2'>
                      </div>
                      <form>
                        <div className="input-group ml-3">
                          <input type="text" className="form-control" placeholder="Search" />
                          <div className="input-group-btn">
                            <button className="btn btn-default" type="submit">
                              <i className="bi bi-search"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-body">
                          {tabsData.length > 0 ? (
                            <>
                              <ul className="nav nav-tabs" id="myTab" role="tablist">
                                {tabsData.map((tab) => (
                                  <li className="nav-item" role="presentation" key={tab.id}>
                                    <a
                                      className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                      id={`tab-${tab.id}-tab`}
                                      data-bs-toggle="tab"
                                      href={`#tab-${tab.id}`}
                                      role="tab"
                                      aria-controls={`tab-${tab.id}`}
                                      aria-selected={activeTab === tab.id}
                                      onClick={() => setActiveTab(tab.id)}
                                    >
                                      {tab.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                              <div className="tab-content" id="myTabContent">
                                {tabsData.map((tab) => {
                                  const cards = cardDataByTab[tab.id] || [];
                                  return (
                                    <div
                                      className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
                                      id={`tab-${tab.id}`}
                                      role="tabpanel"
                                      aria-labelledby={`tab-${tab.id}-tab`}
                                      key={tab.id}
                                    >
                                      <section id="groups" className="shadow-sm mb-5 rounded">
  <div className="row match-height">
    <div className="col-12">
      <div className="card outer-card">
        <div className="card-content">
          <div className="card-body">
            {cards.length > 0 ? (
              <div className="nested-card-grid">
                {cards.map((card, index) => (
                  <div key={index} className="card inner-card shadow mb-5 rounded">
                    <div className="card-content">
                      <div className="card-body p-3">
                        <div className="card-title d-flex justify-content-between">
                          <h4>{card.title}</h4>
                          <button
                            type="button"
                            className={
                              card.gender === 0
                                ? "btn btn-outline-danger rounded-circle"
                                : "btn btn-outline-primary rounded-circle"
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className={
                                card.gender === 0
                                  ? "bi bi-gender-female"
                                  : "bi bi-gender-male"
                              }
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d={
                                  card.gender === 0
                                    ? "M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5"
                                    : "M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8"
                                }
                              />
                            </svg>
                          </button>
                        </div>
                        <p className="card-text">{card.text}</p>
                        <small className="text-muted">Số người đang ở {card.roomNumber}/{card.roomMaxNumber} người</small>
                        <div className="card-footer p-0 mt-2 pt-2">
                          <div className="d-flex gap-2">
                            <button type="button" className="btn btn-primary" onClick={()=>updateRoom(card.ID)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-pencil-square"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.813z" />
                                <path
                                  fillRule="evenodd"
                                  d="M1 13.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z"
                                />
                              </svg>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={()=>deleteRoom(card.ID)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7z" />
                                <path
                                  fillRule="evenodd"
                                  d="M14.5 3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1h11zm-11-1h8a1 1 0 0 0 1-1h-10a1 1 0 0 0-1 1h10zM7 1a2 2 0 0 1 4 0h-4z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">No rooms found for this building.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

  <style>
    {`
      .nested-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
      }

  

      .inner-card {
        max-width: 250px;
        min-width: 200px;
        margin: auto;
      }

      .inner-card .card-title {
        font-size: 1.2rem;
      }

      .card-footer {
        text-align: center;
      }
    `}
  </style>
</section>

                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="alert alert-info">
                              No buildings found. Please add buildings first.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Rooms;