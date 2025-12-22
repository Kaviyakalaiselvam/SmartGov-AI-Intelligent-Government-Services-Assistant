from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, UserViewSet, AadharVerificationViewSet, UserPreferencesViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'profile', UserViewSet, basename='user')
router.register(r'aadhar', AadharVerificationViewSet, basename='aadhar')
router.register(r'preferences', UserPreferencesViewSet, basename='preferences')

app_name = 'users'

urlpatterns = [
    path('', include(router.urls)),
]
