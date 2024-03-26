from django.urls import path
from . import views
urlpatterns = [
    path("words/", views.WordList.as_view(), name="word-list"),
    path('add-word/', views.AddWordAPIView.as_view(), name='add_word'),
    path('update-word/<int:pk>/', views.UpdateWordAPIView.as_view(), name='update_word'),
    path('delete-word/<int:pk>/', views.DeleteWordlAPIView.as_view(), name='delete_word'),
]