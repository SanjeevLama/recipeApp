from rest_framework import generics
from .models import Recipe
from .serializers import RecipeSerializer
from rest_framework import permissions
from .permissions import IsOwnerOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend

class RecipeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Recipe.objects.annotate(
        like_count_ann=Count('likes')
    )

    serializer_class = RecipeSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]

    filterset_fields = ['category', 'diet_type']
    search_fields = ['title', 'description', 'ingredients']
    ordering_fields = ['like_count_ann', 'created_at']
    ordering = ['-like_count_ann']
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RecipeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsOwnerOrReadOnly]