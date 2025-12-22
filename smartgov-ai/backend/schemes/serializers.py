from rest_framework import serializers
from .models import (
    Scheme, DocumentChecklist, SchemeHistory,
    SchemeReminder, UserSavedScheme
)


class SchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scheme
        fields = [
            'id', 'name', 'category', 'description', 'eligibility',
            'documents', 'apply_link', 'deadline', 'age_min', 'age_max',
            'applicable_states', 'applicable_occupations', 'benefits',
            'application_process', 'contact_info', 'created_at', 'updated_at'
        ]


class DocumentChecklistSerializer(serializers.ModelSerializer):
    scheme_name = serializers.CharField(source='scheme.name', read_only=True)

    class Meta:
        model = DocumentChecklist
        fields = [
            'id', 'user', 'scheme', 'scheme_name', 'documents',
            'age', 'occupation', 'state', 'completion_percentage',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'completion_percentage', 'created_at', 'updated_at']


class SchemeHistorySerializer(serializers.ModelSerializer):
    scheme_name = serializers.CharField(source='scheme.name', read_only=True)

    class Meta:
        model = SchemeHistory
        fields = ['id', 'user', 'scheme', 'scheme_name', 'action', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class SchemeReminderSerializer(serializers.ModelSerializer):
    scheme_name = serializers.CharField(source='scheme.name', read_only=True)
    days_until_deadline = serializers.SerializerMethodField()

    class Meta:
        model = SchemeReminder
        fields = [
            'id', 'user', 'scheme', 'scheme_name', 'reminder_date',
            'status', 'reminder_type', 'sent_at', 'days_until_deadline', 'created_at'
        ]
        read_only_fields = ['id', 'sent_at', 'created_at']

    def get_days_until_deadline(self, obj):
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        delta = obj.reminder_date - now
        return delta.days if delta.days >= 0 else 0


class UserSavedSchemeSerializer(serializers.ModelSerializer):
    scheme = SchemeSerializer(read_only=True)

    class Meta:
        model = UserSavedScheme
        fields = ['id', 'user', 'scheme', 'saved_at']
        read_only_fields = ['id', 'saved_at']
