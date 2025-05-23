from rest_framework import permissions,generics, viewsets
from api.models import *
from .serializers import *
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from cloudinary.uploader import upload as cloudinary_upload

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
    parser_classes = [MultiPartParser, JSONParser, FormParser]

class CuisineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Cuisine.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = CuisineSerializer
    parser_classes = [MultiPartParser, JSONParser, FormParser]

class VehicalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class DestinationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Destination.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = DestinationSerializer
    parser_classes = [MultiPartParser, JSONParser, FormParser]

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
    parser_classes = [MultiPartParser, JSONParser, FormParser]
    
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
    parser_classes = [MultiPartParser, JSONParser, FormParser]

class TourBookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = TourBooking.objects.all()
    serializer_class = TourBookingSerializer
    pagination_class = StandardResultsSetPagination
    def perform_update(self, serializer):
        instance = self.get_object()
        prev_status = instance.status
        validated_data = serializer.validated_data

        new_status = validated_data.get('status', prev_status)
        number_of_people = validated_data.get('number_of_people', instance.number_of_people)
        tour = validated_data.get('tour', instance.tour)
        if prev_status != 'confirmed' and new_status == 'confirmed':
            tour_obj = tour if isinstance(tour, Tour) else Tour.objects.get(pk=tour)
            confirmed_people = get_confirmed_people_count(tour_obj)
            if confirmed_people + number_of_people > tour_obj.max_people:
                raise serializers.ValidationError(
                    {'non_field_errors': [f"Tour đã đủ chỗ. Chỉ còn {max(0, tour_obj.max_people - confirmed_people)} chỗ."]}
                )
        booking = serializer.save()
        if prev_status != new_status:
            send_booking_status_notification(booking.client, booking, new_status)

        return booking
    @action(detail=False, methods=['get'], url_path='pending-count')
    def pending_count(self, request):
        count = self.queryset.filter(status='Paid').count()
        return Response({'count': count})


def get_confirmed_people_count(tour):
    return TourBooking.objects.filter(
        tour=tour,
        status='confirmed'
    ).aggregate(total=models.Sum('number_of_people'))['total'] or 0

def send_booking_status_notification(client, booking, new_status):
    if new_status == "confirmed":
        title = "Đơn đặt tour đã được xác nhận"
        content = f"Đơn đặt tour #{booking.tour.name} đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất."
    elif new_status == "canceled":
        title = "Đơn đặt tour đã bị hủy"
        content = f"Đơn đặt tour #{booking.tour.name} đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ."
    elif new_status == "completed":
        title = "Tour đã hoàn thành"
        content = f"Cảm ơn bạn đã sử dụng dịch vụ. Hy vọng bạn đã có trải nghiệm tốt!"
    else:
        return

    Notification.objects.create(
        client=client,
        title=title,
        content=content,
        type="booking",
        url=f"/my-bookings/{booking.id}/"
    )

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
    def perform_update(self, serializer):
        instance = self.get_object()
        prev_status = instance.status
        validated_data = serializer.validated_data
        new_status = validated_data.get('status', prev_status)
        room = validated_data.get('room', instance.room)
        check_in = validated_data.get('check_in', instance.check_in)
        check_out = validated_data.get('check_out', instance.check_out)
        if prev_status != 'confirmed' and new_status == 'confirmed':
            room_obj = room if isinstance(room, HotelRoom) else HotelRoom.objects.get(pk=room)
            booked_count = get_booked_room_count(room_obj, check_in, check_out)
            if booked_count >= room_obj.quantity:
                raise serializers.ValidationError(
                    {'non_field_errors': [f"Loại phòng này đã hết chỗ."]}
                )
        booking = serializer.save()
        if prev_status != new_status:
            send_room_booking_status_notification(booking.client, booking, new_status)
        return booking
    @action(detail=False, methods=['get'], url_path='pending-count')
    def pending_count(self, request):
        count = self.queryset.filter(status='pending').count()
        return Response({'count': count})


def get_booked_room_count(room, check_in, check_out):
    return RoomBooking.objects.filter(
        room=room,
        status='confirmed',
        check_in__lt=check_out,
        check_out__gt=check_in,
    ).count()


def send_room_booking_status_notification(client, booking, new_status):
    if new_status == "confirmed":
        title = "Đơn đặt phòng đã được xác nhận"
        content = f"Đơn đặt phòng tại khách sạn '{booking.room.hotel.name}' (phòng số {booking.room.room_number}) đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất."
    elif new_status == "canceled":
        title = "Đơn đặt phòng đã bị hủy"
        content = f"Đơn đặt phòng tại khách sạn '{booking.room.hotel.name}' (phòng số {booking.room.room_number}) đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ."
    elif new_status == "completed":
        title = "Cảm ơn bạn đã lưu trú cùng chúng tôi"
        content = (
            f"Cảm ơn bạn đã đặt phòng tại khách sạn '{booking.room.hotel.name}'. "
            "Hy vọng bạn đã có trải nghiệm tốt! Rất mong được phục vụ bạn lần sau."
        )
    else:
        return
    Notification.objects.create(
        client=client,
        title=title,
        content=content,
        type="booking",
        url=f"/my-bookings/{booking.id}/"
    )

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
    parser_classes = [MultiPartParser, JSONParser, FormParser]

class ArticlesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Article.objects.all()
    pagination_class = StandardResultsSetPagination
    serializer_class = ArticlesSerializer
    parser_classes = [MultiPartParser, JSONParser, FormParser]

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
    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        count = self.queryset.filter(is_read=False).count()
        return Response({'count': count})

class FAQViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    
class TourDestinationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = TourDestinationSerializer
    queryset = TourDestination.objects.all()
    parser_classes = [MultiPartParser, JSONParser, FormParser]
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
            httponly=False,
            secure=False,
            samesite="Lax",
        )
        response.set_cookie(
            key='refreshToken',
            value= str(token),
            httponly=False,
            secure=False,
            samesite="Lax",
        )
        return response

class UserLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logged out"}, status=200)
        response.delete_cookie('accessToken', samesite='Lax')
        response.delete_cookie('refreshToken', samesite='Lax')
        return response

class AdminMeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "role": getattr(user, 'role', None),
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        })


class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, JSONParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=400)
        result = cloudinary_upload(
            file_obj,
            folder="article-images",
            eager=[{"width": 1200, "quality": "auto:eco", "crop": "limit"}],
        )
        url = result['eager'][0]['secure_url']
        public_id = result['public_id']
        return Response({'url': url, 'public_id': public_id})