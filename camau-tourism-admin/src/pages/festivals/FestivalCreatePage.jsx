import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import FestivalCreate from "../../features/Festivals/FestivalsCreate";

function FestivalCreatePage() {
  return (
    <AdminLayout>
      <FestivalCreate />
    </AdminLayout>
  );
}

export default FestivalCreatePage;