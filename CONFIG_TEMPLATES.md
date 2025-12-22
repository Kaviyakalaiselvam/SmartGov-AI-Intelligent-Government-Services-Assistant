# SmartGov AI - Configuration Templates

Ready-to-use environment and configuration files.

## Backend .env Template

Save this as `backend/.env`:

### Development Environment
```
# Django Settings
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production
ENVIRONMENT=development
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3
# For PostgreSQL use:
# DATABASE_URL=postgresql://user:password@localhost:5432/smartgov_db

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.5
OPENAI_MAX_TOKENS=500

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Email Configuration (Console backend for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@smartgov.ai

# Celery Configuration (Optional)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Google Cloud (Optional, for advanced voice features)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Cache Configuration
CACHE_URL=redis://localhost:6379/1
```

### Production Environment
```
# Django Settings
DEBUG=False
SECRET_KEY=your-very-secure-secret-key-min-50-chars
ENVIRONMENT=production
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com

# Database (Use PostgreSQL in production)
DATABASE_URL=postgresql://user:securepassword@db-host:5432/smartgov_db

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.5
OPENAI_MAX_TOKENS=500

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email Configuration (SendGrid or AWS SES)
EMAIL_BACKEND=sendgrid_backend.SendgridBackend
SENDGRID_API_KEY=your-sendgrid-api-key
# OR for AWS SES:
# EMAIL_BACKEND=django_ses.SESBackend
# AWS_ACCESS_KEY_ID=your-aws-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret

DEFAULT_FROM_EMAIL=noreply@smartgov.ai
SUPPORT_EMAIL=support@smartgov.ai

# Celery Configuration
CELERY_BROKER_URL=redis://redis-host:6379/0
CELERY_RESULT_BACKEND=redis://redis-host:6379/0

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
HSTS_SECONDS=31536000
HSTS_INCLUDE_SUBDOMAINS=True
HSTS_PRELOAD=True

# Sentry Error Tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/xxxxx

# Monitoring
NEW_RELIC_LICENSE_KEY=your-new-relic-key
```

---

## Frontend .env Template

Save this as `frontend/.env`:

### Development
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
REACT_APP_TIMEOUT=30000
REACT_APP_DEBUG=true
```

### Production
```
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
REACT_APP_TIMEOUT=30000
REACT_APP_DEBUG=false
```

---

## Django settings.py Configuration Snippet

Add to your `backend/backend/settings.py`:

```python
import os
from pathlib import Path
import environ

# Load environment variables
environ.Env.read_env()
env = environ.Env()

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret key
SECRET_KEY = env('SECRET_KEY', default='django-insecure-dev-key')

# Debug
DEBUG = env.bool('DEBUG', default=False)

# Allowed hosts
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'drf_spectacular',
    'corsheaders',
    'users',
    'schemes',
    'chatbot',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
    'http://localhost:3000',
    'http://localhost:8000',
])

# Database
DATABASES = {
    'default': env.db(
        'DATABASE_URL',
        default='sqlite:///db.sqlite3'
    )
}

# OpenAI Configuration
OPENAI_API_KEY = env('OPENAI_API_KEY', default='')
OPENAI_MODEL = env('OPENAI_MODEL', default='gpt-3.5-turbo')
OPENAI_TEMPERATURE = env.float('OPENAI_TEMPERATURE', default=0.5)
OPENAI_MAX_TOKENS = env.int('OPENAI_MAX_TOKENS', default=500)

# Email Configuration
EMAIL_BACKEND = env(
    'EMAIL_BACKEND',
    default='django.core.mail.backends.console.EmailBackend'
)
EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='noreply@smartgov.ai')

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# Spectacular (Swagger) Configuration
SPECTACULAR_SETTINGS = {
    'TITLE': 'SmartGov AI API',
    'DESCRIPTION': 'Intelligent Government Services Assistant API',
    'VERSION': '1.0.0',
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Custom User Model
AUTH_USER_MODEL = 'users.CustomUser'

# Celery Configuration
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'

# Caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': env('CACHE_URL', default='redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Security Settings (Production)
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_SECURITY_POLICY = {
        'DEFAULT_SRC': ("'self'",),
    }
    HSTS_SECONDS = 31536000
    HSTS_INCLUDE_SUBDOMAINS = True
    HSTS_PRELOAD = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
```

---

## Docker Compose Template

Save as `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: smartgov_db
      POSTGRES_USER: smartgov_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      - DEBUG=True
      - DATABASE_URL=postgresql://smartgov_user:secure_password@db:5432/smartgov_db
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    command: npm start
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api

  celery:
    build: ./backend
    command: celery -A backend worker -l info
    volumes:
      - ./backend:/app
    environment:
      - DEBUG=True
      - DATABASE_URL=postgresql://smartgov_user:secure_password@db:5432/smartgov_db
      - CELERY_BROKER_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

---

## Dockerfile for Backend

Save as `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Run migrations and collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## Dockerfile for Frontend

Save as `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
```

---

## requirements.txt Template

Key packages already included:

```
Django==5.2.8
djangorestframework==3.14.0
drf-spectacular==0.27.1
django-cors-headers==4.3.1
django-environ==0.21.0
openai==1.3.0
celery==5.3.4
redis==5.0.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
requests==2.31.0
pillow==10.0.0
django-redis==5.4.0
whitenoise==6.6.0
python-decouple==3.8
```

---

## GitHub Actions Workflow

Save as `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt

      - name: Run migrations
        working-directory: ./backend
        run: python manage.py migrate

      - name: Run tests
        working-directory: ./backend
        run: python manage.py test

      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install frontend deps
        working-directory: ./frontend
        run: npm ci

      - name: Build frontend
        working-directory: ./frontend
        run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add your deployment commands here
```

---

## Environment Variables Checklist

Before deploying, ensure you have set:

### Required
- [ ] `OPENAI_API_KEY` - From OpenAI dashboard
- [ ] `SECRET_KEY` - Generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- [ ] `DATABASE_URL` - PostgreSQL connection string for production

### Optional but Recommended
- [ ] `SENDGRID_API_KEY` - For email notifications
- [ ] `SENTRY_DSN` - For error tracking
- [ ] `CELERY_BROKER_URL` - For background tasks

### For Production
- [ ] `DEBUG=False`
- [ ] `SECURE_SSL_REDIRECT=True`
- [ ] Updated `ALLOWED_HOSTS`
- [ ] Updated `CORS_ALLOWED_ORIGINS`

---

## Generate Secret Key

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and use it as `SECRET_KEY` in production `.env`

---

Use these templates to quickly configure SmartGov AI for your environment!
