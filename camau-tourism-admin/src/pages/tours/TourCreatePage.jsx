import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import TourCreate from '../../features/Tours/TourCreate'
function TourCreatePage() {
  return (
    <AdminLayout>
        <TourCreate/>
    </AdminLayout>
  );
}

export default TourCreatePage;