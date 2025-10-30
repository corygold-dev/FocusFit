#!/bin/bash

# Script to validate Firebase environment setup
# Usage: ./scripts/validate-env.sh

set -e

echo "🔍 Validating Firebase Environment Setup..."
echo ""

ERRORS=0

# Check for required environment files
echo "📁 Checking environment files..."

if [ -f ".env.development" ]; then
  echo "  ✅ .env.development found"
else
  echo "  ❌ .env.development missing"
  ERRORS=$((ERRORS + 1))
fi

if [ -f ".env.production" ]; then
  echo "  ✅ .env.production found"
else
  echo "  ❌ .env.production missing"
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "📱 Checking Firebase config files..."

# Check dev files
if [ -f "google-services.dev.json" ]; then
  echo "  ✅ google-services.dev.json found"
else
  echo "  ❌ google-services.dev.json missing"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "GoogleService-Info.dev.plist" ]; then
  echo "  ✅ GoogleService-Info.dev.plist found"
else
  echo "  ❌ GoogleService-Info.dev.plist missing"
  ERRORS=$((ERRORS + 1))
fi

# Check prod files
if [ -f "google-services.prod.json" ]; then
  echo "  ✅ google-services.prod.json found"
else
  echo "  ❌ google-services.prod.json missing"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "GoogleService-Info.prod.plist" ]; then
  echo "  ✅ GoogleService-Info.prod.plist found"
else
  echo "  ❌ GoogleService-Info.prod.plist missing"
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🔑 Validating environment variables..."

# Check dev env vars
if grep -q "EXPO_PUBLIC_FIREBASE_PROJECT_ID=focusfit-dev" .env.development; then
  echo "  ✅ Dev Firebase project ID correct"
else
  echo "  ❌ Dev Firebase project ID incorrect or missing"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "EXPO_PUBLIC_ENV=development" .env.development; then
  echo "  ✅ Dev environment identifier set"
else
  echo "  ❌ Dev environment identifier missing"
  ERRORS=$((ERRORS + 1))
fi

# Check prod env vars
if grep -q "EXPO_PUBLIC_FIREBASE_PROJECT_ID=focusfit-fde9e" .env.production; then
  echo "  ✅ Prod Firebase project ID correct"
else
  echo "  ❌ Prod Firebase project ID incorrect or missing"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "EXPO_PUBLIC_ENV=production" .env.production; then
  echo "  ✅ Prod environment identifier set"
else
  echo "  ❌ Prod environment identifier missing"
  ERRORS=$((ERRORS + 1))
fi

# Check current active environment
echo ""
echo "🎯 Current Active Environment:"
if [ -f "google-services.json" ]; then
  ACTIVE_PROJECT=$(grep -o '"project_id": *"[^"]*"' google-services.json | head -1 | sed 's/"project_id": *"\([^"]*\)"/\1/')
  if [ "$ACTIVE_PROJECT" = "focusfit-dev" ]; then
    echo "  🟢 Development (focusfit-dev)"
  elif [ "$ACTIVE_PROJECT" = "focusfit-fde9e" ]; then
    echo "  🔴 Production (focusfit-fde9e)"
    echo "  ⚠️  You are on PRODUCTION - switch to dev for local work!"
  else
    echo "  ⚠️  Unknown project: $ACTIVE_PROJECT"
  fi
else
  echo "  ❌ No active environment (run npm run env:dev)"
  ERRORS=$((ERRORS + 1))
fi

# Check for old .env file
echo ""
echo "🧹 Checking for deprecated files..."
if [ -f ".env" ]; then
  echo "  ⚠️  Old .env file found - should be deleted"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ No deprecated .env file"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo "✅ All checks passed! Environment setup is correct."
  echo ""
  echo "💡 Next steps:"
  echo "   - Local dev: npm run env:dev && npm start"
  echo "   - Preview build: npm run build:preview:ios"
  echo "   - Production build: npm run build:prod:ios"
  exit 0
else
  echo "❌ Found $ERRORS error(s) in environment setup."
  echo ""
  echo "📚 See QUICK_START.md for setup instructions"
  exit 1
fi

