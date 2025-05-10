import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import CuisineEditPage from '../../features/Cuisine/CuisineCreatePage'
function CuisineCreatePage() {
  return (
    <AdminLayout>
        <CuisineEditPage/>
    </AdminLayout>

  );
}

export default CuisineCreatePage;