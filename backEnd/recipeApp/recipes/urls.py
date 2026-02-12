from django.urls import path
from .views import RecipeListCreateAPIView, RecipeDetailAPIView

urlpatterns = [
    path('recipes/', RecipeListCreateAPIView.as_view(), name='recipe-list-create'),
    path('recipes/<int:pk>/', RecipeDetailAPIView.as_view(), name='recipe-detail'),
]