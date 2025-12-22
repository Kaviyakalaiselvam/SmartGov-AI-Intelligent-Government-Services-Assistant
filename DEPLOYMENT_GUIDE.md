# SmartGov AI - Deployment Guide

Production deployment guide for SmartGov AI on various platforms.

## Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] No hardcoded secrets in code
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Static files collected
- [ ] Frontend built for production
- [ ] HTTPS/SSL configured
- [ ] Database backups configured
- [ ] Monitoring & logging setup
- [ ] Error tracking (Sentry) setup

---

## Backend Deployment

### Option 1: Heroku Deployment

#### 1.1 Install Heroku CLI

Download from https://devcenter.heroku.com/articles/heroku-cli

#### 1.2 Login to Heroku

```bash
heroku login
```

#### 1.3 Create Heroku App

```bash
cd backend
heroku create your-app-name
```

#### 1.4 Add PostgreSQL Database

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### 1.5 Create Procfile

Create `backend/Procfile`:
```
web: gunicorn backend.wsgi --log-file -
release: python manage.py migrate
```

#### 1.6 Update requirements.txt

Add these packages:
```
gunicorn==21.2.0
psycopg2-binary==2.9.9
django-environ==0.21.0
whitenoise==6.6.0
```

#### 1.7 Update settings.py

```python
import environ
import dj_database_url

env = environ.Env()

# Add WhiteNoise for static files
MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    'django.middleware.security.SecurityMiddleware',
    ...
]

# Database
DATABASES = {
    'default': dj_database_url.config(
        default=env('DATABASE_URL'),
        conn_max_age=600
    )
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
ALLOWED_HOSTS = ['your-app-name.herokuapp.com']

# Allowed Origins for CORS
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com"
]
```

#### 1.8 Set Environment Variables

```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key-here
heroku config:set OPENAI_API_KEY=your-openai-key
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
```

#### 1.9 Deploy

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

#### 1.10 Run Migrations

```bash
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

#### 1.11 View Logs

```bash
heroku logs --tail
```

---

### Option 2: AWS Elastic Beanstalk

#### 2.1 Install AWS CLI

```bash
pip install awsebcli
```

#### 2.2 Initialize EB

```bash
cd backend
eb init -p python-3.11
```

#### 2.3 Create Procfile

```
web: gunicorn backend.wsgi
```

#### 2.4 Create .ebextensions/django.config

Create `backend/.ebextensions/django.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: backend.wsgi:application
  
  aws:elasticbeanstalk:application:environment:
    PYTHONPATH: /var/app/current:$PYTHONPATH
    DEBUG: "False"

container_commands:
  01_migrate:
    command: "source /var/app/venv/*/bin/activate && python manage.py migrate --noinput"
    leader_only: true
  02_createsuperuser:
    command: "source /var/app/venv/*/bin/activate && python manage.py createsuperuser --username admin --email admin@example.com --noinput || true"
    leader_only: true
  03_collectstatic:
    command: "source /var/app/venv/*/bin/activate && python manage.py collectstatic --noinput"
```

#### 2.5 Create Environment

```bash
eb create smartgov-prod
```

#### 2.6 Set Environment Variables

```bash
eb setenv DEBUG=False SECRET_KEY=xxx OPENAI_API_KEY=yyy
```

#### 2.7 Deploy

```bash
git add .
git commit -m "Deploy to AWS"
eb deploy
```

---

### Option 3: DigitalOcean App Platform

#### 3.1 Create app.yaml

Create `backend/app.yaml`:
```yaml
name: smartgov-ai
services:
- name: api
  github:
    repo: your-username/smartgov-ai
    branch: main
  build_command: pip install -r requirements.txt && python manage.py collectstatic --noinput
  run_command: gunicorn backend.wsgi
  http_port: 8080
  envs:
  - key: DEBUG
    value: "False"
  - key: SECRET_KEY
    scope: RUN_AND_BUILD_TIME
    value: ${SECRET_KEY}
  - key: OPENAI_API_KEY
    scope: RUN_AND_BUILD_TIME
    value: ${OPENAI_API_KEY}

databases:
- name: postgres
  engine: PG
  version: "14"
```

#### 3.2 Deploy via DigitalOcean Console

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub repository
4. Upload app.yaml
5. Set environment variables
6. Deploy

---

## Frontend Deployment

### Option 1: Vercel Deployment

#### 1.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 1.2 Build Frontend

```bash
cd frontend
npm run build
```

#### 1.3 Deploy to Vercel

```bash
vercel
```

#### 1.4 Configure Environment Variables

In Vercel dashboard:
```
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production
```

---

### Option 2: Netlify Deployment

#### 2.1 Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2.2 Build Frontend

```bash
cd frontend
npm run build
```

#### 2.3 Deploy to Netlify

```bash
netlify deploy --prod
```

#### 2.4 Create netlify.toml

Create `frontend/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  REACT_APP_API_URL = "https://your-api-domain.com/api"
```

---

### Option 3: AWS S3 + CloudFront

#### 3.1 Build Frontend

```bash
cd frontend
npm run build
```

#### 3.2 Create S3 Bucket

```bash
aws s3 mb s3://smartgov-ai-frontend
```

#### 3.3 Upload Build Files

```bash
aws s3 sync build/ s3://smartgov-ai-frontend/ --delete
```

#### 3.4 Create CloudFront Distribution

1. Go to CloudFront console
2. Create distribution
3. Set S3 bucket as origin
4. Set cache behavior
5. Add SSL certificate
6. Deploy

#### 3.5 Update DNS

Point your domain to CloudFront distribution URL.

---

## Database Migration to Production

### PostgreSQL Setup

#### 1. Create Database

```bash
createdb smartgov_prod
createuser smartgov_user
psql smartgov_prod
```

#### 2. Set Permissions

```sql
ALTER USER smartgov_user PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE smartgov_prod TO smartgov_user;
```

#### 3. Configure Django

Update `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'smartgov_prod',
        'USER': 'smartgov_user',
        'PASSWORD': 'strong_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

#### 4. Run Migrations

```bash
python manage.py migrate
```

---

## Email Configuration

### Using SendGrid

#### 1. Get SendGrid API Key

Sign up at https://sendgrid.com

#### 2. Update settings.py

```python
EMAIL_BACKEND = 'sendgrid_backend.SendgridBackend'
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
DEFAULT_FROM_EMAIL = 'noreply@smartgov.ai'
```

#### 3. Install Package

```bash
pip install django-sendgrid-v5
```

#### 4. Test Email

```bash
python manage.py shell
from django.core.mail import send_mail
send_mail('Test', 'Test message', 'from@example.com', ['to@example.com'])
```

---

## Security Configuration

### 1. Enable HTTPS

```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
HSTS_SECONDS = 31536000
HSTS_INCLUDE_SUBDOMAINS = True
HSTS_PRELOAD = True
```

### 2. Configure CORS Properly

```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

### 3. Enable Content Security Policy

Install django-csp:
```bash
pip install django-csp
```

Add to middleware:
```python
MIDDLEWARE = [
    'csp.middleware.CSPMiddleware',
    ...
]
```

### 4. Rate Limiting

Install django-ratelimit:
```bash
pip install django-ratelimit
```

### 5. API Key Security

```python
# Never commit API keys
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not set in environment")
```

---

## Monitoring & Logging

### 1. Sentry Error Tracking

Install sentry SDK:
```bash
pip install sentry-sdk
```

Configure:
```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="https://your-sentry-dsn@sentry.io/xxxx",
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=False
)
```

### 2. Application Performance Monitoring

Use New Relic:
```bash
pip install newrelic
```

Run server:
```bash
NEW_RELIC_CONFIG_FILE=newrelic.ini newrelic-admin run-program python manage.py runserver
```

### 3. CloudWatch Logs (AWS)

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'watchtower': {
            'level': 'INFO',
            'class': 'watchtower.CloudWatchLogHandler',
            'log_group': '/aws/elasticbeanstalk/smartgov-ai',
            'stream_name': 'smartgov-api',
        },
    },
    'root': {
        'level': 'INFO',
        'handlers': ['watchtower'],
    },
}
```

---

## Backup & Recovery

### Database Backup

#### Daily Backup Script

Create `backup.sh`:
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump smartgov_prod > backup_$TIMESTAMP.sql
gzip backup_$TIMESTAMP.sql

# Upload to S3
aws s3 cp backup_$TIMESTAMP.sql.gz s3://your-backup-bucket/
```

Schedule with cron:
```bash
0 2 * * * /path/to/backup.sh
```

#### Restore Database

```bash
gunzip backup_20240115_020000.sql.gz
psql smartgov_prod < backup_20240115_020000.sql
```

---

## Performance Optimization

### 1. Database Optimization

```python
# Use select_related for foreign keys
Scheme.objects.select_related('user').all()

# Use prefetch_related for reverse relations
User.objects.prefetch_related('saved_schemes').all()

# Add database indexes
class Scheme(models.Model):
    name = models.CharField(max_length=255, db_index=True)
```

### 2. Caching with Redis

```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

Cache schemes:
```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # 5 minutes
def get_schemes(request):
    return ...
```

### 3. CDN for Static Files

Use CloudFront or CloudFlare for static file delivery.

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - run: pip install -r requirements.txt
      - run: python manage.py test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "smartgov-ai"
          heroku_email: ${{secrets.HEROKU_EMAIL}}
```

---

## Troubleshooting Deployment

### Issue: 502 Bad Gateway

**Solutions:**
1. Check backend is running: `heroku logs --tail`
2. Check Procfile exists and is correct
3. Restart dyno: `heroku restart`
4. Check environment variables are set

### Issue: Static Files Not Loading

**Solutions:**
1. Run `python manage.py collectstatic`
2. Check STATIC_ROOT and STATIC_URL
3. Use WhiteNoise for serving static files

### Issue: Database Connection Error

**Solutions:**
1. Check database credentials
2. Verify database URL format
3. Ensure database exists and is running
4. Check firewall/security groups

### Issue: OpenAI API Timeouts

**Solutions:**
1. Check API key is valid
2. Check API usage/rate limits
3. Increase timeout values
4. Use async tasks with Celery

---

## Post-Deployment Checklist

- [ ] Backend API responding on production URL
- [ ] Frontend loads without errors
- [ ] Authentication flow working
- [ ] OpenAI API responses working
- [ ] Database queries performing well
- [ ] Static files serving correctly
- [ ] Email notifications configured
- [ ] Error tracking (Sentry) capturing errors
- [ ] SSL certificate valid and auto-renewing
- [ ] Database backups running
- [ ] Monitoring and alerts configured
- [ ] User roles and permissions working
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] Security headers set correctly

---

## Domain Setup

### DNS Configuration

Add to your domain's DNS provider (Route 53, Cloudflare, etc.):

```
Type: A
Name: @
Value: <your-server-ip>

Type: CNAME
Name: api
Value: <your-backend-domain>

Type: CNAME
Name: www
Value: <your-frontend-domain>
```

### SSL Certificate

Using Let's Encrypt:

```bash
apt-get install certbot python3-certbot-nginx
certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## Disaster Recovery Plan

1. **Database Backup**: Daily automated backups to S3
2. **Code Repository**: Backed up on GitHub
3. **Recovery Procedure**: 
   - Deploy from latest GitHub commit
   - Restore latest database backup
   - Verify all systems operational
   - Run smoke tests

---

For issues or questions, contact: support@smartgov.ai
