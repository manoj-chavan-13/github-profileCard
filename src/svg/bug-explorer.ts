import { BugExplorerData } from '../github/bug.service';

interface Point {
  x: number;
  y: number;
}

export const generateBugExplorerSvg = (data: BugExplorerData): string => {
  const { totalContributions, weeks } = data;

  const cols = weeks.length;
  const rows = 7;
  const grid: number[][] = Array.from({ length: cols }, () => Array(rows).fill(1)); // 1 is wall

  let totalDays = 0;
  let activeDays = 0;
  let emptyCells = 0;

  let currentStreak = 0;
  let longestStreak = 0;
  let activeStreak = 0;

  // Build grid
  for (let x = 0; x < cols; x++) {
    const days = weeks[x].contributionDays;
    for (const day of days) {
      const y = new Date(day.date).getDay();
      totalDays++;
      
      if (day.contributionCount > 0) {
        grid[x][y] = 1; // Wall
        activeDays++;
        activeStreak++;
        longestStreak = Math.max(longestStreak, activeStreak);
      } else {
        grid[x][y] = 0; // Walkable
        emptyCells++;
        activeStreak = 0;
      }
    }
  }

  // Calculate stats
  const consistency = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;
  const survivalRate = totalDays > 0 ? Math.round((emptyCells / totalDays) * 100) : 0;
  
  // Calculate current streak
  let foundZero = false;
  for (let x = cols - 1; x >= 0; x--) {
    const days = weeks[x].contributionDays;
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      if (day.contributionCount > 0) {
        if (!foundZero) currentStreak++;
      } else {
        foundZero = true;
      }
    }
    if (foundZero) break;
  }

  // Pathfinding (BFS to find shortest path from left to right)
  let startNodes: Point[] = [];
  for (let y = 0; y < rows; y++) {
    if (grid[0][y] === 0) startNodes.push({ x: 0, y });
  }
  
  // If no empty spots in col 0, allow starting on walls just so bug exists
  if (startNodes.length === 0) startNodes.push({ x: 0, y: 3 });

  const queue: { point: Point, path: Point[] }[] = [];
  const visited = new Set<string>();

  for (const start of startNodes) {
    queue.push({ point: start, path: [start] });
    visited.add(`0,${start.y}`);
  }

  let bestPath: Point[] = queue.length > 0 ? queue[0].path : [];
  let maxCol = 0;

  const dirs = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 }
  ];

  while (queue.length > 0) {
    const { point, path } = queue.shift()!;

    if (point.x > maxCol) {
      maxCol = point.x;
      bestPath = path;
    }

    if (point.x === cols - 1) {
      bestPath = path;
      break;
    }

    for (const dir of dirs) {
      const nx = point.x + dir.dx;
      const ny = point.y + dir.dy;

      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        if (grid[nx][ny] === 0 && !visited.has(`${nx},${ny}`)) {
          visited.add(`${nx},${ny}`);
          queue.push({ point: { x: nx, y: ny }, path: [...path, { x: nx, y: ny }] });
        }
      }
    }
  }

  // Draw grid
  const cellSize = 11;
  const cellGap = 3;
  const startX = 50;
  const startY = 150;
  
  let gridSvg = '';
  
  for (let x = 0; x < cols; x++) {
    const days = weeks[x].contributionDays;
    for (const day of days) {
      const y = new Date(day.date).getDay();
      const rectX = startX + x * (cellSize + cellGap);
      const rectY = startY + y * (cellSize + cellGap);
      
      const color = day.color === '#ebedf0' ? '#161B22' : day.color;
      
      gridSvg += `<rect x="${rectX}" y="${rectY}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" />\n`;
    }
  }

  // Draw path trace
  let pathD = '';
  if (bestPath.length > 0) {
    pathD = bestPath.map((p, i) => {
      const px = startX + p.x * (cellSize + cellGap) + cellSize / 2;
      const py = startY + p.y * (cellSize + cellGap) + cellSize / 2;
      return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
    }).join(' ');
  }

  // If path length is 0, provide dummy path
  if (pathD === '') {
    pathD = `M ${startX} ${startY + 3*(cellSize+cellGap)} L ${startX + cols*(cellSize+cellGap)} ${startY + 3*(cellSize+cellGap)}`;
  }

  // Add slight hesitation logic to path using keyTimes and keyPoints (too complex for pure SVG without massive strings, so we just use a smooth linear motion that traces perfectly)
  
  return `
<svg width="900" height="400" viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="900" height="400" fill="#0D1117" rx="15" />
  
  <!-- Header -->
  <text x="50" y="50" fill="#8B949E" font-size="12" letter-spacing="2" font-family="Segoe UI, sans-serif" font-weight="600">
    CONTRIBUTION DEFENSE SYSTEM
  </text>
  
  <!-- Metrics -->
  <g font-family="Segoe UI, sans-serif">
    <!-- Total Contributions -->
    <text x="50" y="90" fill="#F0F6FC" font-size="24" font-weight="700">${totalContributions}</text>
    <text x="50" y="110" fill="#8B949E" font-size="12">Contributions</text>

    <!-- Current Streak -->
    <text x="200" y="90" fill="#F0F6FC" font-size="24" font-weight="700">${currentStreak}</text>
    <text x="200" y="110" fill="#8B949E" font-size="12">Day Streak</text>

    <!-- Longest Streak -->
    <text x="320" y="90" fill="#F0F6FC" font-size="24" font-weight="700">${longestStreak}</text>
    <text x="320" y="110" fill="#8B949E" font-size="12">Longest Streak</text>

    <!-- Consistency -->
    <text x="460" y="90" fill="#F0F6FC" font-size="24" font-weight="700">${consistency}%</text>
    <text x="460" y="110" fill="#8B949E" font-size="12">Consistency</text>
    
    <!-- Survival Rate -->
    <text x="700" y="50" fill="#F85149" font-size="12" letter-spacing="2" font-weight="600">BUG SURVIVAL RATE</text>
    <text x="700" y="90" fill="#F85149" font-size="32" font-weight="800">${survivalRate}%</text>
  </g>

  <!-- Grid -->
  <g>
    ${gridSvg}
  </g>

  <!-- Scanner Trail -->
  <path d="${pathD}" fill="none" stroke="#58A6FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.15" />

  <!-- Bug -->
  <g>
    <!-- Bug visual -->
    <circle cx="0" cy="0" r="4" fill="#DA3633" />
    <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
    
    <!-- Legs -->
    <path d="M-4 -4 L0 0 M4 -4 L0 0 M-4 4 L0 0 M4 4 L0 0" stroke="#F85149" stroke-width="1.5" opacity="0.8" />
    
    <!-- Motion -->
    <animateMotion dur="20s" repeatCount="indefinite" path="${pathD}" />
  </g>

  <!-- Footer -->
  <text x="50" y="360" fill="#8B949E" font-size="12" font-family="Segoe UI, sans-serif" font-style="italic">
    A more active codebase leaves fewer places for bugs to hide.
  </text>
</svg>
  `.trim();
};
