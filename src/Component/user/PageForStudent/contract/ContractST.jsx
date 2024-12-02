import React, { useState, useEffect, useRef } from 'react';

import SideBarStudent from '../../SideBarStudent.jsx';
import HeaderStudent from '../../HeaderStudent.jsx';
import Footer from '../../../Footer.jsx';


const ContractST = () => {
  const [isActive, setIsActive] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    
  }, []);
  // Hàm để thay đổi giá trị isActive  

  const toggleSidebar = () => {  
    setIsActive(prev => !prev); // Trả về giá trị ngược lại  
  }; 

    return (
        <div id='app'>
          <div id='main'>
          <HeaderStudent onToggleSidebar={toggleSidebar} />
          <SideBarStudent isActive={isActive} onToggleSidebar={toggleSidebar} />
            <div id='main-content'>
              Ở đây sẽ add ảnh cái hợp đồng vào
            </div>
            <Footer/>
          </div>
        </div>
    )
  }
  
  export default ContractST;