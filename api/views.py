from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from home.models import Word
from .serializers import WordSerializer


class WordList(generics.ListCreateAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def delete(self, request, *args, **kwargs):
        Word.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# class BlogPostRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
#     queryset = BlogPost.objects.all()
#     serializer_class = BlogPostSerializer
#     lookup_field = "pk"