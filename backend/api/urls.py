from django.urls import path
from . import views

urlpatterns= [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
   path('movie-search/', views.MovieSearch.as_view(), name='movie-search'),
]