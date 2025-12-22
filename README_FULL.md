# SmartGov AI - Intelligent Government Services Assistant

A full-stack web application that helps citizens discover and apply for government schemes using AI-powered assistance, personalized recommendations, and voice interaction.

## Features ✨

### 🤖 AI Assistant
- **Intelligent Chatbot**: Chat-based AI assistant for government scheme queries
- **Prompt Engineering**: Controlled prompts for accurate, clear, and bilingual responses
- **Voice Interaction**: Speak to the AI assistant using Web Speech API
- **Session Management**: Multiple chat sessions with history tracking
- **Language Support**: English and Hindi responses

### 💼 Personalized Schemes
- **Smart Matching**: AI finds schemes based on age, occupation, state
- **Scheme Tracking**: View, save, and track applied schemes
- **Scheme Details**: Comprehensive information including eligibility, benefits, documents, and deadlines
- **Advanced Filtering**: Filter schemes by category and state

### 📋 Document Checklist
- **Automated Generation**: Generate personalized document checklists for schemes
- **Smart Requirements**: Documents based on age, occupation, and state
- **Completion Tracking**: Visual progress bars showing document completion %
- **Document Upload Ready**: Built for future document upload integration

### 🆔 Aadhar Verification
- **Secure Verification**: Verify Aadhar identity securely
- **Masked Display**: Secure display of masked Aadhar numbers
- **Verification Status**: Track verification status
- **Scheme Benefits**: Unlock additional scheme benefits after verification

### 👤 User Profile Management
- **Complete Profile**: Age, occupation, state, contact information
- **Preferences**: Language, notifications, communication preferences
- **Activity History**: Track viewed and applied schemes
- **Privacy & Security**: Secure profile management with token authentication

### 🔔 Smart Reminders
- **Deadline Alerts**: Get reminded about scheme application deadlines
- **Multiple Reminder Types**: Deadline, application, and completion reminders
- **Configurable Notifications**: Email, SMS, or both
- **Active Management**: Manage and mark reminders as sent/completed

### 🎨 Animated UI
- **Smooth Animations**: Fade-in, slide, bounce, and glow effects
- **Responsive Design**: Mobile-first design that works on all devices
- **Professional Styling**: Modern gradient backgrounds and card-based layout
- **Loading States**: Visual feedback for all async operations

## Tech Stack

### Backend
- **Framework**: Django 5.2
- **API**: Django REST Framework
- **Authentication**: Token-based authentication
- **Database**: SQLite (can be upgraded to PostgreSQL)
- **AI**: OpenAI GPT API integration
- **Task Queue**: Celery (for background tasks like reminders)
- **Cache**: Redis
- **API Documentation**: DRF Spectacular (Swagger UI)

### Frontend
- **Framework**: React 19
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with animations
- **Voice**: Web Speech API
- **State Management**: React Hooks & Local Storage

## Project Structure

```
smartgov-ai/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   ├── backend/
│   │   ├── settings.py      # Django configuration
│   │   ├── urls.py          # Main URL routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── users/
│   │   ├── models.py        # User, Aadhar, Preferences models
│   │   ├── views.py         # Auth, Profile APIs
│   │   ├── serializers.py
│   │   ├── admin.py
│   │   └── urls.py
│   ├── schemes/
│   │   ├── models.py        # Scheme, Checklist, Reminder models
│   │   ├── views.py         # Scheme, Document, Reminder APIs
│   │   ├── serializers.py
│   │   ├── admin.py
│   │   └── urls.py
│   └── chatbot/
│       ├── models.py        # Chat, Prompt Template models
│       ├── views.py         # Chat, AI APIs
│       ├── serializers.py
│       ├── admin.py
│       └── urls.py
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js           # Main app with routes
        ├── App.css
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── UserProfile.js
        │   ├── AIAssistant.js
        │   └── PersonalizedSchemes.js
        ├── components/
        │   └── Navbar.js
        ├── services/
        │   └── api.js       # All API calls
        └── styles/
            ├── animations.css
            ├── auth.css
            ├── navbar.css
            ├── chat.css
            ├── schemes.css
            ├── profile.css
            └── home.css
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- OpenAI API Key (for AI features)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd smartgov-ai/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   # .env
   OPENAI_API_KEY=your_openai_api_key_here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

Backend will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/api/docs/`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd smartgov-ai/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

Frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/auth/register/` - Register new user
- `POST /api/auth/auth/login/` - User login
- `POST /api/auth/auth/logout/` - User logout

### User Profile
- `GET /api/auth/profile/profile/` - Get user profile
- `PUT /api/auth/profile/update_profile/` - Update profile
- `GET /api/auth/profile/history/` - Get user activity history

### Aadhar Verification
- `POST /api/auth/aadhar/verify_aadhar/` - Verify Aadhar
- `GET /api/auth/aadhar/verification_status/` - Get verification status

### User Preferences
- `GET /api/auth/preferences/get_preferences/` - Get preferences
- `PUT /api/auth/preferences/update_preferences/` - Update preferences

### Schemes
- `GET /api/schemes/schemes/` - List all schemes
- `GET /api/schemes/schemes/personalized/` - Get personalized schemes
- `GET /api/schemes/schemes/saved_schemes/` - Get saved schemes
- `POST /api/schemes/schemes/save_scheme/` - Save a scheme
- `POST /api/schemes/schemes/track_view/` - Track scheme view

### Document Checklist
- `POST /api/schemes/documents/generate_checklist/` - Generate checklist
- `GET /api/schemes/documents/user_checklists/` - Get all checklists
- `PUT /api/schemes/documents/update_checklist/` - Update checklist

### Reminders
- `POST /api/schemes/reminders/create_reminder/` - Create reminder
- `GET /api/schemes/reminders/user_reminders/` - Get user reminders
- `PUT /api/schemes/reminders/mark_sent/` - Mark reminder as sent

### Chatbot
- `POST /api/chatbot/chatbot/send_message/` - Send chat message
- `POST /api/chatbot/chatbot/voice_input/` - Send voice message
- `GET /api/chatbot/sessions/` - Get chat sessions

## Features Breakdown

### Authentication & Security
✅ User registration with email and password  
✅ JWT/Token-based authentication  
✅ Secure Aadhar verification  
✅ Password validation  
✅ CORS enabled for frontend integration  

### AI Features
✅ OpenAI GPT integration  
✅ Controlled prompts for accuracy  
✅ Bilingual responses (English & Hindi)  
✅ Context-aware responses based on user profile  
✅ Chat history and session management  
✅ Voice-to-text using Web Speech API  
✅ Text-to-speech for responses  

### Personalization
✅ Profile-based scheme matching  
✅ Age, occupation, state filtering  
✅ Saved schemes bookmarking  
✅ User history tracking  
✅ Personalized document checklists  
✅ Language preferences  
✅ Notification preferences  

### User Experience
✅ Animated UI components  
✅ Loading states and spinners  
✅ Error handling and alerts  
✅ Progress indicators  
✅ Responsive mobile design  
✅ Dark mode ready  
✅ Smooth transitions and animations  

## Environment Variables

### Backend (.env)
```
DEBUG=True
OPENAI_API_KEY=your_api_key
GOOGLE_CLOUD_PROJECT=your_project
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
CELERY_BROKER_URL=redis://localhost:6379
CELERY_RESULT_BACKEND=redis://localhost:6379
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

## Database Models

### Users App
- **CustomUser**: Extended user model with profile info
- **AadharVerification**: Aadhar verification details
- **UserPreferences**: User communication & language preferences
- **UserHistory**: Activity history tracking

### Schemes App
- **Scheme**: Government scheme details
- **DocumentChecklist**: Personalized document requirements
- **SchemeHistory**: User interaction with schemes
- **SchemeReminder**: Deadline and application reminders
- **UserSavedScheme**: Bookmarked schemes

### Chatbot App
- **ChatSession**: Chat conversation sessions
- **ChatMessage**: Individual messages in a session
- **PromptTemplate**: Controlled prompts for AI responses
- **AIInteractionLog**: AI response quality tracking

## Future Enhancements

1. **Document Upload**: Upload and track document uploads
2. **Direct Application**: Submit applications directly through the platform
3. **Payment Integration**: Process scheme application fees
4. **Email/SMS Notifications**: Send actual emails and SMS reminders
5. **Video Tutorials**: Help videos for each scheme
6. **Mobile App**: Native iOS and Android apps
7. **Government Agency Integration**: Direct integration with government systems
8. **Advanced Analytics**: Track user behavior and scheme success rates
9. **Multi-language Support**: Support more regional languages
10. **Accessibility**: WCAG 2.1 compliance

## Contributing

1. Create a new branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@smartgov.ai or create an issue on the repository.

## Deployment

### Backend Deployment (Heroku, AWS, DigitalOcean)
1. Set up environment variables on your hosting platform
2. Create `Procfile`: `web: gunicorn backend.wsgi`
3. Use PostgreSQL for production (update `settings.py`)
4. Run migrations on deployment
5. Collect static files: `python manage.py collectstatic`

### Frontend Deployment (Vercel, Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `build/` directory
3. Set `REACT_APP_API_URL` environment variable

## Performance Optimizations

- Redis caching for schemes and user data
- Pagination for scheme listings
- Lazy loading of components
- Image optimization
- Code splitting and dynamic imports
- CSS-in-JS optimization

---

Built with ❤️ for Making Government Services Accessible
