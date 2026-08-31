#!/usr/bin/env bash
# Quick deploy script for SRFPC
set -e

MSG="${1:-Update website content: $(date '+%Y-%m-%d %H:%M:%S')}"

echo "🔄 Staging changes..."
git add .

echo "📝 Committing: '$MSG'..."
git commit -m "$MSG" || echo "No new changes to commit."

echo "🚀 Pushing to GitHub (origin main)..."
git push origin main

echo "✅ Done! Vercel is now deploying your changes live."
