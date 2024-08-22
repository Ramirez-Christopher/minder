from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class MovieSearchTests(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Obtain a JWT token for the user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Set the token in the request headers
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_movie_search_success(self):
        url = reverse('movie-search')  # Assuming you have set up the URL pattern for this view
        data = {'movie_name': 'Avengers'}  # Replace 'Avengers' with the movie name you want to search

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)  # Assuming the API response contains a 'results' key

    def test_movie_search_missing_name(self):
        url = reverse('movie-search')  # Assuming you have set up the URL pattern for this view
        data = {}  # Empty data to simulate missing movie name

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)  # Assuming the API response contains an 'error' key

    def test_movie_search_failed_request(self):
        url = reverse('movie-search')  # Assuming you have set up the URL pattern for this view
        data = {'movie_name': 'NonexistentMovie'}  # Replace 'NonexistentMovie' with a movie name that doesn't exist

        response = self.client.post(url, data, format='json')
        
        # Assuming the API returns a 200 OK status with an empty result set or an error message
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)  # Assuming the API response contains a 'results' key
        self.assertEqual(len(response.data['results']), 0)  # Assuming the results are empty for a non-existent movie

class RecommendationSearchTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Obtain a JWT token for the user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Set the token in the request headers
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_recommendation_search_success(self):
        movie_id = 12345
        url = reverse("movie-reccomendations")
        data = {"movie_id": movie_id}

        with patch("requests.get") as mock_get:
            mock_get.return_value.status_code = 200
            mock_get.return_value.json.return_value = {"results": [{"title": "Movie 1"}, {"title": "Movie 2"}]}

            response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)