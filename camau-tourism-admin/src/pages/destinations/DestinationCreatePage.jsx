import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import DestinationCreate from '../../features/Destinations/DestinationCreate'
function DestinationCreatePage() {
  return (
    <AdminLayout>
        <DestinationCreate/>
    </AdminLayout>

  );
}

export default DestinationCreatePage;