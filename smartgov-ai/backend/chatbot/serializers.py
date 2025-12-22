from rest_framework import serializers
from .models import ChatSession, ChatMessage, PromptTemplate, AIInteractionLog


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'session', 'user', 'role', 'message',
            'voice_input', 'voice_output', 'timestamp', 'language'
        ]
        read_only_fields = ['id', 'timestamp']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'user', 'title', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PromptTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromptTemplate
        fields = [
            'id', 'name', 'category', 'english_prompt', 'hindi_prompt',
            'system_instructions', 'response_format', 'temperature',
            'max_tokens', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AIInteractionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInteractionLog
        fields = [
            'id', 'user', 'user_input', 'ai_response',
            'prompt_template', 'language_used', 'accuracy_rating', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']
