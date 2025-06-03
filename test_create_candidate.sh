#!/bin/bash

# Test script for Create Candidate API endpoint
# Backend should be running on http://localhost:3010

BASE_URL="http://localhost:3010"
API_ENDPOINT="$BASE_URL/api/candidates"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print test headers
print_test() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if server is running
print_test "Checking if backend server is running"
if curl -s "$BASE_URL" > /dev/null; then
    print_success "Backend server is accessible"
else
    print_error "Backend server is not accessible at $BASE_URL"
    echo "Please make sure the backend server is running on port 3010"
    exit 1
fi

# Test 1: Create candidate with minimal required fields
print_test "Test 1: Create candidate with minimal required fields"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe.minimal@example.com",
    "education": [
      {
        "institution": "Test University",
        "title": "Computer Science",
        "startDate": "2020-09-01T00:00:00.000Z"
      }
    ],
    "workExperience": []
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "201" ]; then
    print_success "Minimal candidate created successfully"
    echo "Response: $BODY"
else
    print_error "Failed to create minimal candidate. HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 2: Create candidate with all fields including education with endDate
print_test "Test 2: Create candidate with complete information"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith.complete@example.com",
    "phone": "+1-555-123-4567",
    "address": "123 Main Street, Anytown, USA",
    "education": [
      {
        "institution": "Harvard University",
        "title": "Master of Computer Science",
        "startDate": "2018-09-01T00:00:00.000Z",
        "endDate": "2020-05-15T00:00:00.000Z"
      },
      {
        "institution": "MIT",
        "title": "Bachelor of Engineering",
        "startDate": "2014-09-01T00:00:00.000Z",
        "endDate": "2018-05-15T00:00:00.000Z"
      }
    ],
    "workExperience": [
      {
        "company": "Google",
        "position": "Senior Software Engineer",
        "description": "Full-stack development using React and Node.js",
        "startDate": "2020-06-01T00:00:00.000Z",
        "endDate": "2023-12-31T00:00:00.000Z"
      },
      {
        "company": "Microsoft",
        "position": "Software Engineer",
        "description": "Backend development with .NET Core",
        "startDate": "2018-06-01T00:00:00.000Z",
        "endDate": "2020-05-31T00:00:00.000Z"
      }
    ]
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "201" ]; then
    print_success "Complete candidate created successfully"
    echo "Response: $BODY"
else
    print_error "Failed to create complete candidate. HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 3: Create candidate with ongoing education (no endDate)
print_test "Test 3: Create candidate with ongoing education"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson.ongoing@example.com",
    "education": [
      {
        "institution": "Stanford University",
        "title": "PhD in Computer Science",
        "startDate": "2022-09-01T00:00:00.000Z"
      }
    ],
    "workExperience": [
      {
        "company": "Apple",
        "position": "Research Intern",
        "description": "Machine learning research",
        "startDate": "2023-01-01T00:00:00.000Z",
        "endDate": "2023-12-31T00:00:00.000Z"
      }
    ]
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "201" ]; then
    print_success "Candidate with ongoing education created successfully"
    echo "Response: $BODY"
else
    print_error "Failed to create candidate with ongoing education. HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 4: Try to create candidate with missing required fields
print_test "Test 4: Validation - Missing required fields"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Bob",
    "email": "bob.incomplete@example.com"
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "400" ]; then
    print_success "Validation correctly rejected incomplete data"
    echo "Response: $BODY"
else
    print_warning "Expected 400 error for incomplete data, got: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 5: Try to create candidate with invalid email
print_test "Test 5: Validation - Invalid email format"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Charlie",
    "lastName": "Brown",
    "email": "invalid-email-format",
    "education": [
      {
        "institution": "Test University",
        "title": "Test Degree",
        "startDate": "2020-09-01T00:00:00.000Z"
      }
    ],
    "workExperience": []
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "400" ]; then
    print_success "Validation correctly rejected invalid email"
    echo "Response: $BODY"
else
    print_warning "Expected 400 error for invalid email, got: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 6: Try to create candidate with duplicate email
print_test "Test 6: Validation - Duplicate email"
# First, create a candidate
curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "David",
    "lastName": "Wilson",
    "email": "david.wilson.duplicate@example.com",
    "education": [
      {
        "institution": "Test University",
        "title": "Test Degree",
        "startDate": "2020-09-01T00:00:00.000Z"
      }
    ],
    "workExperience": []
  }' > /dev/null

# Now try to create another with the same email
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "David",
    "lastName": "Smith",
    "email": "david.wilson.duplicate@example.com",
    "education": [
      {
        "institution": "Another University",
        "title": "Another Degree",
        "startDate": "2021-09-01T00:00:00.000Z"
      }
    ],
    "workExperience": []
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "400" ]; then
    print_success "Validation correctly rejected duplicate email"
    echo "Response: $BODY"
else
    print_warning "Expected 400 error for duplicate email, got: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 7: Create candidate with file upload (multipart/form-data)
print_test "Test 7: Create candidate with file upload (multipart/form-data)"

# Create a temporary test file
echo "This is a test CV content" > test_cv.txt

RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -F "firstName=Emma" \
  -F "lastName=Davis" \
  -F "email=emma.davis.withcv@example.com" \
  -F "phone=+1-555-987-6543" \
  -F "address=456 Oak Avenue, Somewhere, USA" \
  -F 'education=[{"institution":"Yale University","title":"MBA","startDate":"2019-09-01T00:00:00.000Z","endDate":"2021-05-15T00:00:00.000Z"}]' \
  -F 'workExperience=[{"company":"Tesla","position":"Product Manager","description":"Leading product development initiatives","startDate":"2021-06-01T00:00:00.000Z","endDate":"2024-01-31T00:00:00.000Z"}]' \
  -F "cv=@test_cv.txt")

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "201" ]; then
    print_success "Candidate with file upload created successfully"
    echo "Response: $BODY"
else
    print_error "Failed to create candidate with file upload. HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Clean up test file
rm -f test_cv.txt

# Test 8: Invalid date format
print_test "Test 8: Validation - Invalid date format"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Frank",
    "lastName": "Miller",
    "email": "frank.miller.invaliddate@example.com",
    "education": [
      {
        "institution": "Test University",
        "title": "Test Degree",
        "startDate": "invalid-date-format"
      }
    ],
    "workExperience": []
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "400" ]; then
    print_success "Validation correctly rejected invalid date format"
    echo "Response: $BODY"
else
    print_warning "Expected 400 error for invalid date, got: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 9: Education end date before start date
print_test "Test 9: Validation - Education end date before start date"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Grace",
    "lastName": "Lee",
    "email": "grace.lee.invalidrange@example.com",
    "education": [
      {
        "institution": "Test University",
        "title": "Test Degree",
        "startDate": "2022-09-01T00:00:00.000Z",
        "endDate": "2020-05-15T00:00:00.000Z"
      }
    ],
    "workExperience": []
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "400" ]; then
    print_success "Validation correctly rejected invalid date range"
    echo "Response: $BODY"
else
    print_warning "Expected 400 error for invalid date range, got: $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 10: Empty education array (should fail based on frontend validation)
print_test "Test 10: Validation - Empty education array"
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Henry",
    "lastName": "Taylor",
    "email": "henry.taylor.noeducation@example.com",
    "education": [],
    "workExperience": []
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTPSTATUS:[0-9]*$//')

if [ "$HTTP_CODE" = "201" ]; then
    print_warning "Backend allows empty education (frontend validation required)"
    echo "Response: $BODY"
elif [ "$HTTP_CODE" = "400" ]; then
    print_success "Validation correctly rejected empty education"
    echo "Response: $BODY"
else
    print_error "Unexpected response for empty education. HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
fi

print_test "Test Summary"
echo -e "${BLUE}All tests completed!${NC}"
echo -e "${YELLOW}Note: Some validations might be handled on the frontend only.${NC}"
echo -e "${YELLOW}Check the responses above to verify expected behavior.${NC}" 