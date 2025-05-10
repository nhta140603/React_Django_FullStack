import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import VehicleRentalPage from "../../features/Transportations/VehicalRentPage";

export default function VeihicalListPage(){
    return(
        <AdminLayout>
            <VehicleRentalPage/>
        </AdminLayout>
    )
}