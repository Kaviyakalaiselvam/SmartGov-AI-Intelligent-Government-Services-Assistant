# SmartGov AI - Complete Setup Guide

This guide will walk you through setting up SmartGov AI from scratch.

## System Requirements

- **OS**: Windows, macOS, or Linux
- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm**: 8 or higher
- **Git**: Latest version
- **RAM**: Minimum 4GB
- **Disk Space**: 2GB free

## Step-by-Step Setup

### Part 1: Backend Setup

#### 1.1 Open Command Prompt/Terminal

Navigate to the backend directory:
```bash
cd smartgov-ai/backend
```

#### 1.2 Create Virtual Environment

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

#### 1.3 Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Wait for all packages to install (may take 2-3 minutes).

#### 1.4 Create Environment Variables

Create a `.env` file in the backend folder:

**Windows**: 
```bash
copy nul .env
```

**macOS/Linux:**
```bash
touch .env
```

Open the `.env` file and add:
```
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
OPENAI_API_KEY=sk-your-openai-api-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

**To get your OpenAI API Key:**
1. Go to https://platform.openai.com/account/api-keys
2. Sign up or log in with your OpenAI account
3. Create a new API key
4. Copy it to the `.env` file

#### 1.5 Run Database Migrations

This creates the database tables:
```bash
python manage.py makemigrations
python manage.py migrate
```

You should see output like:
```
Operations to perform:
  Apply all migrations: admin, auth, chatbot, contenttypes, schemes, sessions, users
Running migrations:
  ...
OK
```

#### 1.6 Create Admin User (Superuser)

```bash
python manage.py createsuperuser
```

Follow the prompts:
- Username: `admin`
- Email: `admin@localhost`
- Password: `YourSecurePassword123!`

#### 1.7 Load Sample Data (Optional)

Create sample schemes in the database. Create a file `load_schemes.py` in the backend folder:

```python
# load_schemes.py
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from schemes.models import Scheme

schemes_data = [
    {
        'name': 'National Scholarship Scheme',
        'category': 'education',
        'description': 'Financial assistance for meritorious students from low-income families',
        'eligibility': 'Merit + Income based',
        'benefits': '₹10,000 to ₹50,000 per year',
        'documents_required': 'Class XII marks, Income certificate, Aadhar',
        'application_deadline': '2024-12-31',
        'age_min': 16,
        'age_max': 25,
        'applicable_states': ['All'],
        'applicable_occupations': ['Student']
    },
    # Add more schemes here
]

for scheme in schemes_data:
    Scheme.objects.get_or_create(
        name=scheme['name'],
        defaults=scheme
    )

print("Schemes loaded successfully!")
```

Run it:
```bash
python load_schemes.py
```

#### 1.8 Start Backend Server

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

**Keep this terminal open and open a new terminal for the frontend.**

### Part 2: Frontend Setup

#### 2.1 Open New Terminal/Command Prompt

Navigate to frontend directory:
```bash
cd smartgov-ai/frontend
```

#### 2.2 Install Frontend Dependencies

```bash
npm install
```

This installs React, React Router, Axios, and other packages. May take 2-3 minutes.

#### 2.3 Create Environment Variables

Create `.env` file in frontend directory:
```bash
# Windows
copy nul .env

# macOS/Linux
touch .env
```

Add to `.env`:
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

#### 2.4 Start Frontend Server

```bash
npm start
```

The browser should automatically open to `http://localhost:3000`

If it doesn't, manually open that URL.

---

## Testing the Application

### 1. Test Homepage
- Go to http://localhost:3000
- You should see the SmartGov landing page with features

### 2. Test Registration
- Click "Sign Up" button
- Fill in the form:
  - First Name: `John`
  - Last Name: `Doe`
  - Username: `johndoe`
  - Email: `john@example.com`
  - Password: `TestPass123!`
  - Age: `25`
  - Occupation: `Student`
  - State: `Maharashtra`
  - Phone: `9876543210`
- Click "Register"

### 3. Test Login
- After registration, you should be redirected to login
- Login with: `johndoe` / `TestPass123!`
- You should see "Welcome John" in navbar

### 4. Test AI Assistant
- Navigate to "AI Assistant" in navbar
- Type: `What schemes are available for students?`
- Click send or press Enter
- AI should respond (may take 5-10 seconds first time)

### 5. Test Voice (if microphone available)
- In AI Assistant page, click the 🎤 button
- Speak: `Tell me about education schemes`
- Your speech should be transcribed and sent
- AI will respond with text-to-speech

### 6. Test Schemes Page
- Click "Explore Schemes" in navbar
- You should see available schemes
- Click on a scheme to see details and document checklist

### 7. Test Aadhar Verification
- Go to Profile page
- Click "Verify Aadhar"
- Enter any 12-digit number like: `123456789012`
- Click "Verify"
- Status should show as verified

### 8. Test User Profile
- Go to Profile page
- Edit your profile information
- Change language preference to Hindi
- Save changes
- Verify preferences are updated

---

## Accessing Admin Panel

1. Go to http://localhost:8000/admin/
2. Login with superuser credentials (admin / YourPassword123!)
3. You can:
   - Add schemes manually
   - View users
   - Check chat history
   - Manage reminders
   - View Aadhar verifications

---

## Common Issues & Solutions

### Issue: Port 8000 is already in use
**Solution:**
```bash
python manage.py runserver 8001
```
Then access at http://localhost:8001

### Issue: Port 3000 is already in use
**Solution:**
```bash
PORT=3001 npm start
```

### Issue: OpenAI API key not working
**Solutions:**
1. Verify the key is correct in `.env` file
2. Check key is active on OpenAI dashboard
3. Ensure you have API credits
4. Check API rate limits haven't been exceeded

### Issue: "Module not found" errors
**Solution:**
```bash
# Backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
npm install
```

### Issue: Database locked error
**Solution:**
```bash
rm db.sqlite3
python manage.py migrate
```

### Issue: CORS errors when frontend calls backend
**Solution:**
Check in `backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]
```

### Issue: Voice input not working
**Solution:**
1. Check browser supports Web Speech API (Chrome, Edge, Safari)
2. Ensure microphone permission is granted
3. Check browser console for errors

---

## Project Structure Verification

Before starting, verify you have these files:

```
backend/
  ├── manage.py ✓
  ├── requirements.txt ✓
  ├── db.sqlite3 (created after migrate)
  ├── .env (create this)
  ├── backend/
  │   ├── settings.py ✓
  │   ├── urls.py ✓
  ├── users/
  │   ├── models.py ✓
  │   ├── views.py ✓
  │   ├── serializers.py ✓
  ├── schemes/
  │   ├── models.py ✓
  │   ├── views.py ✓
  ├── chatbot/
  │   ├── models.py ✓
  │   ├── views.py ✓

frontend/
  ├── package.json ✓
  ├── .env (create this)
  ├── src/
  │   ├── App.js ✓
  │   ├── pages/
  │   │   ├── Home.js ✓
  │   │   ├── Login.js ✓
  │   │   ├── Register.js ✓
  │   │   ├── AIAssistant.js ✓
  │   │   ├── PersonalizedSchemes.js ✓
  │   │   ├── UserProfile.js ✓
  │   ├── services/
  │   │   ├── api.js ✓
  │   ├── styles/
  │   │   ├── animations.css ✓
  │   │   ├── auth.css ✓
  │   │   ├── chat.css ✓
```

---

## Environment Variables Reference

### Backend (.env)
| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| DEBUG | True/False | Yes | Set to False in production |
| SECRET_KEY | Your secret key | Yes | Change for production |
| OPENAI_API_KEY | Your API key | Yes | Get from OpenAI |
| ALLOWED_HOSTS | localhost,127.0.0.1 | Yes | Add your domain in production |
| DATABASE_URL | sqlite:///db.sqlite3 | No | Optional, SQLite is default |
| CELERY_BROKER_URL | redis://localhost:6379 | No | For background tasks |

### Frontend (.env)
| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| REACT_APP_API_URL | http://localhost:8000/api | Yes | Backend API base URL |
| REACT_APP_ENV | development | No | development/production |

---

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test all features mentioned above
3. ✅ Add sample schemes via admin panel
4. ✅ Create test user accounts
5. ✅ Test AI responses and refine prompts
6. 📝 Customize scheme data for your region
7. 🚀 Prepare for deployment

---

## Getting Help

If you encounter issues:

1. Check the common issues section above
2. Check Python/Node version: `python --version` and `node --version`
3. Verify all files exist in correct locations
4. Check backend server is running before testing
5. Check browser console for JavaScript errors (F12)
6. Check Django logs for backend errors

---

## Advanced Configuration

### Using PostgreSQL Instead of SQLite

1. Install PostgreSQL
2. Create database: `createdb smartgov_db`
3. Install Python package: `pip install psycopg2-binary`
4. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/smartgov_db
   ```
5. Run migrations: `python manage.py migrate`

### Using Redis for Caching

1. Install Redis from https://redis.io/download
2. Start Redis: `redis-server`
3. Update `.env`:
   ```
   CACHE_URL=redis://localhost:6379/0
   ```

### Running Celery for Background Tasks

```bash
# In new terminal
celery -A backend worker -l info
```

This enables email reminders and scheduled notifications.

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Set `DEBUG=False` in backend `.env`
- [ ] Generate secure `SECRET_KEY`
- [ ] Update `ALLOWED_HOSTS` with your domain
- [ ] Switch from SQLite to PostgreSQL
- [ ] Set up Redis for caching
- [ ] Configure email backend (SendGrid, AWS SES)
- [ ] Set up SSL/HTTPS certificate
- [ ] Configure CDN for static files
- [ ] Set up monitoring and logging
- [ ] Create database backups
- [ ] Configure rate limiting
- [ ] Update CORS origins

---

## Performance Tips

1. **Enable Redis Caching**: Cache scheme data and user preferences
2. **Use PostgreSQL**: Better performance than SQLite
3. **Minify Frontend**: Run `npm run build` for production
4. **Enable Compression**: GZIP compress API responses
5. **Implement Pagination**: Limit API results
6. **Use CDN**: Serve static files via CDN
7. **Database Indexing**: Index frequently queried fields
8. **API Rate Limiting**: Prevent abuse

---

Happy coding! 🚀

For more information, see the full README.md file.
