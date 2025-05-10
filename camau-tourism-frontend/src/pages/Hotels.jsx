import React from 'react';
import MainLayout from '../layouts/MainLayout';
import HotelListPage from '../features/hotels/HotelListPage';
function Hotels() {
  return (
    <MainLayout>
      <HotelListPage/>
    </MainLayout>
  );
}

export default Hotels;