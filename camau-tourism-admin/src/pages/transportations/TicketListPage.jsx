import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import TicketPage from "../../features/Transportations/TicketPage"

export default function TicketListPage(){
    return(
        <AdminLayout>
            <TicketPage/>
        </AdminLayout>
    )
}