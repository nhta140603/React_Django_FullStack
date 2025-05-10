import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import HotelsPage from '../../features/Hotels/HotelsPage'
function HotelListPage() {
  return (
    <AdminLayout>
        <HotelsPage/>
    </AdminLayout>
  );
}

export default HotelListPage;