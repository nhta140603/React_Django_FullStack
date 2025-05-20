import React from "react";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaTransgender,
  FaBirthdayCake, FaUserShield
} from "react-icons/fa";
import InfoCard from '../Users/InfoCards';

export default function UserInfoCards({ userData }) {
  function displayValue(value) {
    return value ? value : "Chưa có";
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 sm:mt-4">
      <div className="col-span-1">
        <InfoCard icon={<FaEnvelope className="text-blue-500" />} label="Email" value={displayValue(userData.email)} />
      </div>
      <div className="col-span-1">
        <InfoCard icon={<FaPhone className="text-green-500" />} label="Số điện thoại" value={displayValue(userData.phone)} />
      </div>
      <div className="col-span-1">
        <InfoCard icon={<FaTransgender className="text-pink-500" />} label="Giới tính" value={displayValue(userData.gender)} />
      </div>
      <div className="col-span-1">
        <InfoCard icon={<FaBirthdayCake className="text-orange-400" />} label="Ngày sinh" value={displayValue(userData.date_of_birth)} />
      </div>
      <div className="col-span-2">
        <InfoCard icon={<FaUserShield className="text-gray-600" />} label="Người liên hệ khẩn cấp" value={displayValue(userData.emergency_contact)} />
      </div>
      <div className="col-span-2">
        <InfoCard icon={<FaMapMarkerAlt className="text-red-500" />} label="Địa chỉ" value={displayValue(userData.address)} />
      </div>
    </div>
  );
}