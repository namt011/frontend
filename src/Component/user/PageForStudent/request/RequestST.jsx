import React, { useState, useEffect } from 'react';
import SideBarStudent from '../../SideBarStudent';
import HeaderStudent from '../../HeaderStudent';
import Footer from '../../../Footer';
import { createRequirementService, updateRequirementService, get1RequirementService } from '../../../service/RequestService';
import { get1StudentService } from '../../../service/StudentService';
import { useParams } from 'react-router-dom';

const RequestST = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);
  const [studentData, setStudentData] = useState(null); // To store student data
  const [requirement, setRequirement] = useState(null); // To hold the contract details (if updating)
  const [requirementStatus, setRequirementStatus] = useState('');
  const [studentId, setStudentId] = useState('');
  const [requirementName, setRequirementName] = useState('');
  const [requirementDes, setRequirementDes] = useState('');
  const [reStudentId, setReStudentId] = useState('');
  
  const { requirementId } = useParams();

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch requirement data when requirementId is available
  useEffect(() => {
    if (requirementId) {
      get1RequirementService(requirementId)
        .then((response) => {
          if (response.data.code === '200') {
            const requirementData = response.data.data;
            setRequirement(requirementData); // Set contract data when API call is successful
            setRequirementName(requirementData.requirementName);
            setRequirementDes(requirementData.requirementDes);
            setRequirementStatus(requirementData.status);
            setReStudentId(requirementData.student.studentId);
            setStudentId(requirementData.student.studentId); // Set the student ID for update
          }
        })
        .catch((error) => {
          console.error("Error fetching requirement data:", error);
        });
    } else {
      // Get student ID from localStorage if creating new requirement
      const storedStudentId = localStorage.getItem('ID');
      if (storedStudentId) {
        setStudentId(storedStudentId); // Set studentId from localStorage
      }
    }
  }, [requirementId]);

  // Fetch student data when studentId is updated
  useEffect(() => {
    if (studentId) {
      get1StudentService(studentId)
        .then((response) => {
          if (response.data.code === '200') {
            setStudentData(response.data.data); // Set student data when API call is successful
          }
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
        });
    }
  }, [studentId]);

  // Handle form submission
  const handleSave = () => {
    const requestBody = {
        requirementId: requirementId || undefined, // Include requirementId if updating
        requirementName,
        requirementDes,
        student: studentData, // Use the fetched student data
        staff: null, // Assuming no staff info is needed
        status: requirementId ? requirementStatus : 'WAITING', // Giữ nguyên trạng thái khi cập nhật, mặc định là "WAITING" khi tạo
        createAt: requirementId ? requirement.createAt : new Date().toISOString(), // Retain createAt for update, add current timestamp for create
        updateAt: requirementId ? new Date().toISOString() : undefined, // Add updateAt when updating
      };

    // Create or update requirement based on the presence of requirementId
    if (requirementId) {
      updateRequirementService(requirementId, requestBody)
        .then((response) => {
          if (response.data.code === '200') {
            alert("Requirement updated successfully");
          }
        })
        .catch((error) => {
          console.error("Error updating requirement:", error);
        });
    } else {
      createRequirementService(requestBody)
        .then((response) => {
          if (response.data.code === '200') {
            alert("Requirement created successfully");
          }
        })
        .catch((error) => {
          console.error("Error creating requirement:", error);
        });
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div id="app">
      <div id="main">
        <HeaderStudent onToggleSidebar={toggleSidebar} />
        <SideBarStudent isActive={isActive} onToggleSidebar={toggleSidebar} />
        <div id="main-content">
          <section className="section">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">{requirementId ? "Cập nhật yêu cầu khiếu nại" : "Thêm yêu cầu khiếu nại"}</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="basicInput">Tên yêu cầu khiếu nại</label>
                      <input
                        type="text"
                        className="form-control"
                        id="basicInput"
                        value={requirementName}
                        onChange={(e) => setRequirementName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="basicInput">Nội dung</label>
                      <input
                        type="text"
                        className="form-control"
                        id="basicInput"
                        value={requirementDes}
                        onChange={(e) => setRequirementDes(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="helpInputTop">Mã sinh viên</label>
                      <input
                        type="text"
                        className="form-control"
                        id="helpInputTop"
                        value={requirementId ? reStudentId : studentId} // Ensure it always has a value
                        onChange={(e) => setStudentId(e.target.value)}
                        disabled // Optionally, disable input if updating
                      />
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary mt-3" onClick={handleSave}>
                  {requirementId ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RequestST;
