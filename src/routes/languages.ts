import { Router, Request, Response } from 'express';
import { getUserLanguages } from '../github/github.service';
import { generateLanguageCard } from '../svg/language-card';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;

    if (!username) {
      res.status(400).send('Username is required');
      return;
    }

    const data = await getUserLanguages(username);

    if (!data) {
      res.status(404).send('User not found or error fetching data');
      return;
    }

    const svg = generateLanguageCard(data);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=14400'); // Cache for 4 hours
    res.send(svg);
  } catch (error) {
    console.error('Error generating language card:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
