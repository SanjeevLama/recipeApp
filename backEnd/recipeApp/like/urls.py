from django.urls import path
from .views import LikeToggleAPIView

urlpatterns = [
    path('recipes/<int:pk>/', LikeToggleAPIView.as_view(), name='recipe-like-toggle')
]