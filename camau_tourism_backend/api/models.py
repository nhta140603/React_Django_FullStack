from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from ckeditor.fields import RichTextField
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.fields import GenericRelation
class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = CloudinaryField('image', folder='avatars', blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    emergency_contact = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TourGuide(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    avatar = CloudinaryField('image', folder='avatars', blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    bio = models.TextField()
    rating = models.FloatField(default=0)
    languages = ArrayField(models.CharField(max_length=50), blank=True, null=True)
    certifications = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Destination(models.Model):
    name = models.CharField(max_length=255)
    description = RichTextField(blank=True, null=True)
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=100, blank=True, null=True)
    open_time = models.TimeField(blank=True, null=True)
    close_time = models.TimeField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    image_url = CloudinaryField('image', folder='destinations', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    slug = models.SlugField(unique= False, blank=True)
    comments = GenericRelation('Comment')
    ratings = GenericRelation('Rating')
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Tour(models.Model):
    name = models.CharField(max_length=255)
    image = CloudinaryField('image', folder='tours', blank=True, null=True)
    description = RichTextField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    duration = models.IntegerField()
    max_people = models.IntegerField(default=20)
    min_people = models.IntegerField(default=1)
    available_dates = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    tour_guide = models.ForeignKey(TourGuide, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique= False, blank=True)
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class TourDestination(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="tourDestination")
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name="destination")
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    note = models.TextField(blank=True, null=True)
    order_in_day = models.IntegerField(null=True, blank=True)  

class TourBooking(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.SET_NULL, null=True)
    booking_date = models.DateField()
    number_of_people = models.IntegerField()
    status = models.CharField(max_length=50)
    contact_name = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    special_request = models.TextField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    canceled_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Payment(models.Model):
    booking = models.ForeignKey(TourBooking, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateTimeField()
    method = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    refunded = models.BooleanField(default=False)
    refund_date = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

class Review(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.SET_NULL, null=True)
    rating = models.IntegerField()
    comment = models.TextField()
    image_urls = ArrayField(models.URLField(), blank=True, null=True)
    reply = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(default=True)
    review_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class HotelAmenity(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name

class Hotel(models.Model):
    name = models.CharField(max_length=255)
    amenities = models.ManyToManyField(HotelAmenity, blank=True, related_name='amenties')
    address = models.CharField(max_length=255)
    description = models.TextField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    star_rating = models.IntegerField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    image_cover = CloudinaryField('image', folder='hotels', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique= False, blank=True)
    comments = GenericRelation('Comment')
    ratings = GenericRelation('Rating')
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class HotelRoom(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="rooms")
    room_number = models.CharField(max_length=20,blank=True, null=True)
    room_type = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    capacity = models.IntegerField(default=2)
    facilities = ArrayField(models.CharField(max_length=50), blank=True, null=True)
    is_available = models.BooleanField(default=True)
    image_url = CloudinaryField('image', folder='hotel-rooms', blank=True, null=True)
    image_gallery = ArrayField(models.URLField(), blank=True, null=True)
    floor = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    amenities = models.ManyToManyField(HotelAmenity, blank=True, related_name='amenties_rooms')

class RoomBooking(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_CANCELED = 'canceled'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Đang chờ xác nhận'),
        (STATUS_CONFIRMED, 'Đã xác nhận'),
        (STATUS_CANCELED, 'Đã hủy'),
    ]
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    room = models.ForeignKey(HotelRoom, on_delete=models.SET_NULL, null=True)
    booking_date = models.DateField(auto_now_add=True)
    check_in = models.DateField()
    check_out = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=STATUS_PENDING)
    contact_name = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    canceled_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Transportation(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    operator_name = models.CharField(max_length=255, blank=True, null=True)
    seat_class = models.CharField(max_length=50, blank=True, null=True)
    departure = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    is_refundable = models.BooleanField(default=True)
    baggage_policy = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Ticket(models.Model):
    transportation = models.ForeignKey(Transportation, on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=20)
    ticket_code = models.CharField(max_length=50)
    issued_at = models.DateTimeField(auto_now_add=True)
    qr_code_url = models.URLField(blank=True, null=True)
    valid_from = models.DateTimeField(blank=True, null=True)
    valid_until = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, default='valid')

class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('car', 'Car'),
        ('motorbike', 'Motorbike'),
        ('bus', 'Bus'),
        ('bicycle', 'Bicycle'),
        ('van', 'Van'),
        ('other', 'Other'),
    ]
    vehicle_type = models.CharField(max_length=50, choices=VEHICLE_TYPE_CHOICES)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100, blank=True, null=True)
    license_plate = models.CharField(max_length=20, unique=True)
    seat_count = models.IntegerField(default=4)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='vehicles/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    year = models.IntegerField(blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.get_vehicle_type_display()} - {self.brand} ({self.license_plate})"

class VehicleRental(models.Model):
    client = models.ForeignKey('Client', on_delete=models.CASCADE)
    vehicle = models.ForeignKey('Vehicle', on_delete=models.SET_NULL, null=True)
    destination = models.ForeignKey('Destination', on_delete=models.SET_NULL, null=True, blank=True)
    rental_date = models.DateField()
    return_date = models.DateField()
    driver_needed = models.BooleanField(default=False)
    insurance_included = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    rental_status = models.CharField(max_length=50, default='reserved')
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client} thuê {self.vehicle} từ {self.rental_date} đến {self.return_date}"

class PersonalTrip(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_public = models.BooleanField(default=False)
    main_image = models.URLField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PersonalTripDestination(models.Model):
    personal_trip = models.ForeignKey(PersonalTrip, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True)
    visit_date = models.DateField()
    order = models.IntegerField(default=1)
    notes = models.TextField(blank=True, null=True)

class PersonalTourGuideBooking(models.Model):
    personal_trip = models.ForeignKey(PersonalTrip, on_delete=models.CASCADE)
    tour_guide = models.ForeignKey(TourGuide, on_delete=models.SET_NULL, null=True)
    booking_date = models.DateField()
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    feedback = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50)
    canceled_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Festival(models.Model):
    title = models.CharField(max_length=255)
    description = RichTextField(blank=True, null=True)
    event_date = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    image_url = CloudinaryField('image', folder='events', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique= False, blank=True)
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

class Blog(models.Model):
    author = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    content = RichTextField()
    is_public = models.BooleanField(default=True)
    cover_image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Article(models.Model):
    ARTICLE_TYPE_CHOICES = (
        ('news', 'Tin tức'),
        ('event', 'Sự kiện'),
    )
    type = models.CharField(max_length=10, choices=ARTICLE_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, db_index=True)
    content = RichTextField()
    cover_image_url = CloudinaryField('image', folder='event-news', blank=True, null=True)
    event_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Media(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, blank=True, null=True)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, blank=True, null=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, blank=True, null=True)
    url = models.URLField()
    media_type = models.CharField(max_length=50)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=True)

class Wishlist(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.SET_NULL, null=True, blank=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.SET_NULL, null=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True, null=True)

class SupportTicket(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50)
    priority = models.CharField(max_length=50, default='normal')
    replied_at = models.DateTimeField(blank=True, null=True)
    reply_content = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

class Notification(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    type = models.CharField(max_length=50, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(max_length=100, blank=True, null=True)
    order = models.IntegerField(default=0)

class Cuisine(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = RichTextField(blank=True, null=True)
    image = CloudinaryField('image', folder='cuisine', blank=True, null=True)
    gallery = models.JSONField(blank=True, null=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    comments = GenericRelation('Comment')
    ratings = GenericRelation('Rating')
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Rating(models.Model):
    client = models.ForeignKey('Client', on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('client', 'content_type', 'object_id') 
    def __str__(self):
        return f"Rating {self.rating} by {self.client} on {self.content_object}"
    
class Comment(models.Model):
    client = models.ForeignKey('Client', on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    image = CloudinaryField('image', folder='comment', blank=True, null=True)
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return f"Comment by {self.client} on {self.content_object}"