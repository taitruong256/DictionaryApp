from django.urls import path
from . import views
urlpatterns = [
    path("wordlist/", views.WordList.as_view(), name="word-list"),
]