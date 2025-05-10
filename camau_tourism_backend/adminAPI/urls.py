from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from adminAPI.views import *
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'tours', TourViewSet)
router.register(r'destinations', DestinationViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'users', UserViewSet)
router.register(r'tour-guides', TourGuideViewSet)
router.register(r'tour-destination', TourDestinationViewSet)
router.register(r'hotels', HotelViewSet)
router.register(r'hotel-rooms', HotelRoomViewSet)
router.register(r'tour-bookings', TourBookingViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'room-bookings', RoomBookingViewSet)
router.register(r'transportations', TransportationViewSet)
router.register(r'vehicle-rentals', VehicleRentalViewSet)
router.register(r'personal-trips', PersonalTripViewSet)
router.register(r'festivals', FestivalViewSet)
router.register(r'promotions', PromotionViewSet)
router.register(r'blogs', BlogViewSet)
router.register(r'medias', MediaViewSet)
router.register(r'wishlists', WishlistViewSet)
router.register(r'support-tickets', SupportTicketViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'faqs', FAQViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'vehicles', VehicalViewSet)
router.register(r'articles', ArticlesViewSet)
router.register(r'personal-tour-guide-bookings', PersonalTourGuideBookingViewSet)
router.register(r'hotel-amenities', HotelAmenityViewSet)
router.register(r'cuisines', CuisineViewSet)
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('loginAdmin/', UserLoginView.as_view(), name='login-admin'),
    path('', include(router.urls)),
]