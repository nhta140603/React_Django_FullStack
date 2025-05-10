import React from "react";
import HotelDetailPage from "../features/hotels/HotelDetailPage";
import MainLayout from "../layouts/MainLayout";

export default function HotelDetail() {
  return (
    <MainLayout>
      <div className="r-1ihkh82">
        <div className="mx-auto max-w-7xl">
              <HotelDetailPage/>
        </div>
      </div>
    </MainLayout>
  );
}