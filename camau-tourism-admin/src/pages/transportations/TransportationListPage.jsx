import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import TransportationsPage from "../../features/Transportations/TransportationPage";

export default function TransportationsListPage(){
    return(
        <AdminLayout>
            <TransportationsPage/>
        </AdminLayout>
    )
}