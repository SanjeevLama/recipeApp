from rest_framework import serializers
from .models import Recipe
from like.models import Like

class RecipeSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source = 'owner.username')

    like_count = serializers.SerializerMethodField()
    user_has_liked = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'owner', 'title', 'category', 'diet_type', 'description', 'ingredients', 'instructions', 'created_at', 'updated_at', 'like_count', 'user_has_liked']

    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_user_has_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.likes.filter(owner=user).exists()
        return False