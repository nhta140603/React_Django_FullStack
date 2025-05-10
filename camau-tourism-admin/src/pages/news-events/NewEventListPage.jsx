import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import EventNewPage  from "../../features/News-Events/EventNewPage";

function EventNewListPage(){
    return(
        <AdminLayout>
            <EventNewPage/>
        </AdminLayout>
    )
}

export default EventNewListPage;
