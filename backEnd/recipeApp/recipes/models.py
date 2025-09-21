from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    class Category(models.TextChoices):
        BREAKFAST = 'BR', 'Breakfast'
        LUNCH = 'LU', 'Lunch'
        DINNER = 'DI', 'Dinner'
        DESSERT = 'DE', 'Dessert'
        SNACK = 'SN', 'Snack'
        OTHER = 'OT', 'Other'

    class DietType(models.TextChoices):
        VEG = 'VEG', 'Vegetarian'
        NONVEG = 'NON', 'Non-Vegetarian'
        VEGAN = 'VGN', 'Vegan'
    
    owner = models.ForeignKey(User, related_name='recipes', on_delete=models.CASCADE)

    title = models.CharField(max_length=250)
    category = models.CharField(
        max_length = 2,
        choices =Category.choices,
        default = Category.OTHER,
    )
    diet_type = models.CharField(
        max_length = 3,
        choices = DietType.choices,
        default = DietType.NONVEG
    )
    description = models.TextField(blank=True, null=True)
    ingredients = models.TextField()
    instructions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title