import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaFilter, FaCalendarAlt, FaHotel, FaNewspaper, FaSearch, FaCheckDouble, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../../api/user_api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [groupedNotifications, setGroupedNotifications] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Group notifications by date
    const grouped = notifications.reduce((acc, notification) => {
      const date = new Date(notification.sent_at).toLocaleDateString('vi-VN', { 
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(notification);
      return acc;
    }, {});
    
    setGroupedNotifications(grouped);
    
    // Count unread notifications
    const unread = notifications.filter(n => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error('Không thể tải thông báo, vui lòng thử lại sau.');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications => 
        notifications.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      toast.success('Đã đánh dấu thông báo là đã đọc');
    } catch (error) {
      toast.error('Không thể đánh dấu thông báo, vui lòng thử lại.');
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications => 
        notifications.map(n => ({ ...n, is_read: true }))
      );
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (error) {
      toast.error('Không thể đánh dấu tất cả thông báo, vui lòng thử lại.');
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications => 
        notifications.filter(n => n.id !== id)
      );
      setSelectedNotifications(selectedNotifications => 
        selectedNotifications.filter(notificationId => notificationId !== id)
      );
      toast.success('Đã xóa thông báo thành công');
    } catch (error) {
      toast.error('Không thể xóa thông báo, vui lòng thử lại.');
      console.error('Error deleting notification:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Assuming your API supports batch deletion
      await Promise.all(selectedNotifications.map(id => deleteNotification(id)));
      setNotifications(notifications => 
        notifications.filter(n => !selectedNotifications.includes(n.id))
      );
      setSelectedNotifications([]);
      toast.success('Đã xóa các thông báo đã chọn');
    } catch (error) {
      toast.error('Không thể xóa thông báo, vui lòng thử lại.');
      console.error('Error deleting notifications:', error);
    }
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev => {
      if (prev.includes(id)) {
        return prev.filter(notificationId => notificationId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'promotion':
        return <span className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-500 text-lg">%</span>;
      case 'event':
        return <span className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-500"><FaCalendarAlt className="w-5 h-5" /></span>;
      case 'booking':
        return <span className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-500"><FaHotel className="w-5 h-5" /></span>;
      case 'info':
      default:
        return <span className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-500"><FaNewspaper className="w-5 h-5" /></span>;
    }
  };

  // Filter notifications based on type and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReadStatus = filterType === 'unread' ? !notification.is_read : true;
    
    return matchesType && matchesSearch && matchesReadStatus;
  });

  return (
    <div className="flex-1 p-2 bg-[#f5f7fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaBell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số thông báo</p>
                <p className="text-xl font-bold">{notifications.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-4 rounded-full">
                <FaBell className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chưa đọc</p>
                <p className="text-xl font-bold">{unreadCount}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-4 rounded-full">
                <FaCheckDouble className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã đọc</p>
                <p className="text-xl font-bold">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative inline-block text-left">
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="promotion">Khuyến mãi</option>
                  <option value="event">Sự kiện</option>
                  <option value="booking">Đặt chỗ</option>
                  <option value="info">Thông tin</option>
                  <option value="unread">Chưa đọc</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FaFilter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${unreadCount === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <FaCheckDouble className="mr-2" /> Đánh dấu tất cả đã đọc
              </button>
              
              {selectedNotifications.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaTrash className="mr-2" /> Xóa ({selectedNotifications.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Đang tải thông báo...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center">
            <div className="bg-blue-100 p-5 rounded-full mb-4">
              <FaBell className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Không có thông báo nào</h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchTerm || filterType !== 'all' 
                ? 'Không tìm thấy thông báo phù hợp với bộ lọc hiện tại.' 
                : 'Bạn sẽ nhận được thông báo khi có ưu đãi mới hoặc cập nhật từ du lịch Cà Mau.'}
            </p>
            {(searchTerm || filterType !== 'all') && (
              <button
                onClick={() => {setSearchTerm(''); setFilterType('all');}}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedNotifications)
              .filter(([_, dateNotifications]) => dateNotifications.some(notification => 
                (filterType === 'all' || notification.type === filterType || 
                 (filterType === 'unread' && !notification.is_read)) && 
                (notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 notification.content.toLowerCase().includes(searchTerm.toLowerCase()))
              ))
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([date, dateNotifications]) => {
                const filteredDateNotifications = dateNotifications.filter(notification => 
                  (filterType === 'all' || notification.type === filterType || 
                   (filterType === 'unread' && !notification.is_read)) && 
                  (notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   notification.content.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                
                if (filteredDateNotifications.length === 0) return null;
                
                return (
                  <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">{date}</h2>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                            checked={filteredDateNotifications.every(n => selectedNotifications.includes(n.id))}
                            onChange={() => filteredDateNotifications.forEach(n => toggleSelectNotification(n.id))}
                          />
                          <span className="text-sm text-gray-500">
                            {filteredDateNotifications.length} thông báo
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {filteredDateNotifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={classNames(
                            "px-6 py-4 flex items-start gap-4 hover:bg-blue-50/50 transition-colors cursor-pointer relative group",
                            !notification.is_read ? "bg-blue-50/80" : ""
                          )}
                        >
                          <div className="flex-shrink-0 pt-1">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={selectedNotifications.includes(notification.id)}
                              onChange={() => toggleSelectNotification(notification.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div 
                            className="flex-1 min-w-0"
                            onClick={() => handleNotificationClick(notification.id)}
                          >
                            <div className="flex justify-between">
                              <h3 className={classNames(
                                "text-base text-gray-900 break-words pr-10",
                                !notification.is_read ? "font-bold" : "font-medium"
                              )}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {new Date(notification.sent_at).toLocaleTimeString('vi-VN', { 
                                  timeZone: 'Asia/Ho_Chi_Minh',
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1 break-words">
                              {notification.content}
                            </p>
                            
                            {notification.link && (
                              <Link 
                                to={notification.link}
                                className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Xem chi tiết
                              </Link>
                            )}
                            
                            {!notification.is_read && (
                              <span className="absolute top-4 right-6 w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          
                          <button 
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-2 text-gray-400 hover:text-red-500"
                            onClick={() => handleDeleteNotification(notification.id)}
                            title="Xóa thông báo"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;