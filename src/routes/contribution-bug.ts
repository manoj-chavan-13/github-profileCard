import { Router, Request, Response } from 'express';
import { getBugExplorerData } from '../github/bug.service';
import { generateBugExplorerSvg } from '../svg/bug-explorer';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;

    if (!username) {
      return res.status(400).send('Username is required');
    }

    const data = await getBugExplorerData(username);

    if (!data) {
      return res.status(404).send('User not found');
    }

    const svg = generateBugExplorerSvg(data);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(svg);
  } catch (error) {
    console.error('Error generating bug explorer:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
