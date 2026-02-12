from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Like
from recipes.models import Recipe

# Create your views here.

class LikeToggleAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, format=None):
        # Find the recipe using the primary key (pk) from the URL
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # Check if the user has already liked this recipe
        try:
            like = Like.objects.get(owner=request.user, recipe=recipe)
            # If the like exists, delete it (unlike)
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            # If the like does not exist, create it (like)
            Like.objects.create(owner=request.user, recipe=recipe)
            return Response(status=status.HTTP_201_CREATED)


