# SmartGov AI - Quick Start Guide

Get SmartGov AI running in 5 minutes!

## ⚡ Quick Start (TL;DR)

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` with your OpenAI API key:
```
OPENAI_API_KEY=sk-your-key-here
DEBUG=True
```

Then run:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

✅ Backend ready at http://localhost:8000

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

✅ Frontend ready at http://localhost:3000

---

## 🧪 First Test

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create account:
   - Username: `testuser`
   - Password: `Test123!`
   - Age: `25`
   - State: `Maharashtra`
4. Login with those credentials
5. Go to "AI Assistant"
6. Type: `What are some government schemes for students?`
7. Get AI response in 5-10 seconds ✨

---

## 📁 File Structure

```
backend/
├── .env                    # Create this with OPENAI_API_KEY
├── manage.py
├── requirements.txt        # Already has all dependencies
├── db.sqlite3             # Created after migrate
├── users/
│   ├── models.py          # CustomUser, Aadhar, Preferences
│   ├── views.py           # Auth, Profile APIs
│   └── serializers.py
├── schemes/
│   ├── models.py          # Schemes, Checklists, Reminders
│   ├── views.py           # Scheme discovery APIs
│   └── serializers.py
└── chatbot/
    ├── models.py          # Chat sessions, Prompts
    ├── views.py           # AI chat APIs
    └── serializers.py

frontend/
├── package.json
├── public/
├── src/
│   ├── App.js            # Routes
│   ├── pages/            # Login, Register, AIAssistant, etc.
│   ├── components/       # Navbar
│   ├── services/
│   │   └── api.js        # All API calls
│   └── styles/           # CSS with animations
```

---

## 🔑 Key Files You Might Need

| File | Purpose | Change When |
|------|---------|------------|
| `backend/.env` | API keys | Getting OpenAI key |
| `backend/settings.py` | Django config | Adding database/email |
| `frontend/src/services/api.js` | API calls | Changing backend URL |
| `requirements.txt` | Python packages | Adding new features |
| `frontend/package.json` | npm packages | Adding new features |

---

## 🚀 Features Quick Access

### 🤖 AI Chat
- **File**: `frontend/src/pages/AIAssistant.js`
- **Backend**: `backend/chatbot/views.py`
- **Try**: Go to AI Assistant page, type a question

### 💼 Schemes
- **File**: `frontend/src/pages/PersonalizedSchemes.js`
- **Backend**: `backend/schemes/views.py`
- **Try**: Click "Explore Schemes", see personalized list

### 🎤 Voice
- **File**: Uses Web Speech API (browser native)
- **Try**: Click 🎤 button in AI Assistant
- **Note**: Works on Chrome, Edge, Safari

### 👤 Profile
- **File**: `frontend/src/pages/UserProfile.js`
- **Backend**: `backend/users/views.py`
- **Try**: Click profile icon, edit your details

### 🆔 Aadhar
- **File**: Profile page → Verify Aadhar
- **Test**: Use any 12-digit number like `123456789012`

---

## 🆘 Common Issues

**Port already in use?**
```bash
# Backend on different port
python manage.py runserver 8001

# Frontend on different port
PORT=3001 npm start
```

**Module not found?**
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

**Database error?**
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
```

**AI not responding?**
- Check OpenAI API key in `.env`
- Check internet connection
- Check API key is active (https://platform.openai.com/account/api-keys)

**Frontend can't reach backend?**
- Check backend is running on http://localhost:8000
- Check CORS in `backend/settings.py`

---

## 📚 Documentation Files

- **README_FULL.md** - Complete feature documentation
- **SETUP_GUIDE.md** - Detailed setup with screenshots
- **API_DOCUMENTATION.md** - All API endpoints reference
- **DEPLOYMENT_GUIDE.md** - Production deployment
- **QUICK_START.md** - This file (you are here)

---

## 🎯 Next Steps

1. ✅ Run backend & frontend
2. ✅ Create test account
3. ✅ Try AI chat feature
4. 📊 Add sample schemes in admin panel
5. 🎨 Customize UI colors
6. 📧 Setup email reminders
7. 🚀 Deploy to production

---

## 📞 Admin Panel

Access at: http://localhost:8000/admin/

Login with:
- Username: `admin`
- Password: `YourSecurePassword123!` (or whatever you set during `createsuperuser`)

You can:
- Add schemes manually
- View users
- Check chat history
- Manage all models

---

## 🌐 API Endpoints Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/auth/register/` | POST | Create account |
| `/auth/auth/login/` | POST | Login |
| `/auth/profile/` | GET | Get profile |
| `/schemes/schemes/` | GET | Get all schemes |
| `/schemes/schemes/personalized/` | GET | Get personalized schemes |
| `/chatbot/chatbot/send_message/` | POST | Send chat message |
| `/auth/aadhar/verify_aadhar/` | POST | Verify Aadhar |

Full list in `API_DOCUMENTATION.md`

---

## 🔒 Security Notes

- Never commit `.env` file
- Never share `SECRET_KEY` or API keys
- Use strong passwords in production
- Enable HTTPS for production
- Keep dependencies updated

---

## 💡 Tips & Tricks

**View live requests:**
```bash
# Terminal
tail -f db.sqlite3  # Watch database changes
```

**Reset everything:**
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

**Test API without frontend:**
```bash
curl -X POST http://localhost:8000/api/auth/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}'
```

**Check Python/Node versions:**
```bash
python --version
node --version
npm --version
```

---

## 🎓 Learning Resources

- **Django**: https://www.djangoproject.com/
- **React**: https://react.dev/
- **OpenAI API**: https://platform.openai.com/docs/
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **REST API Design**: https://restfulapi.net/

---

## 📊 What's Installed

### Backend
- Django 5.2 (Web framework)
- Django REST Framework (API)
- OpenAI (AI responses)
- PostgreSQL driver (production DB)
- Celery (Background tasks)

### Frontend
- React 19 (UI framework)
- React Router (Navigation)
- Axios (API calls)
- CSS3 (Styling & animations)

### Browser APIs (No install needed)
- Web Speech API (Voice input/output)
- Local Storage (Data persistence)
- Fetch API (Network requests)

---

## 🐛 Debug Mode

### Django Debug Toolbar

Install for development:
```bash
pip install django-debug-toolbar
```

Add to settings.py:
```python
INSTALLED_APPS = [..., 'debug_toolbar']
MIDDLEWARE = [..., 'debug_toolbar.middleware.DebugToolbarMiddleware']
```

Access toolbar at bottom right of any page.

### Browser DevTools

Press `F12` in browser to open DevTools:
- **Console**: JavaScript errors
- **Network**: API requests/responses
- **Application**: Local storage, cookies
- **Elements**: HTML structure

---

## 🎉 You're All Set!

Everything is ready to go. Start with the quick start section above and you'll be running in minutes.

**Questions?** Check the documentation files or look at the code comments.

**Want to extend?** All code is modular and well-organized for easy customization.

Happy coding! 🚀

---

## Support

- 📖 Read documentation files
- 🔍 Check API_DOCUMENTATION.md for endpoint details
- 🛠️ See SETUP_GUIDE.md for troubleshooting
- 🚀 Check DEPLOYMENT_GUIDE.md for production
- 💻 View source code comments for implementation details

**Built with ❤️ for Government Services**
