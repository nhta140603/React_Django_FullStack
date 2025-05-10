import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import TourBookingPage from '../../features/Tours/TourBookingPage'
function TourBookingListPage() {
  return (
    <AdminLayout>
        <TourBookingPage/>
    </AdminLayout>
  );
}

export default TourBookingListPage;