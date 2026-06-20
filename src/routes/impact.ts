import { Router, Request, Response } from 'express';
import { generateImpactCard } from '../svg/impact-card';
import { getUserData } from '../github/github.service';
import { getCachedData, setCachedData } from '../cache/cache';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      return res.status(400).send('Username is required');
    }

    // Check cache
    const cachedSvg = getCachedData(username);
    if (cachedSvg) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(cachedSvg);
    }

    // Fetch GitHub data
    const data = await getUserData(username);
    
    if (!data) {
      return res.status(404).send('User not found');
    }

    // Generate SVG
    const svg = generateImpactCard(data);

    // Cache SVG for 1 hour
    setCachedData(username, svg, 3600);

    // Return SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(svg);
  } catch (error) {
    console.error('Error generating impact card:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
