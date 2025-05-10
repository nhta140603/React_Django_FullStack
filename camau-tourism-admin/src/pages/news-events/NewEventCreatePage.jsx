import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import EventNewCreate  from "../../features/News-Events/EventNewCreate";

function EventNewCreatePage(){
    return(
        <AdminLayout>
            <EventNewCreate/>
        </AdminLayout>
    )
}

export default EventNewCreatePage;
