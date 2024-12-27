import React from 'react';
import BookRideLayout from './BookRideLayout';
import { SidebarProvider } from '../Sidebar/context/SidebarContext';
import Sidebar from '../Sidebar/SidebarLayout';
import PageLayout from '../../components/Layout/PageLayout';

const BookRide = () => {
  return (
    <SidebarProvider>
      <div className="layout-wrapper">
        <Sidebar />
        <PageLayout>
          <BookRideLayout />
        </PageLayout>
      </div>
    </SidebarProvider>
  );
};

export default BookRide; 