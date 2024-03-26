from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Word
from .serializers import WordSerializer

# Create your views here.
def get_home(request):
    return render(request, 'index.html')


@api_view(['POST'])
def add_word(request):
    serializer = WordSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def update_word(request, id):
    try:
        word = Word.objects.get(pk=id)
    except Word.DoesNotExist:
        return Response({"message": "Từ vựng không tồn tại"}, status=404)

    if request.method == 'POST':
        serializer = WordSerializer(word, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def delete_word(request, id):
    try:
        word = Word.objects.get(pk=id)
    except Word.DoesNotExist:
        return Response({"message": "Từ vựng không tồn tại"}, status=404)

    if request.method == 'DELETE':
        word.delete()
        return Response({"message": "Từ vựng đã được xóa"}, status=204)