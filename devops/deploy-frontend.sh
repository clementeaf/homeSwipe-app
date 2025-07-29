#!/bin/bash

# HomeSwipe Frontend Deployment Script
# Este script despliega el frontend a S3 y CloudFront

set -e

echo "🚀 Iniciando despliegue del frontend HomeSwipe..."

# Variables
STAGE=${1:-dev}
REGION=${2:-us-east-1}
FRONTEND_DIR="../frontend"

echo "📋 Configuración:"
echo "   Stage: $STAGE"
echo "   Region: $REGION"
echo "   Frontend Directory: $FRONTEND_DIR"

# Verificar que el directorio frontend existe
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Error: Directorio frontend no encontrado en $FRONTEND_DIR"
    exit 1
fi

# Navegar al directorio frontend
cd "$FRONTEND_DIR"

# Verificar que AWS CLI esté configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: AWS CLI no está configurado. Ejecuta 'aws configure' primero."
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

# Construir el proyecto
echo "🔨 Construyendo el proyecto..."
npm run build

# Obtener el nombre del bucket desde CloudFormation
echo "📦 Obteniendo información del bucket S3..."
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name homeswipe-infrastructure-$STAGE \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
    --output text 2>/dev/null || echo "homeswipe-frontend-$STAGE")

echo "📁 Bucket S3: $BUCKET_NAME"

# Sincronizar archivos con S3
echo "📤 Subiendo archivos a S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# Invalidar caché de CloudFront
echo "🔄 Invalidando caché de CloudFront..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name homeswipe-infrastructure-$STAGE \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ ! -z "$DISTRIBUTION_ID" ]; then
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
    echo "✅ Invalidación de CloudFront iniciada"
else
    echo "⚠️  No se pudo obtener el ID de distribución de CloudFront"
fi

echo "✅ Frontend desplegado exitosamente!"
echo ""
echo "📊 Información del despliegue:"
echo "   - Bucket S3: $BUCKET_NAME"
echo "   - CloudFront Distribution: $DISTRIBUTION_ID"
echo "   - Region: $REGION"
echo "   - Stage: $STAGE"
echo ""
echo "🔗 URLs disponibles:"
echo "   - S3 Website: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo "   - CloudFront: https://[cloudfront-domain]"
fi