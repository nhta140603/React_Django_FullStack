import React from "react";
import AdminLayout from "../../layouts/AdminLayout"
import ReviewList from "../../features/Reviews/ReviewPage";

export default function ReviewPage(){
    return(
        <AdminLayout>
            <ReviewList></ReviewList>
        </AdminLayout>
    )
}