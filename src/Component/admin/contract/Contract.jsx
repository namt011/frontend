import React from 'react'
import { useEffect,useState } from 'react';
import SideBar from '../../SideBar';
import Header from '../../Header';
import Footer from '../../Footer';

const Contract = () => {
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
            <Header onToggleSidebar={toggleSidebar} />
            <SideBar isActive={isActive} onToggleSidebar={toggleSidebar} />
              <div id='main-content'>
                
              </div>
              <Footer/>
            </div>
          </div>
      )
}

export default Contract