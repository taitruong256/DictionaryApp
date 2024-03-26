from django.urls import path
from . import views
urlpatterns = [
    path("words/", views.WordList.as_view(), name="word-list"),
]