import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import TourPage  from "../../features/Tours/ToursPage";

function TourListPage(){
    return(
        <AdminLayout>
            <TourPage/>
        </AdminLayout>
    )
}

export default TourListPage;
