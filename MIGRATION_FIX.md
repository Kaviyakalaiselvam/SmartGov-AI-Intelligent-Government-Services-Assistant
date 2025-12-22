# SmartGov AI - Migration Fix Guide

## 🔧 Fixing the CustomUser Migration Error

### Problem
```
ValueError: The field admin.LogEntry.user was declared with a lazy reference 
to 'users.customuser', but app 'users' doesn't provide model 'customuser'.
```

This happens when Django can't find the CustomUser model during migrations, usually because:
1. Old migrations exist with outdated references
2. Database state is out of sync
3. Fresh project with incomplete initial migrations

---

## ✅ Solution: Clean Reset & Fresh Migrations

### Step 1: Delete Old Migration Files
Navigate to your backend folder and delete migration files (except __init__.py):

**Windows (PowerShell):**
```powershell
cd backend

# Remove migration files from each app
Remove-Item users/migrations/*.py -Exclude "__init__.py"
Remove-Item schemes/migrations/*.py -Exclude "__init__.py"
Remove-Item chatbot/migrations/*.py -Exclude "__init__.py"

# Remove database
Remove-Item db.sqlite3
```

**macOS/Linux:**
```bash
cd backend

# Remove migration files
rm users/migrations/*.py 2>/dev/null || true
rm schemes/migrations/*.py 2>/dev/null || true
rm chatbot/migrations/*.py 2>/dev/null || true

# Keep only __init__.py
touch users/migrations/__init__.py
touch schemes/migrations/__init__.py
touch chatbot/migrations/__init__.py

# Remove database
rm db.sqlite3
```

### Step 2: Clear Python Cache

**Windows (PowerShell):**
```powershell
Get-ChildItem -Path . -Name "__pycache__" -Recurse -Force | Remove-Item -Recurse -Force
```

**macOS/Linux:**
```bash
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
```

### Step 3: Create Fresh Migrations

```bash
# Ensure you're in the backend folder
cd backend

# Make fresh migrations for all apps
python manage.py makemigrations users
python manage.py makemigrations schemes
python manage.py makemigrations chatbot

# Check migrations were created
python manage.py showmigrations
```

Expected output:
```
users
 [ ] 0001_initial

schemes
 [ ] 0001_initial

chatbot
 [ ] 0001_initial
```

### Step 4: Run Migrations

```bash
python manage.py migrate
```

You should see:
```
Running migrations:
  Applying contenttypes.0001_initial...
  Applying auth.0001_initial...
  Applying users.0001_initial...
  Applying admin.0001_initial...
  ...
  OK
```

### Step 5: Create Superuser

```bash
python manage.py createsuperuser
# Follow the prompts to create admin account
```

### Step 6: Verify Everything Works

```bash
python manage.py runserver
```

Access http://localhost:8000/admin/ and login with your superuser credentials.

---

## 🚀 Alternative Quick Fix (One Command)

If the above doesn't work, try this atomic reset:

**Windows (PowerShell):**
```powershell
cd backend

# Remove everything
Remove-Item db.sqlite3 -ErrorAction SilentlyContinue
Get-ChildItem -Path . -Name "__pycache__" -Recurse -Force | Remove-Item -Recurse -Force
Get-ChildItem -Path "users\migrations\*.py" -Exclude "__init__.py" | Remove-Item
Get-ChildItem -Path "schemes\migrations\*.py" -Exclude "__init__.py" | Remove-Item
Get-ChildItem -Path "chatbot\migrations\*.py" -Exclude "__init__.py" | Remove-Item

# Recreate everything
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**macOS/Linux:**
```bash
cd backend

# Remove everything
rm -f db.sqlite3
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
find users schemes chatbot -name "*.py" -path "*/migrations/*" ! -name "__init__.py" -delete

# Recreate everything
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## 📋 Detailed Step-by-Step Instructions

### For Windows Users (Step-by-step in PowerShell)

```powershell
# 1. Navigate to backend
cd backend

# 2. Deactivate virtual environment (if active)
deactivate

# 3. Reactivate virtual environment
.\venv\Scripts\Activate.ps1

# 4. Delete database
Remove-Item db.sqlite3 -ErrorAction SilentlyContinue

# 5. Delete all migration files except __init__.py
ls users/migrations/ | Where {$_.Name -ne "__init__.py"} | Remove-Item
ls schemes/migrations/ | Where {$_.Name -ne "__init__.py"} | Remove-Item
ls chatbot/migrations/ | Where {$_.Name -ne "__init__.py"} | Remove-Item

# 6. Clear Python cache
Get-ChildItem -Recurse -Directory -Name __pycache__ | Remove-Item -Recurse

# 7. Create migrations
python manage.py makemigrations users
python manage.py makemigrations schemes
python manage.py makemigrations chatbot

# 8. Run migrations
python manage.py migrate

# 9. Create superuser
python manage.py createsuperuser

# 10. Test server
python manage.py runserver
```

### For macOS/Linux Users (Step-by-step in Terminal)

```bash
# 1. Navigate to backend
cd backend

# 2. Deactivate virtual environment (if active)
deactivate

# 3. Reactivate virtual environment
source venv/bin/activate

# 4. Delete database
rm -f db.sqlite3

# 5. Delete all migration files except __init__.py
find users schemes chatbot -path "*/migrations/*.py" ! -name "__init__.py" -delete

# 6. Clear Python cache
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true

# 7. Create migrations
python manage.py makemigrations users
python manage.py makemigrations schemes
python manage.py makemigrations chatbot

# 8. Run migrations
python manage.py migrate

# 9. Create superuser
python manage.py createsuperuser

# 10. Test server
python manage.py runserver
```

---

## ✅ Verification Checklist

After following the steps above, verify:

- [ ] No errors during `makemigrations`
- [ ] No errors during `migrate`
- [ ] Superuser created successfully
- [ ] Server starts without errors
- [ ] Can access http://localhost:8000/admin/
- [ ] Can login with superuser credentials
- [ ] Can see users, schemes, chatbot in admin panel

---

## 🐛 If You Still Get Errors

### Error: "django.core.exceptions.AppRegistryNotReady"
**Solution**: Make sure you're running migrations, not Python shell.

### Error: "No such table: users_customuser"
**Solution**: You didn't run `python manage.py migrate`. Run it now.

### Error: "ModuleNotFoundError: No module named 'users'"
**Solution**: Make sure 'users' is in INSTALLED_APPS in settings.py (it should be).

### Error: "Duplicate key value violates unique constraint"
**Solution**: Delete db.sqlite3 and run migrations again.

---

## 🔍 Debugging Commands

```bash
# Check all migrations
python manage.py showmigrations

# Check specific app migrations
python manage.py showmigrations users

# Simulate migrations (don't apply)
python manage.py migrate --plan

# Check database state
python manage.py dbshell

# Create empty migration (advanced)
python manage.py makemigrations --empty users --name fix_something
```

---

## 📝 Important Notes

1. **Development Only**: Never delete database in production!
2. **Backup First**: If you have important data, backup db.sqlite3
3. **Virtual Environment**: Always activate venv before running commands
4. **Python Path**: Ensure python/pip are in your PATH
5. **Fresh Start**: For new projects, this clean reset is normal

---

## ✨ After Migration Fix

Once migrations work, you can:

1. **Load sample data**:
   ```bash
   python manage.py shell
   # Then in shell:
   from schemes.models import Scheme
   Scheme.objects.create(name="Example Scheme", category="education")
   ```

2. **Access admin panel**:
   - Go to http://localhost:8000/admin/
   - Login with superuser credentials
   - Add schemes and manage data

3. **Start development**:
   ```bash
   python manage.py runserver
   ```

---

**This should fix your migration issue!** If you still have problems, run `python manage.py migrate --verbose` for detailed error messages.
