import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'react-router-dom';
import { getDetail, getList, createMomoPayment } from "../../api/user_api";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed z-[9999] inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl max-w-full w-[96vw] md:w-[560px] p-0 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-gray-200"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

function PaymentStatusModal({ status, open, onClose, amount }) {
  const statusInfo = {
    success: {
      title: "Thanh toán thành công",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      message: "Cảm ơn bạn đã thanh toán. Chúng tôi đã ghi nhận thanh toán của bạn và đã gửi email xác nhận đến địa chỉ email của bạn.",
      buttonText: "Xem chi tiết đặt tour",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    failed: {
      title: "Thanh toán thất bại",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      message: "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.",
      buttonText: "Thử lại",
      buttonColor: "bg-red-500 hover:bg-red-600"
    }
  };

  const info = statusInfo[status] || statusInfo.failed;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-8 flex flex-col items-center text-center">
        {info.icon}
        <h2 className="text-2xl font-bold mb-4">{info.title}</h2>
        <p className="text-gray-600 mb-6">{info.message}</p>
        {amount && (
          <div className="bg-gray-50 w-full max-w-md rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Số tiền thanh toán:</span>
              <span className="font-bold">{formatPrice(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức:</span>
              <span>Ví MoMo</span>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className={`px-6 py-3 text-white font-medium rounded-lg ${info.buttonColor} transition-colors`}
        >
          {info.buttonText}
        </button>
      </div>
    </Modal>
  );
}

const TourDetail = () => {
  const { slug } = useParams();
  const [peopleCount, setPeopleCount] = useState(1);
  const [loginModal, setLoginModal] = useState(false);
  const [paymentStatusModal, setPaymentStatusModal] = useState({ open: false, status: '', amount: null });
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: tour = {},
    isLoading: isLoadingTour,
    error: tourError,
  } = useQuery({
    queryKey: ['tour', slug],
    queryFn: () => getDetail('tours', slug),
    enabled: !!slug,
  });

  const {
    data: tourDestinations = [],
    isLoading: isLoadingDest,
    error: destError,
  } = useQuery({
    queryKey: ['tourDestinations', slug],
    queryFn: () => getList(`tours/${slug}/tour-destination`),
    enabled: !!slug,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('payment');
    const bookingId = queryParams.get('booking_id');

    if (paymentStatus) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      const depositAmount = tour.price * peopleCount * 0.3;
        setPaymentStatusModal({
        open: true,
        status: paymentStatus,
        amount: depositAmount,
        bookingId: bookingId
      });
    }
  }, [location, tour.price, peopleCount]);

  const handleBookTour = async () => {
    if (!isAuthenticated) {
      setLoginModal(true);
      return;
    }

    try {
      const deposit = tour.price * peopleCount * 0.3;
      const data = await createMomoPayment(deposit, tour.id, peopleCount);
      if (data.payUrl) {
        window.open(data.payUrl, "_self");
      } else {
        alert("Không lấy được link thanh toán");
      }
    } catch (e) {
      console.error("Payment error:", e);
      alert("Lỗi kết nối payment");
    }
  };

  const gotoLogin = () => {
    setLoginModal(false);
    navigate('/login');
  };

  const handleClosePaymentModal = () => {
    setPaymentStatusModal({ open: false, status: '', amount: null });
  };

  if (isLoadingTour || isLoadingDest)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-blue-500 font-semibold">Đang tải dữ liệu tour...</div>
      </div>
    );

  if (tourError || destError)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">
          {tourError?.message || destError?.message || "Có lỗi xảy ra khi tải dữ liệu!"}
        </div>
      </div>
    );

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const description = tour.description || "";

  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 min-h-screen">
      <div className="relative h-[40vh] overflow-hidden rounded-b-2xl shadow-lg">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            <div
              className="w-full h-full bg-cover bg-center object-cover"
              style={{ backgroundImage: `url(${tour.image})` }}
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 z-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-xl text-center"
          >
            {tour.name}
          </motion.h1>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-7 flex flex-wrap justify-center items-center gap-6 text-lg md:text-xl font-medium"
          >
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{tour.duration} ngày</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{tour.min_people}-{tour.max_people} người</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatPrice(tour.price)}</span>
            </div>
          </motion.div>
        </div>
      </div>
      <Modal open={loginModal} onClose={() => setLoginModal(false)}>
        <div className="p-6 flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Đăng nhập để tiếp tục</h3>
          <p className="text-gray-600 text-center mb-6">Bạn cần đăng nhập để đặt tour này.</p>
          <button
            onClick={gotoLogin}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg hover:from-blue-600 hover:to-teal-500 transition">
            Đăng nhập ngay
          </button>
        </div>
      </Modal>

      <PaymentStatusModal 
        status={paymentStatusModal.status} 
        open={paymentStatusModal.open} 
        onClose={handleClosePaymentModal} 
        amount={paymentStatusModal.amount}
      />

      <div className="container max-w-7xl mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Giới thiệu về tour</h2>
                <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-10 bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Lịch trình chi tiết</h2>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-[39px] w-1 bg-gradient-to-b from-blue-500 to-teal-400 rounded-full"></div>
                  {tourDestinations.map((dest, index) => (
                    <div key={dest.id} className="relative mb-16 last:mb-0">
                      <div className="absolute top-0 left-[30px] w-[20px] h-[20px] bg-white border-4 border-blue-500 rounded-full transform translate-y-1"></div>
                      <div className="ml-20">
                        <div className="inline-block py-1 px-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white text-sm font-medium mb-2">
                          Điểm dừng {index + 1} • {dest.start_time} - {dest.end_time}
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="w-full md:w-1/3 h-48 overflow-hidden rounded-lg">
                              <img
                                src={`http://localhost:8000${dest.image_destination}`}
                                alt={dest.image_destination}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                            <div className="flex-1 max-w-lg bg-white rounded-xl">
                              <h3 className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                                <div className="flex items-center gap-2 mb-4">
                                  <span className="inline-block w-2 h-6 bg-blue-500 rounded-r"></span>
                                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                                    {dest.type_destination}
                                  </span>
                                </div>
                                {dest.destination.name}
                              </h3>
                              <div className="flex items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-lg text-gray-700 font-medium">{dest.name_destination}</span>
                              </div>
                              {dest.note && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg flex items-start gap-3 mt-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-yellow-800">{dest.note}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-18"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Đặt tour ngay</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Số người</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
                        onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        className="flex-1 p-2 text-center focus:outline-none"
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(Math.min(tour.max_people, Math.max(1, parseInt(e.target.value) || 1)))}
                        min={1}
                        max={tour.max_people}
                      />
                      <button
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
                        onClick={() => setPeopleCount(Math.min(tour.max_people, peopleCount + 1))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Giá gốc × {peopleCount} người</span>
                      <span className="text-gray-900">{formatPrice(tour.price * peopleCount)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Thuế và phí</span>
                      <span className="text-gray-900">{formatPrice(tour.price * peopleCount * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base mt-4">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{formatPrice(tour.price * peopleCount * 1.1)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleBookTour}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg hover:from-blue-600 hover:to-teal-500 transition transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    Đặt tour ngay
                  </button>
                  <p className="text-center text-gray-500 text-sm mt-2">
                    Chỉ cần đặt cọc {formatPrice(tour.price * 0.3)} để giữ chỗ
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Miễn phí hủy trước 7 ngày</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Bao gồm bữa ăn và phương tiện di chuyển</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Hướng dẫn viên chuyên nghiệp</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-12">Câu hỏi thường gặp</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Tôi nên mang theo những gì cho chuyến đi?",
                a: "Bạn nên mang theo: quần áo thoải mái, đồ bơi, kem chống nắng, mũ, kính râm, thuốc chống say tàu xe (nếu cần), máy ảnh, sạc dự phòng và một ít tiền mặt cho các chi tiêu cá nhân."
              },
              {
                q: "Chuyến đi có phù hợp với người cao tuổi không?",
                a: "Chuyến đi có thể điều chỉnh phù hợp với người cao tuổi. Tuy nhiên, một số hoạt động như leo núi, chèo thuyền kayak có thể yêu cầu sức khỏe tốt. Vui lòng thông báo trước nếu có người cao tuổi tham gia để chúng tôi sắp xếp lịch trình phù hợp."
              },
              {
                q: "Tôi có thể hủy tour và được hoàn tiền không?",
                a: "Bạn có thể hủy tour và được hoàn tiền 100% nếu hủy trước 7 ngày. Hủy từ 3-7 ngày trước chuyến đi, bạn sẽ được hoàn 50% tổng giá trị tour. Hủy dưới 3 ngày, rất tiếc chúng tôi không thể hoàn tiền."
              },
              {
                q: "Có wifi tại khách sạn và trên tàu không?",
                a: "Khách sạn có wifi miễn phí. Trên tàu tham quan cũng có wifi nhưng tín hiệu có thể không ổn định khi ở những khu vực xa bờ hoặc trong hang động. Chúng tôi khuyến khích bạn tận hưởng khung cảnh thiên nhiên và tạm gác lại các thiết bị điện tử trong chuyến đi."
              }
            ].map((item, idx) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                    <span>{item.q}</span>
                    <span className="transition group-open:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700">
                    <p>{item.a}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button className="bg-gradient-to-r from-blue-500 to-teal-400 w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-teal-500 transition-all duration-300 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default TourDetail;