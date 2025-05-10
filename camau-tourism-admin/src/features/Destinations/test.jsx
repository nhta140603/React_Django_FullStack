import React, { useEffect, useState } from "react";
import {
  FaPlus, FaTrashAlt, FaClock, FaMapMarkerAlt,
  FaStickyNote, FaCalendarAlt, FaUsers, FaUserTie, FaEdit
} from "react-icons/fa";
import clsx from "clsx";
import { createItem, getList } from "../../api/api_generics";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Autosuggest from 'react-autosuggest';

export default function TourSchedulePage() {
  const [step, setStep] = useState(1);
  const [activeDay, setActiveDay] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [tour, setTour] = useState({});
  const [tourForm, setTourForm] = useState({
    image: "",
    imageFile: null,
    name: "",
    description: "",
    price: "",
    duration: "",
    max_people: "",
    min_people: ""
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editDest, setEditDest] = useState(null);
  const [destination, setDetination] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newDest, setNewDest] = useState({
    destination: "", start_time: "", end_time: "", note: "",
  });

  const [destQuery, setDestQuery] = useState("");
  const [destSuggestions, setDestSuggestions] = useState([]);

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (
      !tourForm.name ||
      !tourForm.duration ||
      !tourForm.price ||
      !tourForm.min_people ||
      !tourForm.max_people
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin tour!");
      return;
    }
    if (Number(tourForm.min_people) > Number(tourForm.max_people)) {
      toast.error('Số khách tối thiểu phải nhỏ hơn số khách tối đa');
      return;
    }
    if (Number(tourForm.duration) < 1) {
      toast.error('Số ngày phải lớn hơn 0');
      return;
    }
    if (Number(tourForm.price) < 0) {
      toast.error('Giá phải lớn hơn 0');
      return;
    }
    setTour({ ...tourForm, duration: Number(tourForm.duration) });
    setSchedules(Array(Number(tourForm.duration)).fill().map(() => []));
    setStep(2);
    setActiveDay(1);
    toast.info("Chuyển sang bước nhập lịch trình!");
  };

  const days = [];
  for (let i = 1; i <= (tour.duration || 0); i++) days.push(i);

  const handleSaveDestinationTour = () => {
    let destInfo = destination.find(d => String(d.value) === newDest.destination);
    if (!destInfo) return toast.warning("Vui lòng chọn địa điểm!");
    if (!newDest.start_time || !newDest.end_time) return toast.warning("Nhập thời gian!");
    if (newDest.start_time >= newDest.end_time) {
      return toast.error('Giờ bắt đầu phải trước giờ kết thúc');
    }
    const overlap = schedules[activeDay - 1].some(item =>
      (newDest.start_time < item.end_time && newDest.end_time > item.start_time)
    );
    if (overlap) {
      return toast.warning('Thời gian bị trùng với địa điểm khác trong ngày');
    }
    const dataDestination = {
      destination: { id: destInfo.value, name: destInfo.label, image_url: destInfo.image },
      start_time: newDest.start_time,
      end_time: newDest.end_time,
      note: newDest.note,
      order_in_day: schedules[activeDay - 1].length + 1
    };
    const newSchedules = schedules.map(day => [...day]);
    newSchedules[activeDay - 1].push(dataDestination);
    setSchedules(newSchedules);
    setNewDest({ destination: "", start_time: "", end_time: "", note: "" });
    setShowAdd(false);
    toast.success("Đã thêm địa điểm vào lịch trình!");
  };

  async function fetchDestinations() {
    const data = await getList('destinations');
    setDetination(data.map(destination => ({
      value: destination.id,
      label: destination.name,
      image: destination.image_url
    })));
  }
  useEffect(() => { fetchDestinations(); }, []);

  const handleRemoveDestination = (id) => {
    const newArr = schedules.map(arr => [...arr])
    newArr[activeDay - 1].splice(id, 1);
    setSchedules(newArr);
  }

  const handleSaveAll = async () => {
    if (schedules.every(arr => arr.length === 0)) {
      toast.warning('Lịch trình không được để trống');
      return;
    }
    try {
    const formData = new FormData();
    formData.append('name', tourForm.name);
    formData.append('description', tourForm.description);
    formData.append('price', tourForm.price);
    formData.append('duration', tourForm.duration);
    formData.append('max_people', tourForm.max_people);
    formData.append('min_people', tourForm.min_people);
    if (tourForm.imageFile) {
      formData.append('image', tourForm.imageFile);
    }
    const data = await createItem('tours', formData, true);
      let allPromises = [];
      for (let i = 0; i < schedules.length; i++) {
        for (let j = 0; j < schedules[i].length; j++) {
          const item = schedules[i][j];
          allPromises.push(createItem('tour-destination', {
            tour: data.id,
            destination: item.destination.id,
            start_time: item.start_time,
            end_time: item.end_time,
            note: item.note,
            day: i + 1,
            order_in_day: j + 1
          }));
        }
      }
      await Promise.all(allPromises);
      toast.success("Đã lưu tour và lịch trình thành công!");
      setStep(1);
      setTourForm({
        name: "", description: "", price: "", duration: "", max_people: "", min_people: ""
      });
      setSchedules([]);
      setTour({});
    } catch (error) {
      toast.error("Có lỗi khi lưu tour: " + error.message);
    }
  };
  function handleSaveEditDestination() {
    if (!editDest.destination) return toast.warning("Vui lòng chọn địa điểm!");
    if (!editDest.start_time || !editDest.end_time) return toast.warning("Nhập thời gian!");
    if (editDest.start_time >= editDest.end_time)
      return toast.warning('Giờ bắt đầu phải trước giờ kết thúc');

    const overlap = schedules[activeDay - 1].some((item, idx) =>
      idx !== editIdx &&
      (editDest.start_time < item.end_time && editDest.end_time > item.start_time)
    );
    if (overlap) return toast.warning('Thời gian bị trùng với địa điểm khác trong ngày');

    const destInfo = destination.find(d => String(d.value) === editDest.destination);
    if (!destInfo) return toast.warning("Vui lòng chọn địa điểm!");

    const data = {
      destination: { id: destInfo.value, name: destInfo.label, image_url: destInfo.image },
      start_time: editDest.start_time,
      end_time: editDest.end_time,
      note: editDest.note,
      order_in_day: editIdx + 1
    };

    const newArr = schedules.map(day => [...day]);
    newArr[activeDay - 1][editIdx] = data;
    setSchedules(newArr);
    setEditIdx(null);
    setEditDest(null);
    toast.success("Đã cập nhật địa điểm!");
  }
  function ReviewTour() {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-cyan-700 mb-2 flex items-center gap-3">
            <FaMapMarkerAlt className="text-cyan-400" /> {tour.name}
          </h1>
          <div className="flex flex-wrap gap-3 mb-2">
            <span className="bg-cyan-100 px-4 py-1 rounded-full">{tour.duration} ngày</span>
            <span className="bg-green-100 px-4 py-1 rounded-full">{tour.min_people}–{tour.max_people} khách</span>
            <span className="bg-pink-100 px-4 py-1 rounded-full">Giá: {Number(tour.price).toLocaleString()}đ</span>
          </div>
          <p>{tour.description}</p>
        </div>
        {[...Array(Number(tour.duration) || 0)].map((_, dayIdx) => (
          <div key={dayIdx} className="bg-white rounded-3xl shadow p-6 mb-6 border">
            <h2 className="font-bold text-cyan-800 mb-3">
              <FaCalendarAlt className="inline mb-1 mr-2" /> Ngày {dayIdx + 1}
            </h2>
            <ol className="pl-4">
              {schedules[dayIdx]?.length === 0 ? (
                <li className="italic text-gray-400">Chưa có địa điểm.</li>
              ) : (
                schedules[dayIdx].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 mb-3">
                    <img src={item.destination.image_url} alt="" className="w-10 h-10 rounded-full bg-cyan-200" />
                    <span className="font-semibold">{item.destination.name}</span>
                    <span className="bg-cyan-50 px-3 py-1 rounded-full text-sm"><FaClock className="inline" /> {item.start_time} - {item.end_time}</span>
                    {item.note && <span className="bg-yellow-100 px-2 py-1 rounded-full text-xs">{item.note}</span>}
                  </li>

                ))
              )}
            </ol>
          </div>
        ))}
        <div className="flex gap-3 justify-between">
          <button
            onClick={() => setStep(2)}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-full shadow hover:bg-gray-300 transition"
          >Quay lại</button>
          <button
            onClick={handleSaveAll}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-800 text-white font-bold rounded-full shadow-lg hover:scale-105 transition"
          >Lưu toàn bộ</button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }
  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    if (!inputValue) return [];
    return destination.filter(
      d => d.label.toLowerCase().includes(inputValue)
    );
  };  
  const getSuggestionValue = suggestion => suggestion.label;
  const renderSuggestion = suggestion => (
    <div className="flex gap-2 items-center">
      <img src={suggestion.image} alt="" className="w-6 h-6 rounded-full object-cover" />
      <span>{suggestion.label}</span>
    </div>
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    setDestSuggestions(getSuggestions(value));
  };
  const onSuggestionsClearRequested = () => {
    setDestSuggestions([]);
  };
  const onSuggestionSelected = (event, { suggestion }) => {
    setNewDest(i => ({ ...i, destination: String(suggestion.value) }));
    setDestQuery(suggestion.label);
  };
  const inputProps = {
    placeholder: "Nhập tên địa điểm",
    value: destQuery,
    onChange: (event, { newValue }) => {
      setDestQuery(newValue);
      setNewDest(i => ({ ...i, destination: "" }));
    },
    className: "border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 w-50"
  };

  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center px-2">
        <div className="mb-5 w-full flex justify-center">
          <div className="flex gap-2">
            <span className="w-4 h-4 rounded-full bg-cyan-600"></span>
            <span className="w-4 h-4 rounded-full bg-gray-200"></span>
            <span className="w-4 h-4 rounded-full bg-gray-200"></span>
          </div>
        </div>
        <form onSubmit={handleNextStep1} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 space-y-6">
          <h2 className="text-2xl font-bold text-cyan-700 flex gap-2 items-center mb-3">
            <FaMapMarkerAlt /> Tạo mới Tour
          </h2>
          <div>
  <label className="block font-semibold mb-1">Ảnh đại diện tour</label>
        <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onloadend = () => {
            setTourForm((prev) => ({
              ...prev,
              image: reader.result,  
              imageFile: file         
            }));
          };
          reader.readAsDataURL(file);
        }}
        className="block mb-2"
      />
  {tourForm.image && (
    <div className="mt-2">
      <img
        src={tourForm.image}
        alt="Ảnh tour"
        className="w-40 h-28 object-cover rounded-xl border shadow"
      />
    </div>
  )}
</div>
          <div>
            <label className="block font-semibold">Tên tour</label>
            <input value={tourForm.name} onChange={e => setTourForm({ ...tourForm, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold">Mô tả</label>
            <textarea value={tourForm.description} onChange={e => setTourForm({ ...tourForm, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={2} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold">Giá (VNĐ)</label>
              <input value={tourForm.price} onChange={e => setTourForm({ ...tourForm, price: e.target.value })} type="number" min={0} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="flex-1">
              <label className="block font-semibold">Số ngày</label>
              <input value={tourForm.duration} onChange={e => setTourForm({ ...tourForm, duration: e.target.value })} type="number" min={1} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold">Số khách tối thiểu</label>
              <input value={tourForm.min_people} onChange={e => setTourForm({ ...tourForm, min_people: e.target.value })} type="number" min={1} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="flex-1">
              <label className="block font-semibold">Số khách tối đa</label>
              <input value={tourForm.max_people} onChange={e => setTourForm({ ...tourForm, max_people: e.target.value })} type="number" min={1} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition"
            >
              Tiếp theo
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose="3000"></ToastContainer>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="px-2 py-8 min-h-screen">
        <div className="mb-5 w-full flex justify-center">
          <div className="flex gap-2">
            <span className="w-4 h-4 rounded-full bg-cyan-600"></span>
            <span className="w-4 h-4 rounded-full bg-cyan-600"></span>
            <span className="w-4 h-4 rounded-full bg-gray-200"></span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={clsx(
                  "px-5 py-2 rounded-full font-bold transition-all border-2 shadow flex items-center gap-2",
                  activeDay === day
                    ? "bg-cyan-600 border-cyan-800 text-white scale-105"
                    : "bg-white border-cyan-200 text-cyan-700 hover:bg-cyan-100"
                )}
              >
                <span className="text-lg">Ngày {day}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 rounded-3xl shadow-2xl p-8 border border-cyan-100 relative overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-cyan-700 drop-shadow">
              <FaClock /> Lịch trình ngày {activeDay}
            </h2>
            <div className="absolute top-0 left-7 h-full w-2 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full opacity-40 pointer-events-none" />
            <ol className="relative pl-14 space-y-8">
              {schedules[activeDay - 1].length === 0 ? (
                <li className="text-gray-400 italic">Chưa có địa điểm cho ngày này.</li>
              ) : (
                schedules[activeDay - 1]?.map((item, idx) => (
                  <li key={idx} className="group flex gap-5 items-center relative">
                    <span className="absolute left-[-56px] top-7 bg-white ring-4 ring-cyan-400 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 font-bold text-cyan-600 text-lg">
                      {idx + 1}
                    </span>
                    <div className="flex-1 bg-cyan-50/60 backdrop-blur-xl px-6 py-5 rounded-2xl shadow-md border border-cyan-200 group-hover:border-cyan-400 transition-all flex items-center gap-6 hover:scale-[1.015]">
                      <div className="w-16 h-16 bg-cyan-200 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden">
                        <img src={item.destination.image_url} alt="" className="w-16 h-16 object-cover rounded-full" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-800 text-xl">{item.destination.name}</span>
                          <span className="ml-2 px-3 py-1 text-xs bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-full flex items-center gap-1 shadow">
                            <FaMapMarkerAlt />
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 items-center">
                          <span className="bg-white rounded-full px-3 py-1 shadow border border-cyan-200 text-cyan-600 font-semibold flex gap-2 items-center text-sm">
                            {item.start_time}
                            <FaClock />
                          </span>
                          <span className="bg-yellow-100 rounded-full px-3 py-1 text-yellow-800 border border-yellow-200 flex gap-2 items-center text-sm">
                            {item.end_time}
                            <FaStickyNote />
                          </span>
                        </div>
                        {item.note && (
                          <div className="text-gray-600 italic text-xs mt-1">
                            <FaStickyNote className="inline mr-1" />{item.note}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveDestination(idx)}
                        className="ml-2 p-2 rounded-full bg-red-100 hover:bg-red-300 transition text-red-600"
                        title="Xóa địa điểm này"
                      >
                        <FaTrashAlt />
                      </button>

                      <button
                        onClick={() => {
                          setEditIdx(idx);
                          setEditDest({
                            destination: item.destination.id,
                            start_time: item.start_time,
                            end_time: item.end_time,
                            note: item.note,
                          });
                          setShowAdd(false);
                        }}
                        className="ml-2 p-2 rounded-full bg-yellow-100 hover:bg-yellow-300 transition text-yellow-600"
                        title="Sửa địa điểm này"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ol>
            <div className="mt-10 flex flex-col md:flex-row gap-3 items-center">
              {!showAdd && (
                <button
                  className="tour-add-btn ribbon px-7 py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-cyan-500 hover:to-cyan-700 transition-all flex items-center gap-3 text-lg relative"
                  onClick={() => setShowAdd(true)}
                >
                  <FaPlus className="animate-bounce" /> Thêm địa điểm
                </button>
              )}
            </div>
            {showAdd && (
              <div className="flex flex-col md:flex-row items-end gap-5 bg-cyan-100/80 border border-cyan-300 rounded-2xl p-6 mt-3 shadow-lg">
                <div>
                  <label className="block text-sm font-semibold mb-1">Địa điểm</label>
                  <Autosuggest
                    suggestions={destSuggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={onSuggestionSelected}
                    highlightFirstSuggestion={true}
                    theme={{
                      suggestionsContainer: "absolute z-20 left-0 right-0 bg-white border rounded-lg mt-1 shadow max-h-60 overflow-auto",
                      suggestion: "px-4 py-2 hover:bg-cyan-100 cursor-pointer flex gap-2 items-center",
                      suggestionHighlighted: "bg-cyan-100"
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Bắt đầu</label>
                  <input onChange={e => setNewDest(v => ({ ...v, start_time: e.target.value }))} value={newDest.start_time} type="time" className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Kết thúc</label>
                  <input onChange={e => setNewDest(v => ({ ...v, end_time: e.target.value }))} value={newDest.end_time} type="time" className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Ghi chú</label>
                  <input onChange={e => setNewDest(v => ({ ...v, note: e.target.value }))} value={newDest.note} type="text" className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400" placeholder="Nhập ghi chú" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveDestinationTour}
                    type="button"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-bold shadow hover:from-cyan-500 hover:to-cyan-700 transition-all"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition-all"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
            {editIdx !== null && (
              <div className="flex flex-col md:flex-row items-end gap-5 bg-yellow-50 border border-yellow-300 rounded-2xl p-6 mt-3 shadow-lg">
                <div>
                  <label className="block text-sm font-semibold mb-1">Địa điểm</label>
                  <select value={editDest.destination}
                    onChange={e => setEditDest(i => ({ ...i, destination: e.target.value }))}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400">
                    <option value="">Chọn địa điểm</option>
                    {destination.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Bắt đầu</label>
                  <input onChange={e => setEditDest(v => ({ ...v, start_time: e.target.value }))} value={editDest.start_time} type="time" className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Kết thúc</label>
                  <input onChange={e => setEditDest(v => ({ ...v, end_time: e.target.value }))} value={editDest.end_time} type="time" className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Ghi chú</label>
                  <input onChange={e => setEditDest(v => ({ ...v, note: e.target.value }))} value={editDest.note} type="text" className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400" placeholder="Nhập ghi chú" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEditDestination}
                    type="button"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow hover:from-yellow-500 hover:to-yellow-700 transition-all"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditIdx(null); setEditDest(null); }}
                    className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition-all"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-4 mt-8 justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-full shadow hover:bg-gray-300 transition"
              >Quay lại</button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-800 text-white font-bold rounded-full shadow-lg hover:scale-105 transition"
              >Tiếp theo</button>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  if (step === 3) {
    <ToastContainer position="top-right" autoClose={3000} />
    return <ReviewTour />;
  }
  <ToastContainer position="top-right" autoClose={3000} />
  return null;
}