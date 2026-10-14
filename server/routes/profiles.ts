import { Router, Request, Response } from 'express';
import { store } from '../store';
import { PatientProfileRecord } from '../types';

export const profilesRouter = Router();

// GET all patient profiles (presets + custom)
profilesRouter.get('/patient-profiles', (_req: Request, res: Response) => {
  const profiles = store.getProfiles();
  res.json({ profiles });
});

// GET single profile by ID
profilesRouter.get('/patient-profiles/:id', (req: Request, res: Response) => {
  const profile = store.getProfile(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(profile);
});

// POST save or update custom profile
profilesRouter.post('/patient-profiles', (req: Request, res: Response) => {
  const { name, description, health_conditions, allergies, max_sodium_mg_per_meal, max_sugar_g_per_meal } =
    req.body;

  if (!name || !health_conditions || !allergies) {
    return res.status(400).json({ error: 'Missing required profile fields.' });
  }

  const profile: PatientProfileRecord = {
    id: req.body.id || `profile-${Date.now()}`,
    name,
    description: description || 'Custom clinical patient profile',
    health_conditions,
    allergies,
    max_sodium_mg_per_meal: Number(max_sodium_mg_per_meal) || 400,
    max_sugar_g_per_meal: Number(max_sugar_g_per_meal) || 10,
    is_preset: false,
  };

  const saved = store.saveProfile(profile);
  res.status(201).json(saved);
});

// DELETE custom profile
profilesRouter.delete('/patient-profiles/:id', (req: Request, res: Response) => {
  const success = store.deleteProfile(req.params.id);
  if (!success) {
    return res.status(400).json({ error: 'Cannot delete preset default profiles or profile not found.' });
  }
  res.json({ message: 'Profile deleted successfully.' });
});
