from rest_framework import generics, viewsets, permissions
from .serializers import *
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .models import *
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework.pagination import PageNumberPagination
import os
import json
from django.utils import timezone
from django.shortcuts import redirect
import requests
from rest_framework import status as drf_status
import uuid
import hmac
import hashlib
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db.models import Q, Sum
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class UserLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    def post(self, request, *args, **kwargs):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            token = RefreshToken.for_user(user)
            access_token_lifetime = 15 * 60
            refresh_token_lifetime = 7 * 24 * 60 * 60
            response = Response({"id": user.id, "username": user.username}, status=200)
            response.set_cookie(
                key="accessToken",
                value=str(token.access_token),
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=access_token_lifetime
            )
            response.set_cookie(
                key="refreshToken",
                value=str(token),
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=refresh_token_lifetime
            )
            return response

class TokenRefreshView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        refresh_token = request.COOKIES.get('refreshToken')
        if not refresh_token:
            return Response({'detail': 'Thiếu Refresh Token'}, status=401)
        try:
            token = RefreshToken(refresh_token)
            access_token = token.access_token
            response = Response({'access': str(access_token)}, status=200)
            response.set_cookie(
                key="accessToken",
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=15*60
            )
            return response
        except TokenError:
            return Response({'detail': 'Token không hợp lệ'}, status=401)

class SocialLoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        provider = request.data.get("provider")
        token = request.data.get("token")
        if provider == "google":
            google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
            r = requests.get(google_url)
            if r.status_code != 200:
                return Response({"detail": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)
            data = r.json()
            email = data.get("email")
            name = data.get("name")
        elif provider == "facebook":
            fb_url = f"https://graph.facebook.com/me?fields=id,name,email&access_token={token}"
            r = requests.get(fb_url)
            if r.status_code != 200:
                return Response({"detail": "Invalid Facebook token"}, status=status.HTTP_400_BAD_REQUEST)
            data = r.json()
            email = data.get("email")
            name = data.get("name")
        else:
            return Response({"detail": "Provider không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        if not email:
            return Response({"detail": "Email không tìm thấy trong dữ liệu social"}, status=status.HTTP_400_BAD_REQUEST)
        user, created = User.objects.get_or_create(email=email, defaults={"username": email.split("@")[0], "first_name": name})
        refresh = RefreshToken.for_user(user)
        return Response({
            "id": user.id,
            "username": user.username,
            "accessToken": str(refresh.access_token),
            "refreshToken": str(refresh),
        })

class UserLogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Đăng xuất thành công."}, status=200)
        response.delete_cookie("accessToken")
        response.delete_cookie("refreshToken")
        return response

class UserProfile(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def get_client(self, request):
        return get_object_or_404(Client, user=request.user)
    def retrieve(self, request):
        client = self.get_client(request)
        serializer = ClientSerializers(client)
        return Response(serializer.data)
    def update(self, request):
        client = self.get_client(request)
        data = request.data.copy()
        if 'avatar' in data and 'avatar' not in request.FILES:
            data.pop('avatar')
        serializer = ClientSerializers(client, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def me(self, request):
        if request.method == 'GET':
            return self.retrieve(request)
        else:
            return self.update(request)
        
        
class AvatarUpdateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=401)
        client = get_object_or_404(Client, user=request.user)
        serializer = AvatarSerializer(client, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'avatar': serializer.data['avatar']}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TourViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Tour.objects.all().select_related('tour_guide').prefetch_related('tourDestination__destination')
    serializer_class = TourSerializer
    lookup_field = 'slug'
    @action(detail=True, methods=['get'], url_path='tour-destination')
    def tourDestination(self, request, slug=None):
        tour = self.get_object()
        tour_destination = tour.tourDestination.all()
        serializers = TourDestinationSerializer(tour_destination, many=True)
        return Response(serializers.data)
    @method_decorator(cache_page(60*5)) 
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class DestinationViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = DestinationSerializer
    lookup_field = 'slug'
    queryset = Destination.objects.none()
    def get_queryset(self):
        return Destination.objects.annotate(
            average_rating=Avg('ratings__rating'),
            review_count=Count('ratings')
        )

class HotelViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Hotel.objects.none()
    serializer_class = HotelSerializer
    lookup_field = 'slug'
    @action(detail=True, methods=['get'], url_path='rooms')
    def rooms(self, request, slug=None):
        hotel = self.get_object()
        rooms = hotel.rooms.all()
        serializer = HotelRoomSerializer(rooms, many = True)
        return Response(serializer.data)
    def get_queryset(self):
        return Hotel.objects.annotate(
            average_rating=Avg('ratings__rating'),
            review_count=Count('ratings')
        )

class FestivalViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Festival.objects.all()
    serializer_class = FestivalSerializer
    lookup_field = 'slug'

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticlesSerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination

class CuisineViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer
    lookup_field = 'slug'

class TourBookingViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = TourBooking.objects.filter(status='confirmed')
    serializer_class = TourBookingSerializer

load_dotenv()
def momo_create_pay_url(order_id, amount, redirect_url, ipn_url, extra_data=None):
    endpoint = os.getenv("MOMO_ENDPOINT")
    partnerCode = os.getenv("MOMO_PARTNER_CODE")
    accessKey = os.getenv("MOMO_ACCESS_KEY")
    secretKey = os.getenv("MOMO_SECRET_KEY")

    requestId = str(uuid.uuid4())
    orderInfo = "Thanh toán đặt tour"
    amount_str = str(int(amount))
    extraData = extra_data or "" 
    requestType = "captureWallet"

    raw_signature = (
        f"accessKey={accessKey}&amount={amount_str}&extraData={extraData}"
        f"&ipnUrl={ipn_url}&orderId={order_id}&orderInfo={orderInfo}"
        f"&partnerCode={partnerCode}&redirectUrl={redirect_url}"
        f"&requestId={requestId}&requestType={requestType}"
    )
    signature = hmac.new(
        bytes(secretKey, 'utf-8'),
        bytes(raw_signature, 'utf-8'),
        hashlib.sha256
    ).hexdigest()

    data = {
        "partnerCode": partnerCode,
        "accessKey": accessKey,
        "requestId": requestId,
        "amount": amount_str,
        "orderId": order_id,
        "orderInfo": orderInfo,
        "redirectUrl": redirect_url,
        "ipnUrl": ipn_url,
        "extraData": extraData,
        "requestType": requestType,
        "signature": signature,
        "lang": "vi"
    }

    response = requests.post(endpoint, json=data, timeout=15)
    response_data = response.json()

    if response_data.get("payUrl"):
        return response_data["payUrl"]
    else:
        raise Exception("Không lấy được payUrl MoMo: %s" % response_data)

class MomoPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            amount = request.data.get('amount')
            tour_id = request.data.get('tour_id')
            people_count = request.data.get('people_count')

            if not all([amount, tour_id, people_count]):
                return Response({'detail': 'Thiếu dữ liệu.'}, status=drf_status.HTTP_400_BAD_REQUEST)

            try:
                tour = Tour.objects.get(id=tour_id)
            except Tour.DoesNotExist:
                return Response({'detail': 'Tour không tồn tại.'}, status=drf_status.HTTP_404_NOT_FOUND)

            existed_payment = Payment.objects.filter(
                booking__client=request.user.client,
                booking__tour=tour,
                status='Pending'
            ).first()

            if existed_payment:
                existed_booking = existed_payment.booking
                existed_payment.delete()
                if existed_booking.status == 'pending':
                    existed_booking.delete()

            booking = TourBooking.objects.create(
                client=request.user.client,
                tour=tour,
                number_of_people=people_count,
                paid_amount=0,
                booking_date = timezone.now(),
                status='pending'
            )

            order_id = str(uuid.uuid4())
            payment = Payment.objects.create(
                booking=booking,
                amount=amount,
                status='Pending',
                payment_reference=order_id,
                payment_date = timezone.now(),
                method='momo'
            )
            print('MOMO_REDIRECT_URL:', os.getenv('MOMO_REDIRECT_URL'))
            print('MOMO_IPN_URL:', os.getenv('MOMO_IPN_URL'))
            payUrl = momo_create_pay_url(
                order_id=order_id,
                amount=amount,
                redirect_url=os.getenv('MOMO_REDIRECT_URL'),
                ipn_url=os.getenv("MOMO_IPN_URL"),
                extra_data=str(request.user.id) 
            )
            return Response({'payUrl': payUrl, 'orderId': order_id})
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({'detail': 'Có lỗi khi tạo thanh toán: ' + str(e)}, status=drf_status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class MomoCallbackView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        result_code = request.GET.get('resultCode')
        order_id = request.GET.get('orderId')
        try:
            payment = Payment.objects.get(payment_reference=order_id)
            booking_id = payment.booking.id
            if result_code == '0':
                payment.status = "Completed"
                payment.save()
                booking = payment.booking
                booking.total_amount = booking.tour.price
                booking.paid_amount += payment.amount
                booking.status = 'Paid'
                booking.save()
                redirect_frontend = f"http://localhost:5174/chuyen-du-lich/{booking.tour.slug}?payment=success&booking_id={booking_id}"
                return redirect(redirect_frontend)
            else:
                payment.status = "Failed"
                payment.save()
                booking = payment.booking
                booking.status = 'Failed'
                booking.save()
                redirect_frontend = f"http://localhost:5174/chuyen-du-lich/{booking.tour.slug}?payment=failed&booking_id={booking_id}"
                return redirect(redirect_frontend)
        except Payment.DoesNotExist:
            return redirect(f"http://localhost:5174/?payment=error")
                
    def post(self, request):
        result_code = request.data.get('resultCode')
        order_id = request.data.get('orderId')
        
        try:
            payment = Payment.objects.get(payment_reference=order_id)
            if result_code == '0':
                payment.status = "Completed"
                payment.save()
                booking = payment.booking
                booking.paid_amount += payment.amount
                booking.save()
            else:
                payment.status = "Failed"
                payment.save()
        except Payment.DoesNotExist:
            pass
            
        return Response({"status": "received"})
from django.utils.dateparse import parse_date
class RoomBookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomBookingSerializer
    queryset = RoomBooking.objects.none()

    def get_queryset(self):
        return RoomBooking.objects.filter(client=self.request.user.client)

    @transaction.atomic
    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']
        room = HotelRoom.objects.select_for_update().get(id=room.id)
        if not room.is_available or room.quantity <= 0:
            raise ValidationError("Phòng không còn sẵn có.")
        overlapping_bookings = RoomBooking.objects.filter(
            room=room,
            status__in=[RoomBooking.STATUS_PENDING, RoomBooking.STATUS_CONFIRMED],
            check_in__lt=check_out,
            check_out__gt=check_in,
        ).count()
        if overlapping_bookings >= room.quantity:
            raise ValidationError("Phòng đã được đặt trong khoảng thời gian này.")
        nights = (check_out - check_in).days
        total_amount = room.price * nights
        serializer.save(
            client=self.request.user.client,
            total_amount=total_amount,
            status=RoomBooking.STATUS_PENDING
        )

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return response
        except ValidationError as e:
            return Response({'detail': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': 'Lỗi khi đặt phòng. Vui lòng thử lại.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == RoomBooking.STATUS_CANCELED:
            return Response({'detail': 'Đặt phòng đã bị hủy trước đó.'}, status=status.HTTP_400_BAD_REQUEST)
        booking.status = RoomBooking.STATUS_CANCELED
        booking.canceled_at = timezone.now()
        booking.save()
        return Response({'detail': 'Hủy đặt phòng thành công!'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='available-quantity')
    def available_quantity(self, request):
        room_id = request.query_params.get('room_id')
        check_in_str = request.query_params.get('check_in')
        check_out_str = request.query_params.get('check_out')

        if not room_id or not check_in_str or not check_out_str:
            return Response({'detail': 'Thiếu tham số room_id, check_in hoặc check_out.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            check_in = parse_date(check_in_str)
            check_out = parse_date(check_out_str)
            if check_in is None or check_out is None:
                raise ValueError()
        except ValueError:
            return Response({'detail': 'Ngày check_in hoặc check_out không hợp lệ.'}, status=status.HTTP_400_BAD_REQUEST)

        if check_in >= check_out:
            return Response({'detail': 'Ngày check_out phải lớn hơn ngày check_in.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            room = HotelRoom.objects.get(id=room_id)
        except HotelRoom.DoesNotExist:
            return Response({'detail': 'Phòng không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)

        overlapping_bookings = RoomBooking.objects.filter(
            room=room,
            status__in=[RoomBooking.STATUS_PENDING, RoomBooking.STATUS_CONFIRMED],
            check_in__lt=check_out,
            check_out__gt=check_in,
        ).count()

        available = room.quantity - overlapping_bookings
        available = max(available, 0)

        return Response({
            'room_id': room_id,
            'available_quantity': available,
            'total_quantity': room.quantity,
        }, status=status.HTTP_200_OK)

class RatingListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = RatingSerializer
    def get_queryset(self):
        entity = self.kwargs['entity']
        obj_id = self.kwargs['pk']
        model = {'destination': Destination, 'hotel': Hotel, 'food': Cuisine}[entity]
        content_type = ContentType.objects.get_for_model(model)
        return Rating.objects.filter(content_type=content_type, object_id=obj_id)
    def perform_create(self, serializer):
        entity = self.kwargs['entity']
        obj_id = self.kwargs['pk']
        model = {'destination': Destination, 'hotel': Hotel, 'food': Cuisine}[entity]
        content_type = ContentType.objects.get_for_model(model)
        client = self.request.user.client
        existing = Rating.objects.filter(
            client=client,
            content_type=content_type,
            object_id=obj_id
        ).first()
        rating = self.request.data.get('rating', 5)
        if existing:
            existing.rating = rating or 5
            existing.save()
            serializer.instance = existing
        else:
            serializer.save(
                client=client,
                content_type=content_type,
                object_id=obj_id,
                rating=rating or 5
            )

class CommentListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    def get_queryset(self):
        entity = self.kwargs['entity']
        obj_id = self.kwargs['pk']
        model = {'destination': Destination, 'hotel': Hotel, 'food': Cuisine}[entity]
        content_type = ContentType.objects.get_for_model(model)
        return Comment.objects.filter(content_type=content_type, object_id=obj_id, parent=None)
    def perform_create(self, serializer):
        entity = self.kwargs['entity']
        obj_id = self.kwargs['pk']
        model = {'destination': Destination, 'hotel': Hotel, 'food': Cuisine}[entity]
        content_type = ContentType.objects.get_for_model(model)
        serializer.save(
            client=self.request.user.client,
            content_type=content_type,
            object_id=obj_id
        )

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Notification.objects.none()
    def get_queryset(self):
        return Notification.objects.filter(client=self.request.user.client).order_by('-sent_at')