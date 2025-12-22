from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, AadharVerification, UserPreferences, UserHistory


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('age', 'occupation', 'state', 'phone_number', 'aadhar_number', 'aadhar_verified', 'profile_picture')}),
    )
    list_display = ['username', 'email', 'first_name', 'last_name', 'age', 'state', 'aadhar_verified']
    search_fields = ['username', 'email', 'aadhar_number']


@admin.register(AadharVerification)
class AadharVerificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'masked_aadhar', 'verification_status', 'verification_date']
    list_filter = ['verification_status', 'verification_date']
    search_fields = ['user__username', 'aadhar_number']
    readonly_fields = ['masked_aadhar', 'verification_date']


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ['user', 'language', 'enable_notifications', 'enable_voice', 'enable_email_reminders']
    list_filter = ['language', 'enable_notifications', 'enable_voice']
    search_fields = ['user__username']


@admin.register(UserHistory)
class UserHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'timestamp']
    list_filter = ['action', 'timestamp']
    search_fields = ['user__username', 'action']
    readonly_fields = ['timestamp']
