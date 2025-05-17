import re
from django.core.management.base import BaseCommand
from cloudinary import api as cloudinary_api

from api.models import (
    Destination, Tour, Festival, Blog, Article, Cuisine
)

CLOUDINARY_FOLDERS = [
    "article-images/", "destinations/", "tours/", "events/", "event-news/", "cuisine/"
]

CLOUDINARY_URL_PATTERN = re.compile(
    r'https://res\.cloudinary\.com/[^/]+/image/upload/(?:v\d+/)?([-\w/]+)\.(jpg|jpeg|png|webp|gif)'
)

def extract_cloudinary_public_ids_from_html(html):
    if not html:
        return set()
    return set(
        match.group(1)
        for match in CLOUDINARY_URL_PATTERN.finditer(html)
    )

def extract_cloudinary_public_id_from_url(url):
    if not url:
        return None
    match = CLOUDINARY_URL_PATTERN.search(url)
    if match:
        return match.group(1)
    return None

class Command(BaseCommand):
    help = 'Dọn rác Cloudinary cho toàn bộ models: tìm và xóa ảnh không còn được sử dụng'

    def handle(self, *args, **options):
        used_public_ids = set()

        for obj in Destination.objects.all():
            used_public_ids |= extract_cloudinary_public_ids_from_html(obj.description)
            if obj.image_url:
                pid = extract_cloudinary_public_id_from_url(str(obj.image_url))
                if pid:
                    used_public_ids.add(pid)

        for obj in Tour.objects.all():
            used_public_ids |= extract_cloudinary_public_ids_from_html(obj.description)
            if obj.image:
                pid = extract_cloudinary_public_id_from_url(str(obj.image))
                if pid:
                    used_public_ids.add(pid)

        for obj in Festival.objects.all():
            used_public_ids |= extract_cloudinary_public_ids_from_html(obj.description)
            if obj.image_url:
                pid = extract_cloudinary_public_id_from_url(str(obj.image_url))
                if pid:
                    used_public_ids.add(pid)

        for obj in Blog.objects.all():
            used_public_ids |= extract_cloudinary_public_ids_from_html(obj.content)
            if obj.cover_image_url:
                pid = extract_cloudinary_public_id_from_url(obj.cover_image_url)
                if pid:
                    used_public_ids.add(pid)

        for obj in Article.objects.all():
            used_public_ids |= extract_cloudinary_public_ids_from_html(obj.content)
            if obj.cover_image_url:
                pid = extract_cloudinary_public_id_from_url(str(obj.cover_image_url))
                if pid:
                    used_public_ids.add(pid)

        for obj in Cuisine.objects.all():
            used_public_ids |= extract_cloudinary_public_ids_from_html(obj.description)
            if obj.image:
                pid = extract_cloudinary_public_id_from_url(str(obj.image))
                if pid:
                    used_public_ids.add(pid)
            gallery = obj.gallery
            if gallery and isinstance(gallery, list):
                for url in gallery:
                    pid = extract_cloudinary_public_id_from_url(url)
                    if pid:
                        used_public_ids.add(pid)

        self.stdout.write(self.style.SUCCESS(f'Đã quét models, tổng số public_id đang được sử dụng: {len(used_public_ids)}'))

        all_public_ids = set()
        for folder in CLOUDINARY_FOLDERS:
            self.stdout.write(f'Đang quét Cloudinary folder: {folder}')
            next_cursor = None
            while True:
                res = cloudinary_api.resources(
                    type="upload",
                    prefix=folder,
                    max_results=500,
                    next_cursor=next_cursor
                )
                for r in res['resources']:
                    all_public_ids.add(r['public_id'])
                next_cursor = res.get('next_cursor')
                if not next_cursor:
                    break

        self.stdout.write(self.style.SUCCESS(f'Tổng số ảnh trên Cloudinary: {len(all_public_ids)}'))

        unused_public_ids = all_public_ids - used_public_ids
        self.stdout.write(self.style.WARNING(f'Có {len(unused_public_ids)} ảnh không còn sử dụng, sẽ bị xóa!'))

        for public_id in unused_public_ids:
            try:
                cloudinary_api.delete_resources([public_id])
                self.stdout.write(f'Đã xóa: {public_id}')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Lỗi xóa {public_id}: {e}'))

        self.stdout.write(self.style.SUCCESS('Hoàn thành dọn rác Cloudinary!'))