#!/bin/bash

# HomeSwipe Infrastructure Deployment Script
# Este script despliega la infraestructura AWS base

set -e

echo "🚀 Iniciando despliegue de infraestructura HomeSwipe..."

# Variables
STAGE=${1:-dev}
REGION=${2:-us-east-1}

echo "📋 Configuración:"
echo "   Stage: $STAGE"
echo "   Region: $REGION"

# Verificar que AWS CLI esté configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: AWS CLI no está configurado. Ejecuta 'aws configure' primero."
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Desplegar infraestructura con Serverless Framework
echo "🏗️  Desplegando infraestructura AWS..."
npx serverless deploy --config infrastructure.yml --stage $STAGE --region $REGION

echo "✅ Infraestructura desplegada exitosamente!"
echo ""
echo "📊 Recursos creados:"
echo "   - DynamoDB Table: homeswipe-users-$STAGE"
echo "   - S3 Frontend Bucket: homeswipe-frontend-$STAGE"
echo "   - S3 Uploads Bucket: homeswipe-uploads-$STAGE"
echo "   - CloudFront Distribution"
echo ""
echo "🔗 URLs disponibles después del despliegue completo:"
echo "   - Frontend: https://[cloudfront-domain]"
echo "   - API Gateway: https://[api-gateway-url]"