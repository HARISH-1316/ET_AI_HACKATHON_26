// ============================================================
// ISIP — Swagger Configuration
// ============================================================

import swaggerJsdoc from 'swagger-jsdoc';
import env from './env.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ISIP — Industrial Safety Intelligence Platform API',
    version: '1.0.0',
    description:
      'REST API for the Industrial Safety Intelligence Platform. Provides endpoints for managing zones, equipment, sensors, workers, permits, alerts, timeline events, and reports.',
    contact: {
      name: 'ISIP Dev Team',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.port}/api`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // ── Common ───────────────────────────────────
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'array', items: { type: 'string' } },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      // ── Auth ─────────────────────────────────────
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@isip.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'username', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', enum: ['ADMIN', 'SAFETY_OFFICER', 'OPERATOR', 'TECHNICIAN', 'VIEWER'] },
        },
      },
      // ── User ─────────────────────────────────────
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string' },
          username: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      // ── Zone ─────────────────────────────────────
      Zone: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          code: { type: 'string' },
          description: { type: 'string' },
          riskLevel: { type: 'string', enum: ['SAFE', 'LOW', 'MODERATE', 'WARNING', 'CRITICAL'] },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          isActive: { type: 'boolean' },
        },
      },
      CreateZone: {
        type: 'object',
        required: ['name', 'code'],
        properties: {
          name: { type: 'string' },
          code: { type: 'string' },
          description: { type: 'string' },
          riskLevel: { type: 'string', enum: ['SAFE', 'LOW', 'MODERATE', 'WARNING', 'CRITICAL'] },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
        },
      },
      // ── Equipment ────────────────────────────────
      Equipment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          code: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' },
          zoneId: { type: 'string', format: 'uuid' },
        },
      },
      // ── Sensor ───────────────────────────────────
      Sensor: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          type: { type: 'string' },
          value: { type: 'number' },
          unit: { type: 'string' },
          min: { type: 'number' },
          max: { type: 'number' },
          threshold: { type: 'number' },
          status: { type: 'string' },
          trend: { type: 'string' },
          zoneId: { type: 'string', format: 'uuid' },
          equipmentId: { type: 'string', format: 'uuid' },
        },
      },
      // ── Worker ───────────────────────────────────
      Worker: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          role: { type: 'string' },
          badge: { type: 'string' },
          shift: { type: 'string' },
          status: { type: 'string' },
          ppeStatus: { type: 'string' },
          riskLevel: { type: 'string' },
          heartRate: { type: 'number' },
          gasExposure: { type: 'number' },
          task: { type: 'string' },
          zoneId: { type: 'string', format: 'uuid' },
          permitId: { type: 'string', format: 'uuid' },
        },
      },
      // ── Permit ───────────────────────────────────
      Permit: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string' },
          title: { type: 'string' },
          status: { type: 'string' },
          riskLevel: { type: 'string' },
          compliance: { type: 'number' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          issuerId: { type: 'string', format: 'uuid' },
          zoneId: { type: 'string', format: 'uuid' },
          aiRecommendation: { type: 'string' },
        },
      },
      // ── Alert ────────────────────────────────────
      Alert: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string' },
          severity: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          acknowledged: { type: 'boolean' },
          source: { type: 'string' },
          zoneId: { type: 'string', format: 'uuid' },
        },
      },
      // ── TimelineEvent ────────────────────────────
      TimelineEvent: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          category: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          severity: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          zoneId: { type: 'string', format: 'uuid' },
          relatedId: { type: 'string' },
        },
      },
      // ── Report ───────────────────────────────────
      Report: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string' },
          frequency: { type: 'string' },
          status: { type: 'string' },
          generatedById: { type: 'string', format: 'uuid' },
          generatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
