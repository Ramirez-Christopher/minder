from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Note
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class= NoteSerializer
    permission_classes= [IsAuthenticated] #only authenticated users can interact with this

    def get_queryset(self):
        user= self.request.user #to get user interacting with this root
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid(): #checks to see if data passed to serializer is valid
            serializer.save(author=self.request.user) #add name of author to note and create
        else:
            print(serializer.errors) # send error
    
class NoteDelete(generics.DestroyAPIView):
    serializer_class= NoteSerializer
    permission_classes= [IsAuthenticated] #only authenticated users can interact with this

    def get_queryset(self):
        user= self.request.user #to get user interacting with this root
        return Note.objects.filter(author=user)

class MovieSearch(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can interact with this

    def post(self, request, *args, **kwargs):
        movie_name = request.data.get('movie_name')  # Get the movie name from the request data
        if not movie_name:
            return Response({"error": "Movie name is required"}, status=400)

        api_key = os.getenv("TMDB_API_KEY")  # Get the TMDB API key from environment variables
        if not api_key:
            return Response({"error": "API key is missing"}, status=500)

        url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={movie_name}"

        response = requests.get(url)
        if response.status_code != 200:
            return Response({"error": "Failed to fetch data from TMDB"}, status=response.status_code)

        data = response.json()
        return Response(data)  # Return the data to the frontend

class RecommendationSearch(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        movie_id = request.data.get('movie_id')  # Get the movie ID from the request data
        if not movie_id:
            return Response({"error": "Movie ID is required"}, status=400)

        api_key = os.getenv("TMDB_API_KEY")  # Get the TMDB API key from environment variables
        if not api_key:
            return Response({"error": "API key is missing"}, status=500)

        url = f"https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key={api_key}"

        response = requests.get(url)
        if response.status_code != 200:
            return Response({"error": "Failed to fetch data from TMDB"}, status=response.status_code)

        data = response.json()
        return Response(data)  # Return the data to the frontend



