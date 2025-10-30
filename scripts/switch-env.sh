#!/bin/bash

# Script to switch between Firebase environments
# Usage: ./scripts/switch-env.sh [dev|prod]

set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/switch-env.sh [dev|prod]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/switch-env.sh dev   # Switch to development environment"
  echo "  ./scripts/switch-env.sh prod  # Switch to production environment"
  exit 1
fi

ENV=$1

case $ENV in
  dev|development)
    echo "🔄 Switching to DEVELOPMENT environment..."
    
    if [ ! -f "google-services.dev.json" ]; then
      echo "❌ Error: google-services.dev.json not found"
      echo "Please download it from Firebase Console and save as google-services.dev.json"
      exit 1
    fi
    
    if [ ! -f "GoogleService-Info.dev.plist" ]; then
      echo "❌ Error: GoogleService-Info.dev.plist not found"
      echo "Please download it from Firebase Console and save as GoogleService-Info.dev.plist"
      exit 1
    fi
    
    cp google-services.dev.json google-services.json
    cp GoogleService-Info.dev.plist GoogleService-Info.plist
    
    # Create symlink for .env file so Expo loads the right environment
    rm -f .env
    ln -s .env.development .env
    
    echo "✅ Switched to DEVELOPMENT environment"
    echo "📦 You can now run: npm start"
    ;;
    
  prod|production)
    echo "🔄 Switching to PRODUCTION environment..."
    
    if [ ! -f "google-services.prod.json" ]; then
      echo "❌ Error: google-services.prod.json not found"
      echo "Please download it from Firebase Console and save as google-services.prod.json"
      exit 1
    fi
    
    if [ ! -f "GoogleService-Info.prod.plist" ]; then
      echo "❌ Error: GoogleService-Info.prod.plist not found"
      echo "Please download it from Firebase Console and save as GoogleService-Info.prod.plist"
      exit 1
    fi
    
    cp google-services.prod.json google-services.json
    cp GoogleService-Info.prod.plist GoogleService-Info.plist
    
    # Create symlink for .env file so Expo loads the right environment
    rm -f .env
    ln -s .env.production .env
    
    echo "✅ Switched to PRODUCTION environment"
    echo "⚠️  WARNING: You are now using PRODUCTION Firebase!"
    echo "📦 Build with: eas build --profile production"
    ;;
    
  *)
    echo "❌ Invalid environment: $ENV"
    echo "Usage: ./scripts/switch-env.sh [dev|prod]"
    exit 1
    ;;
esac

# Show which Firebase project is now active
if command -v firebase &> /dev/null; then
  PROJECT_ID=$(grep -o '"project_id": *"[^"]*"' google-services.json | head -1 | sed 's/"project_id": *"\([^"]*\)"/\1/')
  echo ""
  echo "📋 Active Firebase Project: $PROJECT_ID"
fi

