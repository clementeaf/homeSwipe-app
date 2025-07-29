import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World from HomeSwipe Backend!' });
});

app.get('/api/status', (req, res) => {
  res.json({ message: 'HomeSwipe backend is ON' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Nueva ruta de usuarios para demostrar descubrimiento automático
app.get('/api/users', (req, res) => {
  res.json({ 
    message: 'Lista de usuarios',
    users: [
      { id: 1, name: 'Usuario 1', email: 'user1@example.com' },
      { id: 2, name: 'Usuario 2', email: 'user2@example.com' }
    ],
    total: 2
  });
});

app.post('/api/users', (req, res) => {
  res.json({ 
    message: 'Usuario creado exitosamente',
    user: req.body,
    id: Math.floor(Math.random() * 1000)
  });
});

// AWS Lambda handler
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, headers, body, queryStringParameters } = event;
    
    // Simular una respuesta básica para las rutas
    if (path === '/api/status' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: JSON.stringify({
          message: 'HomeSwipe backend is ON',
          timestamp: new Date().toISOString()
        })
      };
    }
    
    if (path === '/api/health' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: JSON.stringify({
          status: 'OK',
          timestamp: new Date().toISOString()
        })
      };
    }
    
    if (path === '/' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: JSON.stringify({
          message: 'Hello World from HomeSwipe Backend!',
          timestamp: new Date().toISOString()
        })
      };
    }
    
    // Manejar OPTIONS para CORS
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: ''
      };
    }
    
    // Ruta no encontrada
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Route not found',
        path,
        method: httpMethod
      })
    };
    
  } catch (error) {
    console.error('Error in Lambda handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📡 Status: http://localhost:${PORT}/api/status`);
    console.log(`👥 Users: http://localhost:${PORT}/api/users`);
  });
}