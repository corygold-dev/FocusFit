#!/bin/bash

set -e

echo "🚀 Running pre-install script for EAS build..."

# Apply patches (if you use patch-package)
echo "📦 Applying patch-package fixes..."
npx patch-package || true

# Update CocoaPods repo to make sure we get latest podspecs
echo "🔄 Updating CocoaPods repos..."
pod repo update

echo "✅ Pre-install script completed"
