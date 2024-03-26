from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from home.models import Word
from .serializers import WordSerializer


class WordList(generics.ListCreateAPIView):
    # queryset = Word.objects.all()
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    def get_queryset(self):
        """
        Chế độ xem này sẽ trả về danh sách tất cả các từ
        cho người dùng hiện được xác thực.
        """
        queryset = Word.objects.all()
        search_query = self.request.query_params.get('search', None)
        # print("queryparam:",self.request.query_params)
        # print('Search query:', search_query)
        if search_query is not None:
            queryset = queryset.filter(word__startswith=search_query)
        return queryset

    # def delete(self, request, *args, **kwargs):
    #     Word.objects.all().delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)


# class BlogPostRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
#     queryset = BlogPost.objects.all()
#     serializer_class = BlogPostSerializer
#     lookup_field = "pk"