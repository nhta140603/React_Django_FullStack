from rest_framework import generics, viewsets, permissions
from .serializers import *
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
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
            response = Response({"id": user.id, "username": user.username}, status=200)
            response.set_cookie(
                key="accessToken",
                value=str(token.access_token),
                httponly=True,
                secure=True,
                samesite="Lax"
            )
            response.set_cookie(
                key="refreshToken",
                value=str(token),
                httponly=True,
                secure=True,
                samesite="Lax"
            )
            return response

class UserLogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Đăng xuất thành côngs."}, status=200)
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
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    lookup_field = 'slug'

class HotelViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    lookup_field = 'slug'
    @action(detail=True, methods=['get'], url_path='rooms')
    def rooms(self, request, slug=None):
        hotel = self.get_object()
        rooms = hotel.rooms.all()
        serializer = HotelRoomSerializer(rooms, many = True)
        return Response(serializer.data)

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
    
class RoomBookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomBookingSerializer
    queryset = RoomBooking.objects.none()
    def get_queryset(self):
        return RoomBooking.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    def create(self, request, *args, **kwargs):
        print('>>> request.data:', request.data)
        return super().create(request, *args, **kwargs)

