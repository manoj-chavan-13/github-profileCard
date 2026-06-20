import { Router, Request, Response } from 'express';
import { generateFollowersBadge } from '../svg/followers';
import { generateViewsBadge } from '../svg/views';
import { generateStatusBadge } from '../svg/status';
import { generateFocusBadge } from '../svg/focus';
import { generateLearningBadge } from '../svg/learning';
import { generateBuildingBadge } from '../svg/building';
import { getFollowers } from '../github/github.service';
import { formatWatermark } from '../utils/format';

const router = Router();
const viewsCounter: Record<string, number> = {};

router.get('/', async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    let value = req.query.value as string || 'N/A';
    const text = req.query.text as string || 'DEFAULT';
    const username = req.query.username as string;

    let svg = '';

    switch (type) {
      case 'followers':
        if (username) {
          const followersCount = await getFollowers(username);
          if (followersCount !== null) value = formatWatermark(followersCount);
        }
        svg = generateFollowersBadge(value);
        break;
      case 'views':
        if (username) {
          viewsCounter[username] = (viewsCounter[username] || 0) + 1;
          value = viewsCounter[username].toString();
        }
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
    
    if (type === 'views' || type === 'followers') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    
    res.send(svg);
  } catch (error) {
    console.error('Error generating badge:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
