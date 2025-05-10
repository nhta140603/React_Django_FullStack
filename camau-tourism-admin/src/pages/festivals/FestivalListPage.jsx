import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import FestivalsPage from "../../features/Festivals/FestivalsPage";

function FestivalListPage() {
  return (
    <AdminLayout>
      <FestivalsPage />
    </AdminLayout>
  );
}

export default FestivalListPage;