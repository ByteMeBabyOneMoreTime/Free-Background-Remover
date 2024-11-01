from django.contrib import admin
from django.urls import path
from .view import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('remove-bg/<api>', remove_background, name='remove_bg')
]