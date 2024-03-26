from django.shortcuts import render, redirect
from rest_framework import generics, status
from rest_framework.response import Response
from home.models import Word
from .serializers import WordSerializer


class WordList(generics.ListCreateAPIView):
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

class AddWordAPIView(generics.CreateAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save() 
            return redirect('get_home')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateWordAPIView(generics.UpdateAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return redirect('get_home')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteWordlAPIView(generics.DestroyAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return redirect('get_home')