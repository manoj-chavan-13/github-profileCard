import { Router, Request, Response } from 'express';
import { generateFollowersBadge } from '../svg/followers';
import { generateViewsBadge } from '../svg/views';
import { generateStatusBadge } from '../svg/status';
import { generateFocusBadge } from '../svg/focus';
import { generateLearningBadge } from '../svg/learning';
import { generateBuildingBadge } from '../svg/building';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const value = req.query.value as string || 'N/A';
    const text = req.query.text as string || 'DEFAULT';

    let svg = '';

    switch (type) {
      case 'followers':
        svg = generateFollowersBadge(value);
        break;
      case 'views':
        svg = generateViewsBadge(value);
        break;
      case 'status':
        svg = generateStatusBadge(text);
        break;
      case 'focus':
        svg = generateFocusBadge(text);
        break;
      case 'learning':
        svg = generateLearningBadge(text);
        break;
      case 'building':
        svg = generateBuildingBadge(text);
        break;
      default:
        return res.status(400).send('Invalid badge type');
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(svg);
  } catch (error) {
    console.error('Error generating badge:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
