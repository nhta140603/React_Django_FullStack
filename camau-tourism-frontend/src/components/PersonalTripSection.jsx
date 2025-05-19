import React from 'react';
import { Link } from 'react-router-dom';
import { MotionItem } from '../components/MotionItem';

function PersonalTripSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-50 opacity-50 -skew-y-6 transform origin-top-right"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <MotionItem direction="left" x={30}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block p-2 bg-blue-100 rounded-full mb-4 md:mb-6">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-blue-900 mb-4 md:mb-6">Tạo Hành Trình Cá Nhân Của Bạn</h2>
            <p className="md:text-base text-sm text-gray-600 mb-6 md:mb-8">
              Không bị ràng buộc bởi lịch trình có sẵn? Hãy tự do lựa chọn điểm đến, thời gian và dịch vụ phù hợp với nhu cầu riêng của bạn.
            </p>
            <Link 
              to="/tao-hanh-trinh" 
              className="relative inline-flex group"
            >
              <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-4 py-2 md:px-8 md:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/30 text-sm md:text-base">
                Bắt đầu lên kế hoạch
              </button>
            </Link>
          </div>
        </MotionItem>
      </div>
    </section>
  );
}

export default PersonalTripSection;