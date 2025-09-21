from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe

# Create your models here.
class Like(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, related_name='likes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('owner', 'recipe')

    def __str__(self):
        return f'{self.owner.username} likes {self.recipe.title}'