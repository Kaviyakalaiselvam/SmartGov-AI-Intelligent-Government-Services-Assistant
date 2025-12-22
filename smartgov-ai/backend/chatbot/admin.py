from django.contrib import admin
from .models import ChatSession, ChatMessage, PromptTemplate, AIInteractionLog


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['session', 'user', 'role', 'language', 'timestamp']
    list_filter = ['role', 'language', 'timestamp']
    search_fields = ['session__title', 'user__username', 'message']
    readonly_fields = ['timestamp']


@admin.register(PromptTemplate)
class PromptTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'temperature', 'max_tokens', 'created_at']
    list_filter = ['category', 'temperature', 'created_at']
    search_fields = ['name', 'category']
    readonly_fields = ['created_at']


@admin.register(AIInteractionLog)
class AIInteractionLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'language_used', 'accuracy_rating', 'timestamp']
    list_filter = ['language_used', 'accuracy_rating', 'timestamp']
    search_fields = ['user__username', 'user_input']
    readonly_fields = ['timestamp']
