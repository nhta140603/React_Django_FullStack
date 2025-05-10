import { FaWifi, FaCar, FaSwimmingPool, FaUtensils, FaDumbbell } from "react-icons/fa";

const ICONS = {
  "fa-wifi": <FaWifi />,
  "fa-car": <FaCar />,
  "fa-swimming-pool": <FaSwimmingPool />,
  "fa-utensils": <FaUtensils />,
  "fa-dumbbell": <FaDumbbell />,
};

export default function AmenitiesSelector({ amenities, value = [], onChange }) {
  const toggleAmenity = (id) => {
    id = Number(id);  
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };
  return (
    <div className="flex flex-wrap gap-1">
      {amenities.map((amenity) => (
        <button
          type="button"
          key={amenity.id}
          onClick={() => toggleAmenity(amenity.id)}
          className={
            `px-2 py-1 text-xs rounded transition border cursor-pointer
            ${value.includes(amenity.id)
              ? 'bg-cyan-600 text-white border-cyan-700'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}
            `
          }
          style={{ minWidth: 0, maxWidth: "100%", whiteSpace: "nowrap" }}
        >
          {amenity.name}
        </button>
      ))}
    </div>
  );
}