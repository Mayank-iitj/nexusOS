#!/bin/bash
set -e

# Configuration
PROJECT_ID="your-gcp-project-id" # Replace with your actual project ID
REGION="us-central1"

echo "Deploying NexusOS to Google Cloud Run (Project: $PROJECT_ID, Region: $REGION)..."

# 1. Deploy Backend
echo "🚀 Deploying Backend..."
gcloud run deploy nexusos-backend \
  --source backend \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars="ENVIRONMENT=production" \
  --quiet

# Wait a moment to get the URL
BACKEND_URL=$(gcloud run services describe nexusos-backend \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --format 'value(status.url)')

echo "✅ Backend deployed at: $BACKEND_URL"

# 2. Deploy Frontend
echo "🚀 Deploying Frontend..."
gcloud run deploy nexusos-frontend \
  --source frontend \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL" \
  --set-build-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL" \
  --quiet

FRONTEND_URL=$(gcloud run services describe nexusos-frontend \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --format 'value(status.url)')

echo "✅ Frontend deployed at: $FRONTEND_URL"

echo "🎉 Deployment complete!"
echo "Make sure you configure your database and Redis connections as Cloud Run environment variables or secrets!"
