import { Router, Request, Response } from 'express';
import { store } from '../store';

export const healthRouter = Router();

const startTime = Date.now();

// GET health check & system status
healthRouter.get('/health', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memUsage = process.memoryUsage();

  res.json({
    status: 'healthy',
    version: '1.2.0',
    service: 'NutriGuard Clinical Diagnostic API',
    uptime_seconds: uptimeSeconds,
    gemini_ai: {
      status: hasGeminiKey ? 'connected' : 'missing_api_key',
      model_multimodal: 'gemini-3.8-flash',
    },
    system: {
      node_version: process.version,
      memory_heap_used_mb: Math.round((memUsage.heapUsed / 1024 / 1024) * 10) / 10,
    },
    store_stats: store.getStats(),
  });
});

// GET OpenAPI / Interactive API Route Documentation
healthRouter.get('/api-docs', (_req: Request, res: Response) => {
  res.json({
    title: 'NutriGuard Clinical Backend API',
    version: '1.0.0',
    base_url: '/api',
    endpoints: [
      {
        path: '/api/analyze-food',
        method: 'POST',
        description:
          'Multimodal analysis of food packaging, meal photo, or nutrition facts label against patient medical profile.',
        request_body: {
          imageBase64: 'string (base64 image payload)',
          mimeType: 'image/jpeg | image/png | image/webp',
          patientProfile: {
            health_conditions: ['Hypertension (High BP)', 'Type 2 Diabetes'],
            allergies: ['Peanuts', 'Gluten'],
          },
        },
        response_keys: [
          'food_name',
          'safety_status',
          'health_score',
          'key_risks',
          'clinical_explanation',
          'healthy_alternatives',
          'nutritional_facts',
          'key_ingredients',
          'allergens_detected',
          'medical_breakdown',
        ],
      },
      {
        path: '/api/analyze-text',
        method: 'POST',
        description: 'Text-based clinical analysis of ingredient statements or recipes.',
        request_body: {
          foodText: 'string (e.g. ingredients list or menu item description)',
          patientProfile: 'object',
        },
      },
      {
        path: '/api/compare-foods',
        method: 'POST',
        description: 'Side-by-side clinical comparison of two foods to determine the safer option.',
        request_body: {
          itemA: 'string',
          itemB: 'string',
          patientProfile: 'object',
        },
      },
      {
        path: '/api/patient-profiles',
        method: 'GET',
        description: 'Fetch preset and saved patient clinical profiles.',
      },
      {
        path: '/api/scans',
        method: 'GET',
        description: 'Fetch diagnostic scan logs and aggregated compliance metrics.',
      },
      {
        path: '/api/health',
        method: 'GET',
        description: 'Service health check, uptime, and Gemini AI status.',
      },
    ],
  });
});
