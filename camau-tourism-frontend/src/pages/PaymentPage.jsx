import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe('pk_test_your_publishable_key');

const PaymentPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/bookings/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Không thể tải thông tin đặt tour');
        }
        
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [bookingId]);
  
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thông tin đặt tour</h2>
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tour:</span>
            <span className="font-medium">{booking.tour.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Ngày khởi hành:</span>
            <span className="font-medium">{new Date(booking.booking_date).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Số người:</span>
            <span className="font-medium">{booking.number_of_people}</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tổng tiền:</span>
            <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.total_amount)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Cần thanh toán:</span>
            <span className="font-semibold text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.total_amount * 0.3)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
        
        <Elements stripe={stripePromise}>
          <PaymentForm bookingId={bookingId} amount={booking.total_amount * 0.3} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;