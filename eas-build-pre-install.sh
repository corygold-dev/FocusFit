#!/bin/bash

# Fix RCT-Folly dependencies
echo "Running pre-install script for EAS build..."

# Apply patches
echo "Applying patches..."
npx patch-package

# Force pod repo update to get latest specs
echo "Updating CocoaPods repos..."
pod repo update

echo "Pre-install script completed"