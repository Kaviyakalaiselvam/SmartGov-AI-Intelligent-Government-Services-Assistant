from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatSession(models.Model):
    """Model to store chat sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    title = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Chat Session'
        verbose_name_plural = 'Chat Sessions'

    def __str__(self):
        return f"Chat - {self.user.username} ({self.created_at.date()})"


class ChatMessage(models.Model):
    """Model to store individual chat messages"""
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ]

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    message = models.TextField()
    voice_input = models.FileField(upload_to='voice_messages/', null=True, blank=True)
    voice_output = models.FileField(upload_to='voice_responses/', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    language = models.CharField(max_length=10, default='en')

    class Meta:
        ordering = ['timestamp']
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'

    def __str__(self):
        return f"{self.role}: {self.message[:50]}"


class PromptTemplate(models.Model):
    """Model to store controlled prompts for AI responses"""
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, help_text="e.g., scheme_info, document_guidance, eligibility")
    english_prompt = models.TextField()
    hindi_prompt = models.TextField()
    system_instructions = models.TextField()
    response_format = models.CharField(
        max_length=50,
        choices=[('text', 'Text'), ('json', 'JSON'), ('list', 'List'), ('structured', 'Structured')],
        default='text'
    )
    temperature = models.FloatField(default=0.7, help_text="Creativity level 0-1")
    max_tokens = models.IntegerField(default=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Prompt Template'
        verbose_name_plural = 'Prompt Templates'

    def __str__(self):
        return self.name


class AIInteractionLog(models.Model):
    """Model to log all AI interactions for monitoring and improvement"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_logs')
    user_input = models.TextField()
    ai_response = models.TextField()
    prompt_template = models.ForeignKey(PromptTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    language_used = models.CharField(max_length=10)
    accuracy_rating = models.IntegerField(null=True, blank=True, help_text="User rating 1-5")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'AI Interaction Log'
        verbose_name_plural = 'AI Interaction Logs'

    def __str__(self):
        return f"Interaction - {self.user.username} ({self.timestamp.date()})"
