import { Router, Request, Response } from 'express';
import { analyzeFoodImage, analyzeFoodText, compareFoods } from '../geminiService';
import { store } from '../store';
import { FoodAnalysisResult } from '../types';

export const analysisRouter = Router();

// 1. Analyze Food Packaging / Label Image
analysisRouter.post('/analyze-food', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', patientProfile } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const conditions = patientProfile?.health_conditions || ['Hypertension (High BP)', 'Type 2 Diabetes'];
    const allergies = patientProfile?.allergies || ['Peanuts', 'Gluten'];

    const rawData = await analyzeFoodImage(cleanBase64, mimeType, conditions, allergies);

    // Normalize output fields
    let status = rawData.safety_status?.toUpperCase() || 'CAUTION';
    if (!['SAFE', 'CAUTION', 'UNSAFE'].includes(status)) {
      status = 'CAUTION';
    }
    rawData.safety_status = status;
    rawData.health_score = Math.max(1, Math.min(10, Math.round(Number(rawData.health_score) || 5)));

    const scanRecord: FoodAnalysisResult = {
      ...rawData,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      patient_profile_used: {
        health_conditions: conditions,
        allergies: allergies,
        name: patientProfile?.name || 'Active Patient',
      },
      analyzed_at: new Date().toISOString(),
      source_type: 'image',
    };

    // Store in backend history
    store.saveScan(scanRecord);

    res.json(scanRecord);
  } catch (error: any) {
    console.error('Error in /api/analyze-food:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while analyzing the food image.',
    });
  }
});

// 2. Analyze Food by Text / Ingredient list
analysisRouter.post('/analyze-text', async (req: Request, res: Response) => {
  try {
    const { foodText, patientProfile } = req.body;

    if (!foodText || typeof foodText !== 'string' || foodText.trim().length === 0) {
      return res.status(400).json({ error: 'Missing foodText in request body.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.',
      });
    }

    const conditions = patientProfile?.health_conditions || ['Hypertension (High BP)', 'Type 2 Diabetes'];
    const allergies = patientProfile?.allergies || ['Peanuts', 'Gluten'];

    const rawData = await analyzeFoodText(foodText, conditions, allergies);

    let status = rawData.safety_status?.toUpperCase() || 'CAUTION';
    if (!['SAFE', 'CAUTION', 'UNSAFE'].includes(status)) {
      status = 'CAUTION';
    }
    rawData.safety_status = status;
    rawData.health_score = Math.max(1, Math.min(10, Math.round(Number(rawData.health_score) || 5)));

    const scanRecord: FoodAnalysisResult = {
      ...rawData,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      patient_profile_used: {
        health_conditions: conditions,
        allergies: allergies,
        name: patientProfile?.name || 'Active Patient',
      },
      analyzed_at: new Date().toISOString(),
      source_type: 'text',
    };

    store.saveScan(scanRecord);

    res.json(scanRecord);
  } catch (error: any) {
    console.error('Error in /api/analyze-text:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while analyzing the food text.',
    });
  }
});

// 3. Compare Two Food Items
analysisRouter.post('/compare-foods', async (req: Request, res: Response) => {
  try {
    const { itemA, itemB, patientProfile } = req.body;

    if (!itemA || !itemB) {
      return res.status(400).json({ error: 'Both itemA and itemB strings are required.' });
    }

    const conditions = patientProfile?.health_conditions || ['Hypertension (High BP)', 'Type 2 Diabetes'];
    const allergies = patientProfile?.allergies || ['Peanuts', 'Gluten'];

    const comparison = await compareFoods(itemA, itemB, conditions, allergies);
    res.json(comparison);
  } catch (error: any) {
    console.error('Error in /api/compare-foods:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while comparing the two food items.',
    });
  }
});
