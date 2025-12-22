# 🔐 SmartGov AI - Login Troubleshooting Guide

## 🆘 Login Issues & Solutions

If you're having login problems, follow this guide to diagnose and fix them.

---

## ✅ Step 1: Verify Backend is Running

### Check Backend Server
```bash
# Backend should be running on port 8000
curl http://localhost:8000/api/docs/
```

You should see Swagger API documentation. If not:
```bash
cd backend
python manage.py runserver
```

---

## ✅ Step 2: Test Admin Login

First, test with the admin account we created:

**Admin Credentials:**
```
Username: admin
Email: admin@smartgov.ai
Password: admin123456
```

### Test via cURL
```bash
curl -X POST http://localhost:8000/api/users/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123456"
  }'
```

Expected response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@smartgov.ai",
    "first_name": "",
    "last_name": ""
  },
  "token": "abc123...xyz"
}
```

### If you get an error:
- **"Invalid credentials"** → Password is wrong, check spelling
- **"Connection refused"** → Backend not running, start it with `python manage.py runserver`
- **"Page not found (404)"** → Wrong URL or API endpoint

---

## ✅ Step 3: Check Frontend Configuration

### Verify API Base URL
Open `frontend/src/services/api.js` and check:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Should be exactly this. If different, update it.

### Check .env File
```bash
# frontend/.env should have:
REACT_APP_API_URL=http://localhost:8000/api
```

---

## ✅ Step 4: Register a Test User

### Via Frontend
1. Go to http://localhost:3000/register
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Username: testuser
   - Email: test@example.com
   - Password: Test123456
   - Age: 25
   - Occupation: Student
   - State: Maharashtra
   - Phone: 9876543210
3. Click Register
4. Should see success message
5. Should redirect to login

### Via cURL (If frontend doesn't work)
```bash
curl -X POST http://localhost:8000/api/users/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456",
    "first_name": "Test",
    "last_name": "User",
    "age": 25,
    "occupation": "Student",
    "state": "Maharashtra",
    "phone_number": "9876543210"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "user": {...},
  "token": "abc123...xyz"
}
```

---

## ✅ Step 5: Test Frontend Login

### Login Steps
1. Go to http://localhost:3000/login
2. Enter:
   - Username: `admin` (or `testuser` if you registered)
   - Password: `admin123456` (or your test password)
3. Click "Login"
4. Check browser console for errors (F12)
5. Should redirect to home page
6. Check if "Welcome [Name]" appears in Navbar

### Check Browser Console
Press F12 and go to Console tab:

```
// You should see:
✓ Login response: {...}
✓ Token stored
✓ User data saved
```

**If you see errors**, copy them and check below.

---

## 🐛 Common Login Issues & Fixes

### Issue 1: "Login failed" or No Error Message

**Cause:** API call is failing silently

**Fix:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Click on the POST request to `/auth/login/`
5. Check Response tab
6. What error do you see?

**Common responses:**
```
500 Server Error → Backend issue, restart server
404 Not Found → Wrong URL in api.js
400 Bad Request → Invalid credentials or wrong format
401 Unauthorized → Username/password incorrect
```

---

### Issue 2: "Invalid credentials"

**Cause:** Username or password is wrong

**Fix:**
1. Double-check spelling
2. Passwords are case-sensitive
3. Make sure Caps Lock is off
4. Try admin account first: `admin` / `admin123456`

**Verify in database:**
```bash
cd backend
python manage.py shell
```

```python
from users.models import CustomUser
# List all users
CustomUser.objects.all().values('username', 'email')

# Check if admin exists
CustomUser.objects.filter(username='admin').exists()  # Should be True

# Exit shell
exit()
```

---

### Issue 3: Token Not Stored

**Cause:** Login succeeded but token not saved to localStorage

**Symptoms:**
- Login page closes but immediately redirects to login again
- Navbar shows "Sign Up" instead of "Welcome [Name]"

**Fix:**
1. Check browser DevTools → Application → Local Storage
2. Should see `token` and `user` entries
3. If missing, there's a frontend issue
4. Check console for JavaScript errors

**Updated code is in place** - make sure you have the latest version of Login.js

---

### Issue 4: CORS Error

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:8000/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Fix:** Update `backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

Then restart backend:
```bash
python manage.py runserver
```

---

### Issue 5: Cannot Connect to Backend

**Symptoms:**
```
Failed to fetch
Connection refused
ERR_CONNECTION_REFUSED
```

**Cause:** Backend not running

**Fix:**
```bash
cd backend
python manage.py runserver
# Should see:
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CONTROL-C.
```

---

### Issue 6: Logged in but Protected Routes Don't Work

**Symptoms:**
- Can login successfully
- But can't access /profile, /chat, /schemes
- Redirects back to login

**Cause:** Token not being sent with requests

**Check in api.js:**
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;  // This is important!
  }
  return config;
});
```

Make sure this interceptor exists. The key part is `Token ${token}` - must have "Token " prefix.

---

## 🔍 Complete Debugging Checklist

Run through this entire checklist:

### Backend Checks
- [ ] Backend running: `python manage.py runserver`
- [ ] Admin user exists: Check database
- [ ] Migrations applied: `python manage.py showmigrations`
- [ ] CORS configured: Check settings.py
- [ ] API endpoint works: Test with cURL

### Frontend Checks
- [ ] Frontend running: `npm start`
- [ ] API_BASE_URL correct in api.js
- [ ] .env file exists with correct URL
- [ ] Login component has error handling
- [ ] Console has no JavaScript errors
- [ ] localStorage saving token and user

### Network Checks
- [ ] Backend responds to requests
- [ ] Frontend can reach backend
- [ ] No 404 errors on API calls
- [ ] No CORS errors
- [ ] Response has correct format

### User Checks
- [ ] User account exists
- [ ] Password is correct
- [ ] User is not inactive/deleted
- [ ] Username matches exactly

---

## 🧪 Test Complete Login Flow

### Step 1: Register New User
```bash
curl -X POST http://localhost:8000/api/users/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testlogin",
    "email": "testlogin@example.com",
    "password": "TestPass123",
    "first_name": "Test",
    "last_name": "Login",
    "age": 30,
    "occupation": "Developer",
    "state": "Delhi",
    "phone_number": "9999999999"
  }'
```

Save the `token` from response.

### Step 2: Login with New User
```bash
curl -X POST http://localhost:8000/api/users/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testlogin",
    "password": "TestPass123"
  }'
```

You should get same token.

### Step 3: Access Protected Endpoint
```bash
curl -X GET http://localhost:8000/api/users/profile/profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with actual token from Step 2.

Should return user profile, not 401 Unauthorized.

---

## 📱 Frontend Testing

### Test 1: Can you see Login Page?
- Go to http://localhost:3000/login
- Can you see username/password inputs?
- Can you type in them?

### Test 2: Does API Call Work?
Open browser console (F12):
```javascript
// Paste this in console:
fetch('http://localhost:8000/api/users/auth/login/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123456'
  })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```

Should see response with token.

### Test 3: Is Token Being Saved?
After login, in browser console:
```javascript
localStorage.getItem('token')
localStorage.getItem('user')
```

Should both return values, not null.

---

## 🚀 Quick Fix Summary

| Problem | Quick Fix |
|---------|-----------|
| Can't login | Restart backend: `python manage.py runserver` |
| Wrong password | Check admin creds: `admin` / `admin123456` |
| CORS error | Update CORS_ALLOWED_ORIGINS in settings.py |
| Token not saving | Check latest Login.js code |
| 404 on login | Check API URL in api.js is correct |
| Stays on login page | Check if token is saved in localStorage |

---

## 📞 If Still Not Working

Gather this information and check:

1. **Backend status**
   ```bash
   python manage.py runserver
   ```
   Does it start without errors?

2. **Test login endpoint**
   ```bash
   curl -X POST http://localhost:8000/api/users/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123456"}'
   ```
   Do you get a token back?

3. **Check browser console**
   - F12 → Console tab
   - Try to login
   - What errors appear?

4. **Check Network tab**
   - F12 → Network tab
   - Try to login
   - Click on POST to auth/login/
   - What status code? (200, 401, 404, 500?)
   - What's in Response tab?

Provide these details and we can fix it!

---

## ✅ Verification

After following this guide:

- [x] Backend running and accessible
- [x] Can login via cURL
- [x] Can register new user
- [x] Frontend receives token
- [x] Token saved in localStorage
- [x] Can access protected routes
- [x] Navbar shows user greeting

**Login should now work properly!** 🎉
