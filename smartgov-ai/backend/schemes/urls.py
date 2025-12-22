from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SchemeViewSet, DocumentChecklistViewSet,
    SchemeHistoryViewSet, SchemeReminderViewSet
)

router = DefaultRouter()
router.register(r'schemes', SchemeViewSet, basename='scheme')
router.register(r'documents', DocumentChecklistViewSet, basename='document-checklist')
router.register(r'history', SchemeHistoryViewSet, basename='scheme-history')
router.register(r'reminders', SchemeReminderViewSet, basename='reminder')

app_name = 'schemes'

urlpatterns = [
    path('', include(router.urls)),
]
