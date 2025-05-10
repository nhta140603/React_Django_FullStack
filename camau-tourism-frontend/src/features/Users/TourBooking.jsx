import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaCalendarAlt, FaMoneyBillWave, FaEllipsisH, FaFileInvoice, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const TourBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      const data = await getTourBookings();
      setBookings(data);
      setIsLoading(false);
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    await cancelBooking(bookingId);
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? {...booking, status: 'canceled'} : booking
    ));
    setShowModal(false);
  };

  const handlePayment = async (bookingId, amount) => {
    await makePayment(bookingId, amount);
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? {...booking, paid_amount: booking.total_amount} : booking
    ));
    setShowModal(false);
  };

  const openModal = (type, booking) => {
    setModalType(type);
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Phân loại đơn tour theo trạng thái
  const upcomingBookings = bookings.filter(booking => booking.status === 'confirmed' && new Date(booking.booking_date) > new Date());
  const ongoingBookings = bookings.filter(booking => booking.status === 'in_progress');
  const completedBookings = bookings.filter(booking => booking.status === 'completed');
  const canceledBookings = bookings.filter(booking => booking.status === 'canceled');

  if (isLoading) return <div className="flex justify-center items-center h-full">Đang tải...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn tour</h1>

      <Tabs>
        <TabList className="flex mb-6 border-b">
          <Tab className="px-4 py-2 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-all">
            Sắp tới ({upcomingBookings.length})
          </Tab>
          <Tab className="px-4 py-2 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-all">
            Đang đi ({ongoingBookings.length})
          </Tab>
          <Tab className="px-4 py-2 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-all">
            Đã hoàn thành ({completedBookings.length})
          </Tab>
          <Tab className="px-4 py-2 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-all">
            Đã hủy ({canceledBookings.length})
          </Tab>
        </TabList>

        <TabPanel>
          <BookingList 
            bookings={upcomingBookings} 
            openModal={openModal} 
            showCancelButton={true}
            showPayButton={true}
          />
        </TabPanel>
        
        <TabPanel>
          <BookingList 
            bookings={ongoingBookings} 
            openModal={openModal} 
            showCancelButton={false}
            showPayButton={false}
          />
        </TabPanel>
        
        <TabPanel>
          <BookingList 
            bookings={completedBookings} 
            openModal={openModal}
            showCancelButton={false}
            showPayButton={false}
          />
        </TabPanel>
        
        <TabPanel>
          <BookingList 
            bookings={canceledBookings} 
            openModal={openModal}
            showCancelButton={false}
            showPayButton={false}
          />
        </TabPanel>
      </Tabs>

      {/* Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            {modalType === 'details' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Chi tiết đơn tour</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Tên tour</p>
                    <p className="font-medium">{selectedBooking.tour.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt</p>
                    <p className="font-medium">{format(new Date(selectedBooking.booking_date), 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số người</p>
                    <p className="font-medium">{selectedBooking.number_of_people}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="font-medium">{selectedBooking.total_amount.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đã thanh toán</p>
                    <p className="font-medium">{selectedBooking.paid_amount.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <p className={`font-medium ${
                      selectedBooking.status === 'confirmed' ? 'text-green-600' : 
                      selectedBooking.status === 'canceled' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {selectedBooking.status === 'confirmed' ? 'Đã xác nhận' : 
                      selectedBooking.status === 'in_progress' ? 'Đang đi' : 
                      selectedBooking.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Lịch trình tour</h3>
                    <div className="h-80 rounded-lg overflow-hidden">
                      <MapContainer center={[16.0544, 108.2022]} zoom={7} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {selectedBooking.tour.destinations && selectedBooking.tour.destinations.map((dest, idx) => (
                          <Marker 
                            key={idx} 
                            position={[dest.latitude, dest.longitude]}
                          >
                            <Popup>
                              <b>{dest.name}</b><br />
                              {dest.description}
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'cancel' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Xác nhận hủy tour</h2>
                <p className="text-gray-600 mb-4">Bạn có chắc chắn muốn hủy đơn tour "{selectedBooking.tour.name}" không?</p>
                <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg mb-4">
                  Lưu ý: Việc hủy tour có thể phải chịu phí hủy theo chính sách của đơn vị cung cấp tour.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Không hủy
                  </button>
                  <button 
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'payment' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Thanh toán đơn tour</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Tên tour</p>
                    <p className="font-medium">{selectedBooking.tour.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="font-medium">{selectedBooking.total_amount.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đã thanh toán</p>
                    <p className="font-medium">{selectedBooking.paid_amount.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số tiền cần thanh toán</p>
                    <p className="font-bold text-xl text-blue-600">
                      {(selectedBooking.total_amount - selectedBooking.paid_amount).toLocaleString()}đ
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border p-3 rounded-lg text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition">
                      <img src="/visa.png" alt="Visa" className="h-6 mx-auto mb-2" />
                      <p className="text-sm">Visa/Master</p>
                    </div>
                    <div className="border p-3 rounded-lg text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition">
                      <img src="/momo.png" alt="Momo" className="h-6 mx-auto mb-2" />
                      <p className="text-sm">Momo</p>
                    </div>
                    <div className="border p-3 rounded-lg text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition">
                      <img src="/bank.png" alt="Bank" className="h-6 mx-auto mb-2" />
                      <p className="text-sm">Chuyển khoản</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => handlePayment(selectedBooking.id, selectedBooking.total_amount - selectedBooking.paid_amount)}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Thanh toán ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Component hiển thị danh sách đơn tour
const BookingList = ({ bookings, openModal, showCancelButton, showPayButton }) => {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-xl">
        <img src="/empty-list.svg" alt="Không có đơn tour" className="w-40 mb-4" />
        <p className="text-gray-600">Không có đơn tour nào</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map(booking => (
        <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
          <div className="h-40 bg-gray-200 relative">
            <img 
              src={booking.tour.image || "https://via.placeholder.com/400x200"} 
              alt={booking.tour.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                booking.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                booking.status === 'completed' ? 'bg-gray-100 text-gray-700' : 
                'bg-red-100 text-red-700'
              }`}>
                {booking.status === 'confirmed' ? 'Đã xác nhận' : 
                booking.status === 'in_progress' ? 'Đang đi' : 
                booking.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 truncate">{booking.tour.name}</h3>
            
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FaCalendarAlt />
              <span className="text-sm">{format(new Date(booking.booking_date), 'dd/MM/yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <FaMoneyBillWave />
              <span className="text-sm">{booking.total_amount.toLocaleString()}đ</span>
              {booking.paid_amount < booking.total_amount && (
                <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full ml-auto">
                  Chưa thanh toán đủ
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => openModal('details', booking)}
                className="py-2 px-4 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                Chi tiết
              </button>
              
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <FaEllipsisH />
                </button>
                
                <div className="absolute right-0 bottom-full mb-2 bg-white shadow-lg rounded-lg overflow-hidden invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-10 w-48">
                  <div className="py-1">
                    <button
                      onClick={() => openModal('details', booking)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaMapMarkedAlt className="text-blue-500" />
                      <span>Xem lịch trình</span>
                    </button>
                    
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaFileInvoice className="text-green-500" />
                      <span>Tải hóa đơn</span>
                    </button>
                    
                    {showPayButton && booking.paid_amount < booking.total_amount && (
                      <button
                        onClick={() => openModal('payment', booking)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaMoneyBillWave className="text-yellow-500" />
                        <span>Thanh toán</span>
                      </button>
                    )}
                    
                    {showCancelButton && (
                      <button
                        onClick={() => openModal('cancel', booking)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaTimesCircle className="text-red-500" />
                        <span>Hủy tour</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TourBookings;