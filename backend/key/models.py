from django.db import models
import uuid

class Key(models.Model):
    key = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return f"Key: {self.key}"