import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Tours from '../pages/Tours';
import Destinations from '../pages/Destinations';
import Hotels from '../pages/Hotels';
import Login from '../pages/LoginPage';
import Register from '../pages/RegisterPage';
import PersonalTrip from '../pages/PersonalTrips';
import UserInfo from '../pages/User-profile';
import UserTours from '../pages/User-tours'
import UserBookingHotel from '../pages/User-booking';
import ProfileLayout from '../layouts/ProfileLayout'
import DestinationDetailPage from '../pages/DestinationDetailPage';
import ArticlesDetailPage from '../pages/ArticlesDetailPage';
import Event from '../pages/Festivals'
import FestivalDetailPage from '../pages/FestivalDetailPage'
import CuisineListPage from '../pages/CuisinePage';
import CuisineDetailPage from '../pages/CuisineDetailPage';
import TourDetailPage from "../pages/TourDetailPage"
import ArticlesPage from '../pages/ArticlesPage';
import PublicRoute from '../routes/PublicRoute'
import ProtectedRoute from '../routes/ProtectedRoute'
import HotelDetail from '../pages/HotelDetail';
import NotFound from '../pages/404NotFound';
import NotificationsPage from '../pages/User-notification';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/danh-sach-chuyen-du-lich" element={<Tours />} />
          <Route path="/chuyen-du-lich/:slug" element={<TourDetailPage />} />

          <Route path="/danh-sach-dia-diem" element={<Destinations />} />
          <Route path="/dia-diem/:slug" element={<DestinationDetailPage />} />

          <Route path="/danh-sach-le-hoi" element={<Event />} />
          <Route path="/tin-tuc-su-kien" element={<ArticlesPage />} />
          <Route path="/le-hoi/:slug" element={<FestivalDetailPage />} />
          <Route path="/khach-san/:slug" element={<HotelDetail />} />
          <Route path="/tim-khach-san" element={<Hotels />} />

          <Route path="/am-thuc" element={<CuisineListPage />} />
          <Route path="/am-thuc/:slug" element={<CuisineDetailPage />} />

          <Route path="/su-kien/:slug" element={<ArticlesDetailPage />} />
          <Route path="/tin-tuc/:slug" element={<ArticlesDetailPage />} />
          <Route path="/personaltrip" element={<PersonalTrip />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<ProfileLayout />}>
              <Route path="trang-ca-nhan" element={<UserInfo />} />
              <Route path="cac-chuyen-di" element={<UserTours />} />
              <Route path="cac-don-dat-phong" element={<UserBookingHotel />} />
              <Route path='tat-ca-thong-bao' element={<NotificationsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default AppRoutes;