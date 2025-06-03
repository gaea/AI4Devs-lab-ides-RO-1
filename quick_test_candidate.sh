#!/bin/bash

# Quick test for Create Candidate API endpoint
# Usage: ./quick_test_candidate.sh

BASE_URL="http://localhost:3010"
API_ENDPOINT="$BASE_URL/api/candidates"

echo "🚀 Quick test for Create Candidate API"
echo "Testing endpoint: $API_ENDPOINT"
echo ""

# Test 1: Basic candidate creation (using multipart/form-data)
echo "📝 Test 1: Creating a basic candidate..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_ENDPOINT" \
  -F "firstName=Test" \
  -F "lastName=User" \
  -F "email=test.user.quick@example.com" \
  -F "phone=+1-555-000-0000" \
  -F "address=123 Test Street" \
  -F 'education=[{"institution":"Test University","title":"Computer Science","startDate":"2018-09-01T00:00:00.000Z","endDate":"2022-05-15T00:00:00.000Z"}]' \
  -F 'workExperience=[{"company":"Test Company","position":"Software Developer","description":"Full-stack development","startDate":"2022-06-01T00:00:00.000Z","endDate":"2023-12-31T00:00:00.000Z"}]')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ SUCCESS: Candidate created successfully!"
    echo "📄 Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "❌ FAILED: HTTP Code $HTTP_CODE"
    echo "📄 Response: $BODY"
fi

echo ""

# Test 2: Test with ongoing education (no endDate)
echo "📝 Test 2: Creating candidate with ongoing education..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_ENDPOINT" \
  -F "firstName=Ongoing" \
  -F "lastName=Student" \
  -F "email=ongoing.student.quick@example.com" \
  -F 'education=[{"institution":"Current University","title":"PhD in Computer Science","startDate":"2021-09-01T00:00:00.000Z"}]' \
  -F 'workExperience=[]')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ SUCCESS: Candidate with ongoing education created!"
    echo "📄 Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "❌ FAILED: HTTP Code $HTTP_CODE"
    echo "📄 Response: $BODY"
fi

echo ""

# Test 3: Validation test (missing required field) - using multipart
echo "📝 Test 3: Testing validation (missing lastName)..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_ENDPOINT" \
  -F "firstName=Invalid" \
  -F "email=invalid.test@example.com" \
  -F 'education=[]' \
  -F 'workExperience=[]')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "400" ]; then
    echo "✅ SUCCESS: Validation correctly rejected invalid data!"
    echo "📄 Response: $BODY"
elif [ "$HTTP_CODE" = "201" ]; then
    echo "⚠️  WARNING: Expected validation error but candidate was created"
    echo "📄 Response: $BODY"
else
    echo "❌ UNEXPECTED: HTTP Code $HTTP_CODE"
    echo "📄 Response: $BODY"
fi

echo ""
echo "🏁 Quick test completed!"
echo ""
echo "💡 To run comprehensive tests, use: ./test_create_candidate.sh" 