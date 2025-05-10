import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import BookingPage from "../../features/Hotel-rooms/RoomBookingPage"

function RoomBookingListPage(){
    return(
        <AdminLayout>
            <BookingPage/>
        </AdminLayout>
    )

}

export default RoomBookingListPage;