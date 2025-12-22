from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
import json

from .models import (
    Scheme, DocumentChecklist, SchemeHistory,
    SchemeReminder, UserSavedScheme
)
from .serializers import (
    SchemeSerializer, DocumentChecklistSerializer,
    SchemeHistorySerializer, SchemeReminderSerializer,
    UserSavedSchemeSerializer
)


class SchemeViewSet(viewsets.ModelViewSet):
    """
    API endpoints for government schemes
    """
    queryset = Scheme.objects.all()
    serializer_class = SchemeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Scheme.objects.all()
        category = self.request.query_params.get('category')
        state = self.request.query_params.get('state')

        if category:
            queryset = queryset.filter(category=category)
        if state:
            queryset = queryset.filter(applicable_states__icontains=state)

        return queryset

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def personalized(self, request):
        """
        Get schemes personalized based on user profile (age, occupation, state)
        """
        user = request.user

        if not all([user.age, user.occupation, user.state]):
            return Response({
                'error': 'User profile incomplete. Please update age, occupation, and state.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Filter schemes based on user profile
        schemes = Scheme.objects.filter(
            applicable_states__icontains=user.state
        ).filter(
            Q(age_min__isnull=True) | Q(age_min__lte=user.age)
        ).filter(
            Q(age_max__isnull=True) | Q(age_max__gte=user.age)
        ).filter(
            Q(applicable_occupations__isnull=True) |
            Q(applicable_occupations__icontains=user.occupation)
        )

        # Track as viewed
        for scheme in schemes:
            SchemeHistory.objects.get_or_create(
                user=user,
                scheme=scheme,
                action='viewed',
                defaults={'timestamp': datetime.now()}
            )

        serializer = SchemeSerializer(schemes, many=True)
        return Response({
            'message': 'Personalized schemes based on your profile',
            'count': schemes.count(),
            'schemes': serializer.data
        })

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def track_view(self, request):
        """Track that user viewed a scheme"""
        scheme_id = request.data.get('scheme_id')

        try:
            scheme = Scheme.objects.get(id=scheme_id)
            SchemeHistory.objects.create(
                user=request.user,
                scheme=scheme,
                action='viewed'
            )
            return Response({'message': 'Scheme view tracked'})
        except Scheme.DoesNotExist:
            return Response({'error': 'Scheme not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def save_scheme(self, request):
        """Save/bookmark a scheme"""
        scheme_id = request.data.get('scheme_id')

        try:
            scheme = Scheme.objects.get(id=scheme_id)
            saved, created = UserSavedScheme.objects.get_or_create(
                user=request.user,
                scheme=scheme
            )
            message = 'Scheme saved' if created else 'Scheme already saved'
            return Response({'message': message}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Scheme.DoesNotExist:
            return Response({'error': 'Scheme not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def saved_schemes(self, request):
        """Get user's saved schemes"""
        saved = UserSavedScheme.objects.filter(user=request.user).select_related('scheme')
        serializer = UserSavedSchemeSerializer(saved, many=True)
        return Response(serializer.data)


class DocumentChecklistViewSet(viewsets.ViewSet):
    """
    API endpoints for personalized document checklists
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def generate_checklist(self, request):
        """
        Generate personalized document checklist based on user profile and scheme
        AI generates required documents based on age, occupation, and state
        """
        scheme_id = request.data.get('scheme_id')

        if not scheme_id:
            return Response({
                'error': 'scheme_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            scheme = Scheme.objects.get(id=scheme_id)
            user = request.user

            # Generate document list based on user profile
            documents = {
                'identity_proof': False,
                'address_proof': False,
                'age_proof': False,
                'income_certificate': False,
                'occupation_certificate': False,
                'state_residency_proof': False,
                'bank_account_details': False,
                'aadhar_card': False,
                'application_form': False,
                'supporting_documents': False
            }

            # Add specific documents based on scheme requirements
            scheme_docs = [doc.strip() for doc in scheme.documents.split(',') if doc.strip()]
            for doc in scheme_docs:
                doc_key = doc.lower().replace(' ', '_')
                documents[doc_key] = False

            # Create or update checklist
            checklist, created = DocumentChecklist.objects.update_or_create(
                user=user,
                scheme=scheme,
                defaults={
                    'documents': documents,
                    'age': user.age or 0,
                    'occupation': user.occupation or '',
                    'state': user.state or '',
                    'completion_percentage': 0
                }
            )

            serializer = DocumentChecklistSerializer(checklist)
            return Response({
                'message': 'Document checklist generated',
                'checklist': serializer.data
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        except Scheme.DoesNotExist:
            return Response({
                'error': 'Scheme not found'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def user_checklists(self, request):
        """Get all document checklists for user"""
        checklists = DocumentChecklist.objects.filter(user=request.user)
        serializer = DocumentChecklistSerializer(checklists, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def update_checklist(self, request):
        """Update document checklist status"""
        checklist_id = request.data.get('checklist_id')
        documents = request.data.get('documents')

        try:
            checklist = DocumentChecklist.objects.get(id=checklist_id, user=request.user)
            checklist.documents = documents
            checklist.calculate_completion()
            serializer = DocumentChecklistSerializer(checklist)
            return Response(serializer.data)
        except DocumentChecklist.DoesNotExist:
            return Response({
                'error': 'Checklist not found'
            }, status=status.HTTP_404_NOT_FOUND)


class SchemeHistoryViewSet(viewsets.ViewSet):
    """
    API endpoints for scheme history and user activity tracking
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def user_history(self, request):
        """Get user's scheme interaction history"""
        history = SchemeHistory.objects.filter(user=request.user).select_related('scheme')
        action_filter = request.query_params.get('action')

        if action_filter:
            history = history.filter(action=action_filter)

        serializer = SchemeHistorySerializer(history, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def applied_schemes(self, request):
        """Get schemes user has applied for"""
        applied = SchemeHistory.objects.filter(
            user=request.user,
            action='applied'
        ).select_related('scheme')
        serializer = SchemeHistorySerializer(applied, many=True)
        return Response(serializer.data)


class SchemeReminderViewSet(viewsets.ViewSet):
    """
    API endpoints for scheme deadline reminders
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def create_reminder(self, request):
        """Create a scheme deadline reminder"""
        scheme_id = request.data.get('scheme_id')
        reminder_date = request.data.get('reminder_date')
        reminder_type = request.data.get('reminder_type', 'deadline')

        if not scheme_id or not reminder_date:
            return Response({
                'error': 'scheme_id and reminder_date are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            scheme = Scheme.objects.get(id=scheme_id)
            reminder = SchemeReminder.objects.create(
                user=request.user,
                scheme=scheme,
                reminder_date=reminder_date,
                reminder_type=reminder_type
            )
            serializer = SchemeReminderSerializer(reminder)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Scheme.DoesNotExist:
            return Response({
                'error': 'Scheme not found'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def user_reminders(self, request):
        """Get user's active reminders"""
        reminders = SchemeReminder.objects.filter(
            user=request.user,
            status='active'
        ).select_related('scheme').order_by('reminder_date')

        serializer = SchemeReminderSerializer(reminders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def mark_sent(self, request):
        """Mark reminder as sent"""
        reminder_id = request.data.get('reminder_id')

        try:
            reminder = SchemeReminder.objects.get(id=reminder_id, user=request.user)
            reminder.status = 'sent'
            reminder.sent_at = timezone.now()
            reminder.save()
            serializer = SchemeReminderSerializer(reminder)
            return Response(serializer.data)
        except SchemeReminder.DoesNotExist:
            return Response({
                'error': 'Reminder not found'
            }, status=status.HTTP_404_NOT_FOUND)
