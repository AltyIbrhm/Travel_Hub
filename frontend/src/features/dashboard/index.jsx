import React from 'react';
import Sidebar from '../Sidebar';
import DashboardLayout from './DashboardLayout';
import { SidebarProvider } from '../Sidebar/context/SidebarContext';

const Dashboard = () => {
  return (
    <div className="layout-wrapper">
      <SidebarProvider>
        <Sidebar />
        <DashboardLayout />
      </SidebarProvider>
    </div>
  );
};

export default Dashboard; 