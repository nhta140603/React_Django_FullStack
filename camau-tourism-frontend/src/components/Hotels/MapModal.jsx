import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

export default function MapModal({ open, onClose, hotels = [], apiKey = "AIzaSyD_f02_xj7uX2tdIRrj-YAbQHeKKNuW46g" }) {
  const hotelsWithPos = hotels.filter((h) => h.latitude && h.longitude);
  const centerHotel = hotelsWithPos[0];
  const center = centerHotel
    ? { lat: centerHotel.latitude, lng: centerHotel.longitude }
    : { lat: 9.1755247, lng: 105.1047704 };

  const [openPopupId, setOpenPopupId] = useState(null);

  useEffect(() => {
    if (open && hotelsWithPos.length > 0) {
      setOpenPopupId(hotelsWithPos[0].id);
    } else {
      setOpenPopupId(null);
    }
  }, [open, hotelsWithPos]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h4 className="font-semibold text-lg">Bản đồ khách sạn</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        </div>
        <div className="flex-1 relative">
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
            >
              {hotelsWithPos.map((hotel) => (
                <Marker
                  key={hotel.id}
                  position={{ lat: Number(hotel.latitude), lng: Number(hotel.longitude) }}
                  onClick={() => setOpenPopupId(hotel.id)}
                >
                  {openPopupId === hotel.id && (
                    <InfoWindow
                      position={{ lat: Number(hotel.latitude), lng: Number(hotel.longitude) }}
                      onCloseClick={() => setOpenPopupId(null)}
                    >
                      <div>
                        <b>{hotel.name}</b>
                        <br />
                        {hotel.address}
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}