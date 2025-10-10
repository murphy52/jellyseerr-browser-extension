#!/bin/bash

# Replace these with your actual values
JELLYSEERR_URL="YOUR_JELLYSEERR_URL"
API_KEY="YOUR_API_KEY"

echo "🔍 Testing Jellyseerr API for 'IT: Welcome to Derry' (tt19244304)"
echo "=================================================="

# 1. Test basic connection
echo "1. Testing connection..."
curl -s -H "X-Api-Key: $API_KEY" "$JELLYSEERR_URL/api/v1/auth/me" | jq '.'

echo -e "\n2. Search for 'IT: Welcome to Derry'..."
curl -s -H "X-Api-Key: $API_KEY" "$JELLYSEERR_URL/api/v1/search?query=IT:%20Welcome%20to%20Derry" | jq '.results[] | {id, title, name, mediaType}'

echo -e "\n3. Search for 'Welcome to Derry'..."  
curl -s -H "X-Api-Key: $API_KEY" "$JELLYSEERR_URL/api/v1/search?query=Welcome%20to%20Derry" | jq '.results[] | {id, title, name, mediaType}'

echo -e "\n4. Get all requests (first 20)..."
curl -s -H "X-Api-Key: $API_KEY" "$JELLYSEERR_URL/api/v1/request?take=20&skip=0" | jq '.results[] | {id, status, type, media: {title: .media.title, name: .media.name, tmdbId: .media.tmdbId}}'

echo -e "\n5. Look for requests containing 'Derry' or 'IT'..."
curl -s -H "X-Api-Key: $API_KEY" "$JELLYSEERR_URL/api/v1/request?take=100&skip=0" | jq '.results[] | select(.media.title // .media.name | test("(?i)(derry|it.*welcome)")) | {id, status, type, title: (.media.title // .media.name), tmdbId: .media.tmdbId}'

echo -e "\nStatus Code Meanings:"
echo "1 = Unknown"
echo "2 = Pending"  
echo "3 = Processing/Approved"
echo "4 = Partially Available"
echo "5 = Available"