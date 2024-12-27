import React from 'react';
import { useSidebar } from '../../features/Sidebar/context/SidebarContext';

const PageLayout = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`page-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {children}
    </div>
  );
};

export default PageLayout; 