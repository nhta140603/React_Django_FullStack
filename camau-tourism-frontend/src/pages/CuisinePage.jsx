import React from 'react';
import MainLayout from '../layouts/MainLayout';
import CuisineList from '../features/cuisines/FeaturedCuisine'
function CuisinePage() {
  return (
    <MainLayout>
      <CuisineList/>
    </MainLayout>
  );
}

export default CuisinePage;