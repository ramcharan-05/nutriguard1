import { Router, Request, Response } from 'express';
import { store } from '../store';

export const scansRouter = Router();

// GET all scans with optional status filter & statistics
scansRouter.get('/scans', (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 25;

  const scans = store.getScans(status, limit);
  const stats = store.getStats();

  res.json({
    scans,
    stats,
  });
});

// GET single scan report by ID
scansRouter.get('/scans/:id', (req: Request, res: Response) => {
  const scan = store.getScan(req.params.id);
  if (!scan) {
    return res.status(404).json({ error: 'Scan record not found' });
  }
  res.json(scan);
});

// DELETE single scan
scansRouter.delete('/scans/:id', (req: Request, res: Response) => {
  const success = store.deleteScan(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Scan not found' });
  }
  res.json({ message: 'Scan removed from history.' });
});

// DELETE clear all scans
scansRouter.delete('/scans', (_req: Request, res: Response) => {
  store.clearScans();
  res.json({ message: 'Scan history cleared.' });
});
