# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-01-30 21:28
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0008_auto_20170126_1953'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='coordinators',
            field=models.ManyToManyField(blank=True, related_name='Coordenadores', to=settings.AUTH_USER_MODEL),
        ),
    ]
