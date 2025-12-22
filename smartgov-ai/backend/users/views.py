from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from datetime import datetime, timedelta

from .models import CustomUser, AadharVerification, UserPreferences, UserHistory
from .serializers import (
    CustomUserSerializer, UserRegistrationSerializer,
    AadharVerificationSerializer, UserPreferencesSerializer,
    UserHistorySerializer, UserProfileSerializer
)


class AuthViewSet(viewsets.ViewSet):
    """
    API endpoint for user authentication (registration, login, logout)
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        """User registration"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create user preferences
            UserPreferences.objects.create(user=user)
            # Create token
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'User registered successfully',
                'user': CustomUserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """User login"""
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            # Log user action
            UserHistory.objects.create(
                user=user,
                action='login',
                description=f'User logged in at {datetime.now()}'
            )
            return Response({
                'message': 'Login successful',
                'user': CustomUserSerializer(user).data,
                'token': token.key
            })
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """User logout"""
        request.user.auth_token.delete()
        UserHistory.objects.create(
            user=request.user,
            action='logout',
            description=f'User logged out at {datetime.now()}'
        )
        return Response({'message': 'Logged out successfully'})


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoints for user profile management
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get user profile with preferences and history"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update user profile"""
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            UserHistory.objects.create(
                user=user,
                action='profile_update',
                description='User updated their profile'
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get user activity history"""
        history = UserHistory.objects.filter(user=request.user)
        serializer = UserHistorySerializer(history, many=True)
        return Response(serializer.data)


class AadharVerificationViewSet(viewsets.ViewSet):
    """
    API endpoints for Aadhar verification
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def verify_aadhar(self, request):
        """
        Verify Aadhar number
        In production, this would call actual Aadhar verification service
        """
        aadhar_number = request.data.get('aadhar_number')

        if not aadhar_number or len(aadhar_number) != 12:
            return Response({
                'error': 'Invalid Aadhar number'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if already verified
            existing = AadharVerification.objects.filter(
                user=request.user,
                verification_status='verified'
            ).first()

            if existing:
                return Response({
                    'message': 'Aadhar already verified',
                    'masked_aadhar': existing.masked_aadhar
                })

            # Create or update verification record
            verification, created = AadharVerification.objects.get_or_create(
                user=request.user,
                defaults={
                    'aadhar_number': aadhar_number,
                    'masked_aadhar': 'XXXX-XXXX-' + aadhar_number[-4:]
                }
            )

            # Simulate verification (in production, call actual API)
            verification.verification_status = 'verified'
            verification.verification_date = datetime.now()
            verification.save()

            # Update user
            request.user.aadhar_number = aadhar_number
            request.user.aadhar_verified = True
            request.user.save()

            UserHistory.objects.create(
                user=request.user,
                action='aadhar_verification',
                description='Aadhar verified successfully'
            )

            return Response({
                'message': 'Aadhar verified successfully',
                'masked_aadhar': verification.masked_aadhar
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def verification_status(self, request):
        """Get Aadhar verification status"""
        verification = AadharVerification.objects.filter(
            user=request.user
        ).first()

        if verification:
            serializer = AadharVerificationSerializer(verification)
            return Response(serializer.data)
        return Response({
            'verification_status': 'pending'
        })


class UserPreferencesViewSet(viewsets.ViewSet):
    """
    API endpoints for user preferences
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def get_preferences(self, request):
        """Get user preferences"""
        preferences, created = UserPreferences.objects.get_or_create(
            user=request.user
        )
        serializer = UserPreferencesSerializer(preferences)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def update_preferences(self, request):
        """Update user preferences"""
        preferences, created = UserPreferences.objects.get_or_create(
            user=request.user
        )
        serializer = UserPreferencesSerializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

