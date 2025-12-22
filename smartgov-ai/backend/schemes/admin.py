from django.contrib import admin
from .models import (
    Scheme, DocumentChecklist, SchemeHistory,
    SchemeReminder, UserSavedScheme
)


@admin.register(Scheme)
class SchemeAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'deadline', 'created_at']
    list_filter = ['category', 'deadline', 'created_at']
    search_fields = ['name', 'description', 'applicable_states']
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'category', 'description', 'benefits')}),
        ('Eligibility', {'fields': ('age_min', 'age_max', 'applicable_states', 'applicable_occupations')}),
        ('Documents & Process', {'fields': ('documents', 'application_process', 'apply_link')}),
        ('Contact', {'fields': ('contact_info',)}),
        ('Deadline', {'fields': ('deadline',)}),
    )


@admin.register(DocumentChecklist)
class DocumentChecklistAdmin(admin.ModelAdmin):
    list_display = ['user', 'scheme', 'completion_percentage', 'created_at']
    list_filter = ['completion_percentage', 'created_at', 'state']
    search_fields = ['user__username', 'scheme__name']


@admin.register(SchemeHistory)
class SchemeHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'scheme', 'action', 'timestamp']
    list_filter = ['action', 'timestamp']
    search_fields = ['user__username', 'scheme__name']
    readonly_fields = ['timestamp']


@admin.register(SchemeReminder)
class SchemeReminderAdmin(admin.ModelAdmin):
    list_display = ['user', 'scheme', 'reminder_date', 'status', 'reminder_type']
    list_filter = ['status', 'reminder_type', 'reminder_date']
    search_fields = ['user__username', 'scheme__name']


@admin.register(UserSavedScheme)
class UserSavedSchemeAdmin(admin.ModelAdmin):
    list_display = ['user', 'scheme', 'saved_at']
    list_filter = ['saved_at']
    search_fields = ['user__username', 'scheme__name']
    readonly_fields = ['saved_at']
