from rest_framework import serializers
from api.models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({'username': 'Tài khoản không tồn tại.'})
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError({'password': 'Mật khẩu không đúng.'})
        if not user.is_active:
            raise serializers.ValidationError({'disable_account': 'Tài khoản đã bị vô hiệu hóa.'})
        if not (user.is_staff or user.is_superuser):
            raise serializers.ValidationError({'no_admin': 'Chỉ tài khoản quản trị viên mới có quyền đăng nhập.'})
        return user

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'full_name', 'is_active']

    def get_full_name(self, obj):
        return obj.get_full_name()
class UserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active']

class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Client
        fields = [
            'id', 'user', 'avatar', 'gender', 'date_of_birth',
            'phone', 'address', 'emergency_contact', 'created_at'
        ]

class DestinationSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Destination
        fields = ['__all__']
    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url.url


class TourGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourGuide
        fields = '__all__'

class CuisineSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Cuisine
        fields = '__all__'
    def get_image(self, obj):
        if obj.image:
            return obj.image.url

class HotelAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelAmenity
        fields = '__all__'


class TourSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Tour
        fields = '__all__'
    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        
class TourDestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourDestination
        fields = '__all__'

class TourBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourBooking
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class HotelSerializer(serializers.ModelSerializer):
    image_cover = serializers.SerializerMethodField()
    class Meta:
        model = Hotel
        fields = '__all__'
    def get_image_cover(self, obj):
        if obj.image_cover:
            return obj.image_cover.url

class HotelRoomSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    hotel = serializers.PrimaryKeyRelatedField(queryset=Hotel.objects.all())
    class Meta:
        model = HotelRoom
        fields = '__all__'
    def get_hotel(self, obj):
        return obj.hotel.name if obj.hotel else None
    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url.url

class RoomBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBooking
        fields = '__all__'

class TransportationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transportation
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class VehicleRentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleRental
        fields = '__all__'

class PersonalTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalTrip
        fields = '__all__'

class PersonalTripDestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalTripDestination
        fields = '__all__'

class PersonalTourGuideBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalTourGuideBooking
        fields = '__all__'

class FestivalSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Festival
        fields = '__all__'
    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url.url
              
class ArticlesSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    class Meta:
        model = Article
        fields = '__all__'
    def get_cover_image_url(self, obj):
        if obj.cover_image_url:
            return obj.cover_image_url.url

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'

class PromotionTourSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionTour
        fields = '__all__'

class PromotionHotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionHotel
        fields = '__all__'

class PromotionTransportationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionTransportation
        fields = '__all__'

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'