from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from recipes.serializers import RecipeSerializer


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type':'password'})
    
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
        username=validated_data['username'],
        email=validated_data.get('email', ''),
        password=validated_data['password'],
        first_name=validated_data.get('first_name', ''),
        last_name=validated_data.get('last_name', '')
        )
        return user
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token
    
class UserProfileSerializer(serializers.ModelSerializer):
    recipes = RecipeSerializer(many=True, read_only=True)

    total_likes_received = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'recipes', 'total_likes_received']
    
    def get_total_likes_received(self, obj):
        from like.models import Like
        return Like.objects.filter(recipe__owner=obj).count()