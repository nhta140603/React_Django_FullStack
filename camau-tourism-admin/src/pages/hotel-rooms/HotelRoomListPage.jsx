import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import HotelRoomPage from "../../features/Hotel-rooms/HotelRoomPage"

function HotelRoomListPage(){
    return(
        <AdminLayout>
            <HotelRoomPage/>
        </AdminLayout>
    )

}

export default HotelRoomListPage;