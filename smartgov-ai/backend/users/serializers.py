from rest_framework import serializers
from .models import CustomUser, AadharVerification, UserPreferences, UserHistory


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'age', 'occupation', 'state', 'phone_number',
            'aadhar_number', 'aadhar_verified', 'profile_picture',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'aadhar_number', 'aadhar_verified', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'age', 'occupation', 'state',
            'phone_number'
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class AadharVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AadharVerification
        fields = ['id', 'user', 'aadhar_number', 'masked_aadhar', 'verification_status', 'verification_date']
        read_only_fields = ['id', 'masked_aadhar', 'verification_date']


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = [
            'id', 'user', 'language', 'enable_notifications',
            'enable_voice', 'enable_email_reminders', 'preferred_communication'
        ]


class UserHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHistory
        fields = ['id', 'user', 'action', 'description', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class UserProfileSerializer(serializers.ModelSerializer):
    preferences = UserPreferencesSerializer(read_only=True)
    aadhar_verification = AadharVerificationSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'age', 'occupation', 'state', 'phone_number',
            'aadhar_verified', 'profile_picture', 'preferences',
            'aadhar_verification', 'created_at'
        ]
