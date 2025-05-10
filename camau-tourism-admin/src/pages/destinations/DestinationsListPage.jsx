import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import DestinationsPage from '../../features/Destinations/DestinationsPage'
function ClientListPage() {
  return (
    <AdminLayout>
        <DestinationsPage/>
    </AdminLayout>

  );
}

export default ClientListPage;