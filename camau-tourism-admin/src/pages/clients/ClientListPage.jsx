import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ClientPage from '../../features/Clients/ClientPage'
function ClientListPage() {
  return (
    <AdminLayout>
        <ClientPage/>
    </AdminLayout>

  );
}

export default ClientListPage;