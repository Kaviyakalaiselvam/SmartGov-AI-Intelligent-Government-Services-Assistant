from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

class CustomUser(AbstractUser):
    """Extended user model with additional fields"""
    age = models.IntegerField(null=True, blank=True)
    occupation = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    aadhar_number = models.CharField(max_length=12, unique=True, null=True, blank=True)
    aadhar_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'custom_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email or self.username


class AadharVerification(models.Model):
    """Model to store Aadhar verification details"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='aadhar_verification')
    aadhar_number = models.CharField(max_length=12)
    masked_aadhar = models.CharField(max_length=12)  # Last 4 digits visible
    verification_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('verified', 'Verified'), ('failed', 'Failed')],
        default='pending'
    )
    verification_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Aadhar Verification'
        verbose_name_plural = 'Aadhar Verifications'

    def __str__(self):
        return f"{self.user.username} - {self.masked_aadhar}"


class UserPreferences(models.Model):
    """Model to store user preferences"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='preferences')
    language = models.CharField(
        max_length=10,
        choices=[('en', 'English'), ('hi', 'Hindi')],
        default='en'
    )
    enable_notifications = models.BooleanField(default=True)
    enable_voice = models.BooleanField(default=True)
    enable_email_reminders = models.BooleanField(default=True)
    preferred_communication = models.CharField(
        max_length=20,
        choices=[('email', 'Email'), ('sms', 'SMS'), ('both', 'Both')],
        default='email'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Preference'
        verbose_name_plural = 'User Preferences'

    def __str__(self):
        return f"Preferences for {self.user.username}"


class UserHistory(models.Model):
    """Model to track user activity history"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=100)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'User History'
        verbose_name_plural = 'User Histories'

    def __str__(self):
        return f"{self.user.username} - {self.action}"
