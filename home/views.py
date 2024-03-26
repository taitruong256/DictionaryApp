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
