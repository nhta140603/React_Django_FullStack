from rest_framework import serializers, viewsets
from django.contrib.auth.models import User
from .models import *
from django.contrib.auth import authenticate
from rest_framework.response import Response

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
    def validate_email(self, email):
        if User.objects.filter(email = email).exists():
            raise serializers.ValidationError('Email này đã tồn tại')
        return email
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Client.objects.create(user=user, phone='', address='')
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    def validate_username(self, username):
        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError('Tài khoản này không tồn tại.')
        return username
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": ["Tài khoản này không tồn tại."]})
        if not user.is_active:
            raise serializers.ValidationError({"disable_account": ["Tài khoản này đã bị vô hiệu hóa."]})
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError({"password": ["Mật khẩu không đúng."]})
        return user

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'full_name']
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

class ClientSerializers(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Client
        fields = [
            'id', 'user', 'avatar', 'gender', 'date_of_birth', 'phone',
            'address', 'emergency_contact'
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['avatar']

class TourSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Tour
        fields = '__all__'
    def get_image(self, obj):
        if obj.image:
            return obj.image.url

class DestinationSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    class Meta:
        model = Destination
        fields = '__all__'
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image_url'] = instance.image_url.url if instance.image_url else None
        return data
    def get_average_rating(self, obj):
        return obj.average_rating
    def get_review_count(self, obj):
        return obj.review_count

class ArticlesSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    class Meta:
        model = Article
        fields = '__all__'
    def get_cover_image_url(self, obj):
        if obj.cover_image_url:
            CLOUDINARY_BASE = "https://res.cloudinary.com/deavaowp3/"
            return f"{CLOUDINARY_BASE}{obj.cover_image_url}"
        return None

class CuisineSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    class Meta:
        model = Cuisine
        fields = '__all__'
    def get_image(self, obj):
        if obj.image:
            return obj.image.url
    def get_average_rating(self, obj):
        avg = obj.ratings.aggregate(avg=Avg('rating'))['avg']
        if avg is not None:
            return round(avg, 1)
        return None

    def get_review_count(self, obj):
        return obj.ratings.count()

class HotelRoomSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = HotelRoom
        fields = '__all__'
    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url.url

class HotelSerializer(serializers.ModelSerializer):
    image_cover = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    class Meta:
        model = Hotel
        fields ='__all__'
    def get_image_cover(self, obj):
        if obj.image_cover:
            return obj.image_cover.url
    def get_min_price(self, obj):
        rooms = obj.rooms.all()
        min_room = rooms.order_by('price').first()
        return min_room.price if min_room else None
    def get_average_rating(self, obj):
        return obj.average_rating
    def get_review_count(self, obj):
        return obj.review_count
    
class HotelAmenitySerializer(serializers.ModelSerializer):
     class Meta:
        model = HotelAmenity
        fields ='__all__'

class TourDestinationSerializer(serializers.ModelSerializer):
    image_destination = serializers.SerializerMethodField()
    name_destination = serializers.SerializerMethodField()
    type_destination = serializers.SerializerMethodField()
    class Meta:
        model = TourDestination
        fields ='__all__'
    def get_image_destination(self, obj):
        return obj.destination.image_url.url if obj.destination else None
    def get_name_destination(self, obj):
        return obj.destination.name if obj.destination else None
    def get_type_destination(self, obj):
        return obj.destination.type if obj.destination else None

class FestivalSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Festival
        fields = '__all__'
    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url.url
        
class TourBookingSerializer(serializers.ModelSerializer):
    tour = TourSerializer() 
    class Meta:
        model = TourBooking
        fields = '__all__'


class RoomBookingSerializer(serializers.ModelSerializer):
    room = serializers.PrimaryKeyRelatedField(queryset=HotelRoom.objects.all())
    location = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    class Meta:
        model = RoomBooking
        fields = '__all__'
        read_only_fields = ['client']
    def get_location(self, obj):
        return obj.room.hotel.address if  obj.room.hotel.address else None
    def get_name(self, obj):
        return obj.room.hotel.name if obj.room.hotel.name else None
    

class RatingSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Rating
        fields = ['id', 'client', 'rating', 'created_at', 'updated_at']

class CommentSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(read_only=True)
    full_name = serializers.CharField(source='client.user.get_full_name', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'client', 'content', 'full_name', 'image', 'parent', 'created_at', 'updated_at', 'is_public']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'  