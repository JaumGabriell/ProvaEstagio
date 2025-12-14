#!/bin/bash

echo "Testing API endpoints..."

API_URL="http://localhost:8000"

echo "Checking root endpoint..."
curl -f $API_URL/ || exit 1
echo " OK!"

echo "Checking categories endpoint..."
curl -f $API_URL/api/categories/ || exit 1
echo " OK!"

echo "Checking notes endpoint..."
curl -f $API_URL/api/notes/ || exit 1
echo " OK!"

echo "All API tests passed!"
