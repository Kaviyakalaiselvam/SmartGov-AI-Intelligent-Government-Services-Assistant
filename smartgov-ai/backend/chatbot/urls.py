from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatSessionViewSet, ChatBotViewSet, PromptTemplateViewSet

router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='chat-session')
router.register(r'chatbot', ChatBotViewSet, basename='chatbot')
router.register(r'prompts', PromptTemplateViewSet, basename='prompt-template')

app_name = 'chatbot'

urlpatterns = [
    path('', include(router.urls)),
]
