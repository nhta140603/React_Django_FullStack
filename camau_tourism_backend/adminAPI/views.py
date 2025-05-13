from rest_framework import permissions,generics, viewsets
from api.models import *
from .serializers import *
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class TourViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tour.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = TourSerializer
    parser_classes = [MultiPartParser, FormParser]

class CuisineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Cuisine.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = CuisineSerializer
    parser_classes = [MultiPartParser, FormParser]

class VehicalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class DestinationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Destination.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = DestinationSerializer
    parser_classes = [MultiPartParser, FormParser]

class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]   
    queryset = Client.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = ClientSerializer

class TourGuideViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = TourGuide.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = TourGuideSerializer

class HotelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Hotel.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = HotelSerializer
    parser_classes = [MultiPartParser, FormParser]
    
class HotelAmenityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = HotelAmenity.objects.all()
    serializer_class = HotelAmenitySerializer
    pagination_class = StandardResultsSetPagination
    @action(detail=False, methods=['post'], url_path='bulk-create')
    def bulk_create(self, request):
        items = request.data.get('items', [])
        serializer = self.get_serializer(data=items, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_bulk_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_bulk_create(self, serializer):
        HotelAmenity.objects.bulk_create([
            HotelAmenity(**item) for item in serializer.validated_data
        ])

class HotelRoomViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = HotelRoom.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = HotelRoomSerializer
    parser_classes = [MultiPartParser, FormParser]

class TourBookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = TourBooking.objects.all()
    serializer_class = TourBookingSerializer
    pagination_class = StandardResultsSetPagination

class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class RoomBookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = RoomBooking.objects.all()
    serializer_class = RoomBookingSerializer
    pagination_class = StandardResultsSetPagination

class TransportationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Transportation.objects.all()
    serializer_class = TransportationSerializer

class VehicleRentalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = VehicleRental.objects.all()
    serializer_class = VehicleRentalSerializer

class PersonalTripViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = PersonalTrip.objects.all()
    serializer_class = PersonalTripSerializer

class FestivalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Festival.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = FestivalSerializer
    parser_classes = [MultiPartParser, FormParser]

class ArticlesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Article.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = ArticlesSerializer
    parser_classes = [MultiPartParser, FormParser]

class PromotionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

class BlogViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class MediaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

class SupportTicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class FAQViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    
class TourDestinationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = TourDestinationSerializer
    queryset = TourDestination.objects.all()
    def get_queryset(self):
        tour_id = self.kwargs.get('tour_id')
        if tour_id:
            return TourDestination.objects.filter(tour_id=tour_id)
        return TourDestination.objects.all()

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = UserStatusSerializer
    queryset = User.objects.all()

class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

class PersonalTourGuideBookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = PersonalTourGuideBooking.objects.all()
    serializer_class = PersonalTourGuideBookingSerializer

class UserLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token = RefreshToken.for_user(user)
        response = Response({"id": user.id, "username": user.username}, status=200)
        response.set_cookie(
            key='accessToken',
            value= str(token.access_token),
            httponly=True,
            secure=True,
            samesite="Lax",
        )
        response.set_cookie(
            key='refreshToken',
            value= str(token),
            httponly=True,
            secure=True,
            samesite="Lax",
        )
        return response