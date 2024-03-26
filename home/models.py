from django.db import models

class Word(models.Model):
    word = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    definition = models.TextField()
    topic = models.CharField(max_length=100)

    def __str__(self):
        return "{}: {}".format(self.word, self.definition)
