# SmartGov AI - API Documentation

Complete API reference for SmartGov AI backend.

## Base URL

```
http://localhost:8000/api
```

All requests must include authentication token in header:
```
Authorization: Token your_token_here
```

## Response Format

All responses are JSON:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Authentication Endpoints

### 1. User Registration

**POST** `/auth/auth/register/`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "age": 25,
  "occupation": "Software Engineer",
  "state": "Maharashtra",
  "phone": "9876543210"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "token": "abc123def456..."
}
```

**Error Cases:**
- `400`: Missing required fields
- `400`: Email already exists
- `400`: Username already exists
- `400`: Invalid email format

---

### 2. User Login

**POST** `/auth/auth/login/`

Authenticate user and get token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "token": "abc123def456...",
  "user_id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Error Cases:**
- `400`: Missing username or password
- `401`: Invalid credentials

---

### 3. User Logout

**POST** `/auth/auth/logout/`

Logout user and invalidate token.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

---

## User Profile Endpoints

### 4. Get User Profile

**GET** `/auth/profile/profile/`

Retrieve logged-in user's profile.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "age": 25,
  "occupation": "Software Engineer",
  "state": "Maharashtra",
  "phone": "9876543210",
  "aadhar_verified": false,
  "aadhar_masked": null,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 5. Update User Profile

**PUT** `/auth/profile/update_profile/`

Update user's profile information.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "first_name": "Johnny",
  "last_name": "Doe",
  "age": 26,
  "occupation": "Senior Engineer",
  "state": "Karnataka",
  "phone": "9876543211"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### 6. Get User History

**GET** `/auth/profile/history/`

Get user's activity history.

**Query Parameters:**
- `limit`: Number of records (default: 10)
- `offset`: Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/auth/profile/history/?offset=10",
  "previous": null,
  "results": [
    {
      "id": 1,
      "action": "viewed_scheme",
      "description": "Viewed National Scholarship Scheme",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Aadhar Verification Endpoints

### 7. Verify Aadhar

**POST** `/auth/aadhar/verify_aadhar/`

Verify user's Aadhar number.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "aadhar_number": "123456789012"
}
```

**Validation:**
- Must be exactly 12 digits
- Numbers only (no spaces, hyphens)

**Response (200 OK):**
```json
{
  "message": "Aadhar verified successfully",
  "aadhar_masked": "****6789012",
  "verified": true,
  "verified_at": "2024-01-15T10:30:00Z"
}
```

**Error Cases:**
- `400`: Invalid Aadhar number (not 12 digits)
- `400`: Aadhar already verified
- `400`: Invalid Aadhar number

---

### 8. Get Verification Status

**GET** `/auth/aadhar/verification_status/`

Check Aadhar verification status.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
  "verified": true,
  "aadhar_masked": "****6789012",
  "verified_at": "2024-01-15T10:30:00Z"
}
```

---

## User Preferences Endpoints

### 9. Get Preferences

**GET** `/auth/preferences/get_preferences/`

Get user's preferences.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
  "language": "en",
  "email_notifications": true,
  "sms_notifications": false,
  "voice_output": true,
  "reminder_enabled": true,
  "preferred_contact": "email"
}
```

---

### 10. Update Preferences

**PUT** `/auth/preferences/update_preferences/`

Update user's preferences.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "language": "hi",
  "email_notifications": true,
  "sms_notifications": true,
  "voice_output": true,
  "reminder_enabled": true,
  "preferred_contact": "both"
}
```

**Allowed Values:**
- `language`: "en", "hi"
- `voice_output`: true, false
- `reminder_enabled`: true, false
- `preferred_contact`: "email", "sms", "both"

**Response (200 OK):**
```json
{
  "message": "Preferences updated successfully",
  "preferences": { ... }
}
```

---

## Schemes Endpoints

### 11. List All Schemes

**GET** `/schemes/schemes/`

Get all available schemes.

**Query Parameters:**
- `category`: Filter by category (education, health, employment, agriculture, pension)
- `state`: Filter by state
- `search`: Search by name or description
- `limit`: Results per page (default: 10)
- `offset`: Pagination offset (default: 0)

**Example:**
```
GET /schemes/schemes/?category=education&state=Maharashtra
```

**Response (200 OK):**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/schemes/schemes/?offset=10",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "National Scholarship Scheme",
      "category": "education",
      "description": "Financial assistance for meritorious students",
      "eligibility": "Merit + Income based",
      "benefits": "₹10,000 to ₹50,000 per year",
      "documents_required": "Class XII marks, Income certificate, Aadhar",
      "application_deadline": "2024-12-31",
      "age_min": 16,
      "age_max": 25,
      "applicable_states": ["All"],
      "applicable_occupations": ["Student"]
    }
  ]
}
```

---

### 12. Get Personalized Schemes

**GET** `/schemes/schemes/personalized/`

Get schemes matched to user's profile.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Query Parameters:**
- `category`: Filter by category (optional)

Schemes are filtered by:
- User's age (within scheme's min/max age)
- User's occupation (if listed in scheme)
- User's state (if listed in scheme)

**Response (200 OK):**
```json
{
  "count": 12,
  "results": [
    {
      "id": 1,
      "name": "National Scholarship Scheme",
      "match_score": 95,
      "reason": "Your profile matches 95% of scheme requirements"
      ...
    }
  ]
}
```

---

### 13. Get Saved Schemes

**GET** `/schemes/schemes/saved_schemes/`

Get user's bookmarked schemes.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
  "count": 5,
  "results": [
    {
      "scheme_id": 1,
      "scheme_name": "National Scholarship Scheme",
      "saved_at": "2024-01-15T10:30:00Z",
      ...
    }
  ]
}
```

---

### 14. Save Scheme

**POST** `/schemes/schemes/save_scheme/`

Bookmark a scheme.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "scheme_id": 1
}
```

**Response (201 Created):**
```json
{
  "message": "Scheme saved successfully",
  "saved_at": "2024-01-15T10:30:00Z"
}
```

---

### 15. Track Scheme View

**POST** `/schemes/schemes/track_view/`

Record that user viewed a scheme.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "scheme_id": 1
}
```

**Response (201 Created):**
```json
{
  "message": "View tracked successfully"
}
```

---

## Document Checklist Endpoints

### 16. Generate Document Checklist

**POST** `/schemes/documents/generate_checklist/`

Generate personalized document checklist for a scheme.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "scheme_id": 1
}
```

Documents are generated based on:
- User's age
- User's occupation
- User's state
- Scheme requirements

**Response (201 Created):**
```json
{
  "id": 1,
  "scheme_id": 1,
  "scheme_name": "National Scholarship Scheme",
  "documents": [
    {
      "name": "Class XII Marksheet",
      "required": true,
      "completed": false,
      "notes": "Latest marks card"
    },
    {
      "name": "Income Certificate",
      "required": true,
      "completed": false,
      "notes": "Issued by Revenue Department"
    },
    {
      "name": "Aadhar Card",
      "required": true,
      "completed": true,
      "notes": "Verified Aadhar"
    }
  ],
  "completion_percentage": 33
}
```

---

### 17. Get User Checklists

**GET** `/schemes/documents/user_checklists/`

Get all document checklists for user.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "scheme_name": "National Scholarship Scheme",
      "completion_percentage": 33,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 18. Update Checklist

**PUT** `/schemes/documents/update_checklist/`

Mark documents as completed.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "checklist_id": 1,
  "documents": [
    {
      "name": "Class XII Marksheet",
      "completed": true
    },
    {
      "name": "Income Certificate",
      "completed": true
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Checklist updated successfully",
  "completion_percentage": 67
}
```

---

## Reminder Endpoints

### 19. Create Reminder

**POST** `/schemes/reminders/create_reminder/`

Create a scheme reminder.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "scheme_id": 1,
  "reminder_type": "deadline",
  "reminder_date": "2024-02-15"
}
```

**Reminder Types:**
- "deadline": Application deadline reminder
- "application": Reminder to apply
- "completion": Follow-up reminder

**Response (201 Created):**
```json
{
  "id": 1,
  "scheme_id": 1,
  "reminder_type": "deadline",
  "reminder_date": "2024-02-15",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 20. Get User Reminders

**GET** `/schemes/reminders/user_reminders/`

Get all user's reminders.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Query Parameters:**
- `status`: "active", "sent", "completed"

**Response (200 OK):**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "scheme_name": "National Scholarship Scheme",
      "reminder_type": "deadline",
      "reminder_date": "2024-02-15",
      "status": "active"
    }
  ]
}
```

---

### 21. Mark Reminder as Sent

**PUT** `/schemes/reminders/mark_sent/`

Mark reminder as sent.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "reminder_id": 1
}
```

**Response (200 OK):**
```json
{
  "message": "Reminder marked as sent",
  "status": "sent"
}
```

---

## Chat & AI Endpoints

### 22. Create Chat Session

**POST** `/chatbot/sessions/`

Create a new chat session.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "title": "Education Schemes Discussion"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Education Schemes Discussion",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 23. Get Chat Sessions

**GET** `/chatbot/sessions/`

Get user's chat sessions.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "title": "Education Schemes Discussion",
      "message_count": 10,
      "last_message": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 24. Send Chat Message

**POST** `/chatbot/chatbot/send_message/`

Send message to AI assistant.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body:**
```json
{
  "session_id": 1,
  "message": "What schemes are available for students?",
  "language": "en",
  "category": "scheme_info"
}
```

**Languages:**
- "en": English
- "hi": Hindi

**Categories:**
- "general": General queries
- "scheme_info": Scheme information
- "eligibility": Eligibility questions
- "documents": Document requirements

**Response (201 Created):**
```json
{
  "id": 1,
  "session_id": 1,
  "user_message": "What schemes are available for students?",
  "ai_response": "Based on your profile, here are available schemes for students...",
  "language": "en",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response Time:** 5-10 seconds (depending on OpenAI API)

---

### 25. Send Voice Message

**POST** `/chatbot/chatbot/voice_input/`

Send voice message to AI.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Request Body (multipart/form-data):**
```
session_id: 1
audio_file: <binary audio file>
language: en
```

**Supported Formats:**
- WAV
- MP3
- OGG
- FLAC

**Response (201 Created):**
```json
{
  "id": 1,
  "session_id": 1,
  "user_message": "What schemes are available for students?",
  "ai_response": "Based on your profile, here are available schemes for students...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Prompt Templates Endpoints

### 26. Get Prompt Templates

**GET** `/chatbot/prompts/by_category/`

Get prompt templates for AI responses.

**Headers Required:**
```
Authorization: Token your_token_here
```

**Query Parameters:**
- `category`: scheme_info, eligibility, documents

**Response (200 OK):**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "category": "scheme_info",
      "prompt": "Provide information about {scheme_name} including benefits, eligibility, and application process.",
      "language": "en",
      "temperature": 0.5,
      "max_tokens": 500
    }
  ]
}
```

---

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |
| 503 | Unavailable | Service temporarily unavailable |

---

## Rate Limiting

- **API Rate Limit**: 100 requests per minute per user
- **Chat Limit**: 10 messages per minute

If rate limit exceeded:
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

---

## Testing with cURL

### Example: Login
```bash
curl -X POST http://localhost:8000/api/auth/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"SecurePass123!"}'
```

### Example: Get Profile
```bash
curl -X GET http://localhost:8000/api/auth/profile/profile/ \
  -H "Authorization: Token abc123def456..."
```

### Example: Send Chat Message
```bash
curl -X POST http://localhost:8000/api/chatbot/chatbot/send_message/ \
  -H "Authorization: Token abc123def456..." \
  -H "Content-Type: application/json" \
  -d '{"session_id":1,"message":"Tell me about education schemes","language":"en","category":"scheme_info"}'
```

---

## Webhook Events (Coming Soon)

- `user.registered`: New user registered
- `scheme.applied`: User applied for scheme
- `aadhar.verified`: Aadhar verification completed
- `reminder.triggered`: Reminder should be sent

---

## API Versioning

Current version: v1

Future requests should use:
```
GET /api/v1/auth/profile/
```

---

For more information, visit: http://localhost:8000/api/docs/ (Swagger UI)
