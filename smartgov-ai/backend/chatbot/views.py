from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
import os
import json

try:
    import openai
except ImportError:
    openai = None

from .models import ChatSession, ChatMessage, PromptTemplate, AIInteractionLog
from .serializers import (
    ChatSessionSerializer, ChatMessageSerializer,
    PromptTemplateSerializer, AIInteractionLogSerializer
)


class ChatSessionViewSet(viewsets.ModelViewSet):
    """
    API endpoints for chat sessions
    """
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages in a chat session"""
        session = self.get_object()
        messages = session.messages.all()
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)


class ChatBotViewSet(viewsets.ViewSet):
    """
    AI-powered chatbot for government schemes assistance
    Supports bilingual prompts (English and Hindi) with voice interaction
    """
    permission_classes = [IsAuthenticated]

    def _get_prompt_template(self, category, language='en'):
        """Get appropriate prompt template based on category"""
        try:
            template = PromptTemplate.objects.get(category=category)
            return template
        except PromptTemplate.DoesNotExist:
            return None

    def _build_system_message(self, template, user_profile):
        """Build system message with user context"""
        system_msg = template.system_instructions if template else ""
        context = f"""
You are a helpful AI assistant for government schemes in India.
User Profile:
- Age: {user_profile.get('age', 'N/A')}
- Occupation: {user_profile.get('occupation', 'N/A')}
- State: {user_profile.get('state', 'N/A')}
- Aadhar Verified: {user_profile.get('aadhar_verified', False)}

Provide accurate, clear, and helpful information about government schemes.
"""
        return system_msg + context

    def _call_openai(self, system_message, user_message, language='en', temperature=0.7, max_tokens=500):
        """Call OpenAI API with controlled prompts"""
        if not openai:
            return "AI service not available. Please try again later."

        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                return "OpenAI API key not configured. Please contact administrator."

            openai.api_key = api_key

            messages = [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ]

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )

            return response.choices[0].message.content
        except Exception as e:
            return f"Error communicating with AI service: {str(e)}"

    @action(detail=False, methods=['post'])
    def send_message(self, request):
        """
        Send a message to the chatbot
        Supports text, voice input, and bilingual responses
        """
        user_message = request.data.get('message', '')
        session_id = request.data.get('session_id')
        language = request.data.get('language', 'en')
        category = request.data.get('category', 'general')  # scheme_info, eligibility, documents, etc.

        if not user_message:
            return Response({
                'error': 'Message is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get or create session
            if session_id:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            else:
                session = ChatSession.objects.create(user=request.user)

            # Get user profile info
            user_profile = {
                'age': request.user.age,
                'occupation': request.user.occupation,
                'state': request.user.state,
                'aadhar_verified': request.user.aadhar_verified
            }

            # Get prompt template
            template = self._get_prompt_template(category, language)

            # Build system message
            system_message = self._build_system_message(template, user_profile)

            # Adjust prompt based on language
            if language == 'hi':
                user_message_with_lang = f"{user_message}\n\n[Please respond in Hindi if possible, with English terms where necessary]"
            else:
                user_message_with_lang = user_message

            # Get AI response
            temperature = template.temperature if template else 0.7
            max_tokens = template.max_tokens if template else 500

            ai_response = self._call_openai(
                system_message,
                user_message_with_lang,
                language=language,
                temperature=temperature,
                max_tokens=max_tokens
            )

            # Store user message
            user_msg = ChatMessage.objects.create(
                session=session,
                user=request.user,
                role='user',
                message=user_message,
                language=language
            )

            # Store AI response
            assistant_msg = ChatMessage.objects.create(
                session=session,
                user=request.user,
                role='assistant',
                message=ai_response,
                language=language
            )

            # Log interaction
            AIInteractionLog.objects.create(
                user=request.user,
                user_input=user_message,
                ai_response=ai_response,
                prompt_template=template,
                language_used=language
            )

            # Update session title if first message
            if session.messages.count() == 2:
                session.title = user_message[:50]
                session.save()

            return Response({
                'session_id': session.id,
                'user_message': user_message,
                'ai_response': ai_response,
                'language': language,
                'timestamp': assistant_msg.timestamp
            }, status=status.HTTP_201_CREATED)

        except ChatSession.DoesNotExist:
            return Response({
                'error': 'Chat session not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def voice_input(self, request):
        """
        Handle voice input - convert speech to text and process
        """
        if 'voice_file' not in request.FILES:
            return Response({
                'error': 'voice_file is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        voice_file = request.FILES['voice_file']
        session_id = request.data.get('session_id')
        language = request.data.get('language', 'en')

        try:
            # In production, use Google Cloud Speech-to-Text or similar
            # For now, we'll store the voice file and indicate it was received
            session = ChatSession.objects.get(id=session_id, user=request.user)

            # Create message with voice input
            msg = ChatMessage.objects.create(
                session=session,
                user=request.user,
                role='user',
                message='[Voice message received]',
                voice_input=voice_file,
                language=language
            )

            return Response({
                'message_id': msg.id,
                'message': 'Voice message received. Processing...'
            }, status=status.HTTP_201_CREATED)

        except ChatSession.DoesNotExist:
            return Response({
                'error': 'Chat session not found'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def sessions(self, request):
        """Get all chat sessions for user"""
        sessions = ChatSession.objects.filter(user=request.user).order_by('-updated_at')
        serializer = ChatSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def rate_response(self, request):
        """Rate the accuracy of AI response"""
        log_id = request.data.get('log_id')
        rating = request.data.get('rating')  # 1-5

        if not log_id or not rating:
            return Response({
                'error': 'log_id and rating are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            log = AIInteractionLog.objects.get(id=log_id, user=request.user)
            log.accuracy_rating = rating
            log.save()
            serializer = AIInteractionLogSerializer(log)
            return Response(serializer.data)
        except AIInteractionLog.DoesNotExist:
            return Response({
                'error': 'Interaction log not found'
            }, status=status.HTTP_404_NOT_FOUND)


class PromptTemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing prompt templates
    Used for controlling AI responses for accuracy and clarity
    """
    queryset = PromptTemplate.objects.all()
    serializer_class = PromptTemplateSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get prompt template by category"""
        category = request.query_params.get('category')
        if not category:
            return Response({
                'error': 'category parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            template = PromptTemplate.objects.get(category=category)
            serializer = PromptTemplateSerializer(template)
            return Response(serializer.data)
        except PromptTemplate.DoesNotExist:
            return Response({
                'error': 'Template not found for this category'
            }, status=status.HTTP_404_NOT_FOUND)
