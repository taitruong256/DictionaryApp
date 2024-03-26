from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Word
from .serializers import WordSerializer
from rest_framework import generics, status 

# Create your views here.
def get_home(request):
    return render(request, 'index.html')


class AddWordAPIView(generics.CreateAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return render(request, 'index.html')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateWordAPIView(generics.UpdateAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return render(request, 'index.html')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteWordlAPIView(generics.DestroyAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)