import { Router, Request, Response } from 'express';
import { generateJourneyCard } from '../svg/journey-card';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const title = (req.query.title as string) || 'Continuous Evolution';
    const description = (req.query.description as string) || 'From building applications to designing scalable systems, secure cloud infrastructure and AI-powered experiences.';
    
    let steps: string[] = [];
    if (req.query.steps && typeof req.query.steps === 'string') {
      steps = req.query.steps.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    
    if (steps.length === 0) {
      steps = ['Coding', 'MERN Stack', 'Mobile Apps', 'AI Systems', 'CloudSec'];
    }

    const svg = generateJourneyCard({ title, description, steps });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(svg);
  } catch (error) {
    console.error('Error generating journey card:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
