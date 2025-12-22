from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta

User = get_user_model()

class Scheme(models.Model):
    """Model to store government schemes information"""
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    eligibility = models.TextField()
    documents = models.TextField()
    apply_link = models.URLField()
    deadline = models.DateTimeField(null=True, blank=True)
    age_min = models.IntegerField(null=True, blank=True)
    age_max = models.IntegerField(null=True, blank=True)
    applicable_states = models.CharField(max_length=500, help_text="Comma-separated list of states")
    applicable_occupations = models.CharField(max_length=500, null=True, blank=True, help_text="Comma-separated list of occupations")
    benefits = models.TextField()
    application_process = models.TextField()
    contact_info = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Scheme'
        verbose_name_plural = 'Schemes'

    def __str__(self):
        return self.name


class DocumentChecklist(models.Model):
    """Model to store required documents for schemes based on user profile"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='document_checklists')
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='document_checklists')
    documents = models.JSONField(default=dict)  # {document_name: is_uploaded}
    age = models.IntegerField()
    occupation = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    completion_percentage = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'scheme')
        verbose_name = 'Document Checklist'
        verbose_name_plural = 'Document Checklists'

    def __str__(self):
        return f"Checklist for {self.user.username} - {self.scheme.name}"

    def calculate_completion(self):
        """Calculate document completion percentage"""
        if not self.documents:
            return 0
        total = len(self.documents)
        completed = sum(1 for v in self.documents.values() if v)
        self.completion_percentage = (completed / total) * 100 if total > 0 else 0
        self.save()
        return self.completion_percentage


class SchemeHistory(models.Model):
    """Model to track scheme views and applications by users"""
    ACTION_CHOICES = [
        ('viewed', 'Viewed'),
        ('applied', 'Applied'),
        ('saved', 'Saved'),
        ('shared', 'Shared'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheme_history')
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='user_history')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Scheme History'
        verbose_name_plural = 'Scheme Histories'

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.scheme.name}"


class SchemeReminder(models.Model):
    """Model to manage scheme deadline reminders"""
    REMINDER_STATUS_CHOICES = [
        ('active', 'Active'),
        ('sent', 'Sent'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheme_reminders')
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='reminders')
    reminder_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=REMINDER_STATUS_CHOICES, default='active')
    reminder_type = models.CharField(
        max_length=20,
        choices=[('deadline', 'Deadline'), ('application', 'Application Started'), ('completion', 'Document Completion')],
        default='deadline'
    )
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['reminder_date']
        verbose_name = 'Scheme Reminder'
        verbose_name_plural = 'Scheme Reminders'

    def __str__(self):
        return f"Reminder for {self.user.username} - {self.scheme.name}"


class UserSavedScheme(models.Model):
    """Model to store user's saved/bookmarked schemes"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_schemes')
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'scheme')
        verbose_name = 'User Saved Scheme'
        verbose_name_plural = 'User Saved Schemes'

    def __str__(self):
        return f"{self.user.username} saved {self.scheme.name}"
