# API Testing Scripts for Create Candidate Endpoint

This directory contains comprehensive curl-based tests for the Create Candidate API endpoint.

## Prerequisites

1. **Backend server must be running** on `http://localhost:3010`
2. **Database must be accessible** and properly configured
3. **curl** must be installed on your system
4. **jq** (optional) for better JSON formatting in quick test

## Test Scripts

### 1. Quick Test (`quick_test_candidate.sh`)

A simple, fast test script that covers the most common scenarios:

```bash
./quick_test_candidate.sh
```

**What it tests:**
- ✅ Basic candidate creation with all fields
- ✅ Candidate with ongoing education (no endDate)
- ✅ Basic validation (missing required fields)

**Expected output:**
- Green checkmarks (✅) for successful tests
- Red X marks (❌) for failures
- Yellow warnings (⚠️) for unexpected behavior

### 2. Comprehensive Test (`test_create_candidate.sh`)

A thorough test suite covering all edge cases and validation scenarios:

```bash
./test_create_candidate.sh
```

**What it tests:**
1. **Minimal required fields** - Basic candidate creation
2. **Complete information** - All fields including multiple education/work entries
3. **Ongoing education** - Education without endDate
4. **Missing required fields** - Validation testing
5. **Invalid email format** - Email validation
6. **Duplicate email** - Uniqueness constraint
7. **File upload** - Multipart form data with CV file
8. **Invalid date format** - Date validation
9. **Invalid date range** - End date before start date
10. **Empty education array** - Business rule validation

## API Endpoint Details

### Create Candidate Endpoint
- **URL:** `POST http://localhost:3010/api/candidates`
- **Content-Type:** `application/json` or `multipart/form-data` (for file uploads)

### Request Format (JSON)

```json
{
  "firstName": "string (required)",
  "lastName": "string (required)", 
  "email": "string (required, unique, valid email)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "education": [
    {
      "institution": "string (required)",
      "title": "string (required)",
      "startDate": "ISO date string (required)",
      "endDate": "ISO date string (optional)"
    }
  ],
  "workExperience": [
    {
      "company": "string (required)",
      "position": "string (required)",
      "description": "string (required)",
      "startDate": "ISO date string (required)",
      "endDate": "ISO date string (required)"
    }
  ]
}
```

### Request Format (Multipart Form Data)

For file uploads, use form fields:
- `firstName`, `lastName`, `email`, `phone`, `address` as text fields
- `education` and `workExperience` as JSON strings
- `cv` as file upload

### Expected Responses

#### Success (201 Created)
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "address": "123 Main St",
  "education": [...],
  "workExperience": [...],
  "resume": {...},
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Error (400 Bad Request)
```json
{
  "error": "Error message describing what went wrong"
}
```

## Common Test Scenarios

### 1. Basic Candidate Creation
```bash
curl -X POST http://localhost:3010/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john.doe@example.com",
    "education": [
      {
        "institution": "University",
        "title": "Computer Science",
        "startDate": "2020-09-01T00:00:00.000Z"
      }
    ],
    "workExperience": []
  }'
```

### 2. Candidate with File Upload
```bash
curl -X POST http://localhost:3010/api/candidates \
  -F "firstName=Jane" \
  -F "lastName=Smith" \
  -F "email=jane.smith@example.com" \
  -F 'education=[{"institution":"MIT","title":"CS","startDate":"2020-09-01T00:00:00.000Z"}]' \
  -F 'workExperience=[]' \
  -F "cv=@resume.pdf"
```

### 3. Ongoing Education (No End Date)
```bash
curl -X POST http://localhost:3010/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "education": [
      {
        "institution": "Stanford",
        "title": "PhD Computer Science",
        "startDate": "2023-09-01T00:00:00.000Z"
      }
    ],
    "workExperience": []
  }'
```

## Validation Rules

The API enforces these validation rules:

### Required Fields
- `firstName` (non-empty string)
- `lastName` (non-empty string)  
- `email` (valid email format, unique)

### Education Rules
- `institution` (required)
- `title` (required)
- `startDate` (required, valid ISO date)
- `endDate` (optional, must be after startDate if provided)

### Work Experience Rules
- `company` (required)
- `position` (required)
- `description` (required)
- `startDate` (required, valid ISO date)
- `endDate` (required, must be after startDate)

### Business Rules
- Email must be unique across all candidates
- Dates cannot be in the future
- End dates must be after start dates
- At least one education entry may be required (check frontend validation)

## Troubleshooting

### Server Not Running
```
✗ Backend server is not accessible at http://localhost:3010
```
**Solution:** Start the backend server with `npm run dev` in the backend directory.

### Database Connection Issues
```
{"error": "Database connection failed"}
```
**Solution:** Check database configuration and ensure PostgreSQL is running.

### Permission Denied
```
bash: ./test_create_candidate.sh: Permission denied
```
**Solution:** Make the script executable with `chmod +x test_create_candidate.sh`

### File Upload Issues
```
{"error": "Solo se permiten archivos PDF o DOCX."}
```
**Solution:** Ensure uploaded files are PDF or DOCX format and under 5MB.

## Notes

- Tests use unique email addresses to avoid conflicts
- Some validation may be handled on the frontend only
- The comprehensive test creates temporary files that are automatically cleaned up
- Tests are designed to be run multiple times safely
- Check the actual responses to verify expected behavior matches your requirements 