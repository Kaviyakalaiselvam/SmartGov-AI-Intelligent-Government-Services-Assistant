# SmartGov AI - Requirements & Dependencies

Complete list of all system requirements and software dependencies for SmartGov AI.

## 🖥️ System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 2 GB free space
- **Processor**: Dual-core 2.0 GHz minimum
- **Internet**: Required for API calls and package installation

### Recommended Requirements
- **OS**: Windows 11, macOS 12+, Ubuntu 20.04+
- **RAM**: 8 GB or more
- **Disk Space**: 5 GB free space
- **Processor**: Quad-core 2.5 GHz or higher
- **SSD**: Yes (for better performance)

---

## 📦 Software Prerequisites

### Required

1. **Python**
   - Version: 3.8 or higher (3.11+ recommended)
   - Download: https://www.python.org/downloads/
   - Verify: `python --version`

2. **Node.js & npm**
   - Node Version: 16.0+ (18+ recommended)
   - npm Version: 8.0+ (bundled with Node.js)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

3. **Git**
   - Version: Latest
   - Download: https://git-scm.com/
   - Verify: `git --version`

### Optional but Recommended

4. **PostgreSQL** (for production)
   - Version: 12+
   - Download: https://www.postgresql.org/download/
   - Only needed for production (SQLite for development)

5. **Redis** (for caching and Celery)
   - Version: 6.0+
   - Download: https://redis.io/download
   - For background tasks and caching

6. **Docker** (for containerization)
   - Version: Latest
   - Download: https://www.docker.com/products/docker-desktop

---

## 🔐 API Keys & Credentials Required

### OpenAI API Key (Required for AI Features)
1. Go to: https://platform.openai.com/account/api-keys
2. Sign up or log in
3. Create a new API key
4. Add to `.env` as `OPENAI_API_KEY=sk-...`

### Email Service (Optional for reminders)
- **SendGrid** (recommended): https://sendgrid.com
- **AWS SES**: https://aws.amazon.com/ses/
- **Gmail App Password**: https://myaccount.google.com/apppasswords

### Monitoring (Optional)
- **Sentry**: https://sentry.io (error tracking)
- **New Relic**: https://newrelic.com (monitoring)

---

## 📋 Backend Dependencies

### Core Packages (See `backend/requirements.txt`)

#### Framework & API
- `Django==5.2.8` - Web framework
- `djangorestframework==3.14.0` - REST API
- `drf-spectacular==0.27.1` - API documentation (Swagger)
- `django-cors-headers==4.3.1` - CORS support

#### Authentication
- `djangorestframework-authtoken==3.14.0` - Token auth
- `cryptography==41.0.7` - Encryption

#### Database
- `psycopg2-binary==2.9.9` - PostgreSQL driver (optional)
- `django-extensions==3.2.3` - Django utilities

#### AI Integration
- `openai==1.3.0` - OpenAI API client
- `requests==2.31.0` - HTTP library

#### File Handling
- `Pillow==10.1.0` - Image processing
- `django-storages==1.14.2` - Cloud storage support

#### Task Queue & Caching
- `celery==5.3.4` - Task queue
- `redis==5.0.1` - Redis client
- `django-redis==5.4.0` - Django Redis cache

#### Production Server
- `gunicorn==21.2.0` - WSGI server
- `whitenoise==6.6.0` - Static file serving

#### Configuration
- `python-decouple==3.8` - Environment variables
- `python-dotenv==1.0.0` - .env file support
- `django-environ==0.21.0` - Django environment config

#### Development & Testing
- `django-debug-toolbar==4.2.0` - Debug toolbar
- `black==23.11.0` - Code formatter
- `flake8==6.1.0` - Linter
- `pytest==7.4.3` - Testing framework
- `pytest-django==4.7.0` - Django testing support
- `factory-boy==3.3.0` - Test fixtures

#### Utilities
- `python-dateutil==2.8.2` - Date utilities
- `pytz==2023.3` - Timezone support
- `slugify==0.0.1` - URL slugification

#### Monitoring & Logging
- `sentry-sdk==1.38.0` - Error tracking
- `newrelic==9.3.0` - Application monitoring

#### Email
- `django-sendgrid-v5==1.2.2` - SendGrid integration

#### API Features
- `django-filter==23.4` - Filtering support
- `django-ratelimit==4.1.0` - Rate limiting

#### Real-time Features (Optional)
- `channels==4.0.0` - WebSocket support
- `channels-redis==4.1.0` - Redis backend for channels
- `daphne==4.0.0` - ASGI server

#### Other
- `django-admin-interface==0.25.0` - Enhanced admin
- `django-modeltranslation==0.18.11` - Multilingual models
- `isort==5.13.2` - Import sorting
- `flake8-docstrings==1.7.0` - Docstring checking

---

## 📦 Frontend Dependencies

### Core Packages (See `frontend/package.json`)

#### Framework
- `react@^19.2.3` - React UI framework
- `react-dom@^19.2.3` - React DOM
- `react-scripts@5.0.1` - Create React App scripts

#### Routing
- `react-router-dom@^6.30.2` - Client-side routing

#### HTTP Client
- `axios@^1.13.2` - HTTP requests (API calls)

#### Testing
- `@testing-library/react@^16.3.1` - React testing
- `@testing-library/jest-dom@^6.9.1` - DOM matchers
- `@testing-library/user-event@^13.5.0` - User interaction testing
- `@testing-library/dom@^10.4.1` - DOM testing

#### Performance Monitoring
- `web-vitals@^2.1.4` - Web performance metrics

#### Development Dependencies
- `@babel/preset-react@^7.23.3` - Babel React preset
- `eslint@^8.55.0` - Code linter
- `eslint-plugin-react@^7.33.2` - React linting rules
- `prettier@^3.1.1` - Code formatter

### Browser APIs (Built-in - No Installation Needed)
- **Web Speech API** - Speech recognition and synthesis
- **Local Storage API** - Client-side data storage
- **Fetch API** - Network requests
- **WebSocket API** - Real-time communication (if enabled)

---

## 🚀 Installation Commands

### Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt

# Verify installation
pip list
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Verify installation
npm list

# Check versions
npm --version
node --version
```

---

## 📊 Package Statistics

### Backend
- **Total Packages**: 50+
- **Core Packages**: 5
- **Database Packages**: 2
- **Task Queue Packages**: 3
- **Testing Packages**: 5
- **Development Packages**: 8
- **Optional Packages**: 8

### Frontend
- **Total Packages**: 50+ (with sub-dependencies)
- **Core Packages**: 3
- **Testing Packages**: 4
- **Development Packages**: 3

---

## 🔄 Version Management

### Python Version Compatibility
```
Python 3.8:  ✅ Compatible
Python 3.9:  ✅ Compatible
Python 3.10: ✅ Compatible
Python 3.11: ✅ Recommended
Python 3.12: ⚠️ Check compatibility
```

### Node Version Compatibility
```
Node 14:  ❌ Not supported
Node 16:  ✅ Supported
Node 18:  ✅ Recommended
Node 20:  ✅ Recommended
```

---

## 🆕 Updating Dependencies

### Backend Updates
```bash
# Check for outdated packages
pip list --outdated

# Update specific package
pip install --upgrade package_name

# Update all packages (not recommended)
pip install --upgrade -r requirements.txt

# Export new requirements
pip freeze > requirements.txt
```

### Frontend Updates
```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package_name

# Update all packages
npm update

# Check for major updates
npm outdated -g
```

---

## 🔒 Security & Compliance

### Security Packages Included
- ✅ `cryptography` - Encryption
- ✅ `django-cors-headers` - CORS security
- ✅ `djangorestframework-authtoken` - Token auth
- ✅ `sentry-sdk` - Error tracking
- ✅ `whitenoise` - Safe static file serving

### Compliance
- ✅ PEP 8 compliant (Python)
- ✅ ESLint compliant (JavaScript)
- ✅ OWASP security practices
- ✅ Data validation on all inputs
- ✅ CSRF protection enabled
- ✅ SQL injection prevention (ORM)

---

## 📱 Supported Platforms

### Operating Systems
- ✅ Windows 10/11
- ✅ macOS 10.14+
- ✅ Ubuntu 18.04+
- ✅ Debian 10+
- ✅ CentOS 7+

### Browsers (Frontend)
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Servers (Production)
- ✅ Heroku
- ✅ AWS (EC2, Elastic Beanstalk)
- ✅ DigitalOcean
- ✅ Google Cloud Platform
- ✅ Azure
- ✅ Self-hosted (with Gunicorn)

---

## ⚙️ Optional Enhancements

### For Email Functionality
```bash
pip install django-sendgrid-v5
# OR
pip install django-ses
```

### For Real-time Features
```bash
pip install channels
pip install channels-redis
pip install daphne
```

### For Advanced Monitoring
```bash
pip install newrelic
pip install sentry-sdk
```

### For PostgreSQL (Production)
```bash
pip install psycopg2-binary
```

### For Redis Caching
```bash
pip install django-redis
```

---

## 🧪 Testing Requirements

### Backend Testing
```bash
pip install pytest pytest-django factory-boy
pytest
```

### Frontend Testing
```bash
npm test
```

### Load Testing
```bash
pip install locust
```

---

## 🐳 Docker Requirements

### If Using Docker
```bash
# Install Docker Desktop from https://docker.com

# Verify installation
docker --version
docker-compose --version
```

### Docker Compose Services
- Backend (Django + Gunicorn)
- Frontend (React)
- PostgreSQL database
- Redis cache
- Celery worker

---

## 🚨 Common Installation Issues & Solutions

### Issue: Python version not found
```bash
# Solution: Install Python 3.11
# Check version: python --version
```

### Issue: pip: command not found
```bash
# Solution: Reinstall Python and select "Add to PATH"
python -m pip --version
```

### Issue: npm ERR! peer dep missing
```bash
# Solution: Clean and reinstall
rm package-lock.json
npm install
```

### Issue: Module not found
```bash
# Backend solution:
pip install --upgrade -r requirements.txt

# Frontend solution:
npm install
```

---

## 📚 Documentation Links

- **Python Requirements**: https://www.python.org/downloads/
- **Node.js**: https://nodejs.org/
- **Django Packages**: https://pypi.org/search/?q=django
- **npm Registry**: https://www.npmjs.com/
- **OpenAI API**: https://platform.openai.com/

---

## ✅ Pre-Flight Checklist

Before starting development:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ and npm installed
- [ ] Git installed
- [ ] OpenAI API key obtained
- [ ] Virtual environment created
- [ ] `pip install -r requirements.txt` completed
- [ ] `npm install` completed
- [ ] `.env` file created with API keys
- [ ] Database migrations run
- [ ] Both servers start without errors

---

## 📞 Support

For dependency issues:
1. Check official documentation
2. Search package repositories (PyPI, npm)
3. Review GitHub issues
4. Check StackOverflow
5. Contact project maintainers

---

**All requirements are production-ready and regularly updated!** ✨
