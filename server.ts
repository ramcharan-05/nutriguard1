import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { analysisRouter } from './server/routes/analysis';
import { profilesRouter } from './server/routes/profiles';
import { scansRouter } from './server/routes/scans';
import { healthRouter } from './server/routes/health';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for body parsing with large payload support for high-res images
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Request logger for API calls
app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path} - ${new Date().toISOString()}`);
  }
  next();
});

// Mount modular API routers
app.use('/api', analysisRouter);
app.use('/api', profilesRouter);
app.use('/api', scansRouter);
app.use('/api', healthRouter);

// Global Error Handler for API
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error('[Backend Unhandled Error]', err);
  res.status(500).json({
    error: err?.message || 'An unexpected internal server error occurred.',
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(` NutriGuard Clinical Backend Server Running`);
    console.log(` Local:   http://0.0.0.0:${PORT}`);
    console.log(` API Doc: http://0.0.0.0:${PORT}/api/api-docs`);
    console.log(` Health:  http://0.0.0.0:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}

startServer();
