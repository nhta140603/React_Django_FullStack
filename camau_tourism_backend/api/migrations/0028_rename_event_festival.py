# Generated by Django 5.0.14 on 2025-05-04 10:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_article_alter_blog_content'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Event',
            new_name='Festival',
        ),
    ]
