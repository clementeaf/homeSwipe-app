#!/bin/bash

# Script de despliegue del backend con generación automática de rutas
# Uso: ./deploy-backend.sh [prod]

set -e

STAGE=${1:-dev}
echo "🚀 Desplegando backend a AWS Lambda (stage: $STAGE)"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Paso 1: Generando rutas automáticamente...${NC}"
node generate-routes.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Rutas generadas exitosamente${NC}"
else
    echo -e "${RED}❌ Error generando rutas${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Paso 2: Compilando backend...${NC}"
cd ../backend
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend compilado exitosamente${NC}"
else
    echo -e "${RED}❌ Error compilando backend${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Paso 3: Desplegando a AWS Lambda...${NC}"
cd ../devops

if [ "$STAGE" = "prod" ]; then
    echo -e "${YELLOW}🚀 Desplegando a PRODUCCIÓN...${NC}"
    npx serverless deploy --config backend-serverless.yml --stage prod --force
else
    echo -e "${YELLOW}🚀 Desplegando a DESARROLLO...${NC}"
    npx serverless deploy --config backend-serverless.yml --force
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend desplegado exitosamente${NC}"
    
    # Mostrar información del despliegue
    echo -e "${BLUE}📊 Información del despliegue:${NC}"
    if [ "$STAGE" = "prod" ]; then
        npx serverless info --config backend-serverless.yml --stage prod
    else
        npx serverless info --config backend-serverless.yml
    fi
    
    echo -e "${GREEN}🎉 ¡Despliegue completado!${NC}"
else
    echo -e "${RED}❌ Error en el despliegue${NC}"
    exit 1
fi