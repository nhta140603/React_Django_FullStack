import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import VehiclePage from "../../features/Transportations/VehiclePage";

export default function VehicleListPage(){
    return(
        <AdminLayout>
            <VehiclePage/>
        </AdminLayout>
    )
}