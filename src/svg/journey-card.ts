export interface JourneyData {
  title: string;
  description: string;
  steps: string[];
}

export const generateJourneyCard = (data: JourneyData): string => {
  const { title, description, steps } = data;

  const N = Math.max(4, Math.min(6, steps.length));
  const activeSteps = steps.slice(0, N);

  let pathD = '';
  let nodesSvg = '';

  if (N === 4) {
    // Exact match for N=4 as per template
    pathD = `M120 220
             C260 120, 360 120, 500 220
             C640 320, 760 320, 900 220
             C980 170, 1040 150, 1100 120`;

    const points = [
      { cx: 120, cy: 220, textY: 260, last: false },
      { cx: 500, cy: 220, textY: 260, last: false },
      { cx: 900, cy: 220, textY: 260, last: false },
      { cx: 1100, cy: 120, textY: 105, last: true }
    ];

    nodesSvg = points.map((p, i) => `
  <circle cx="${p.cx}" cy="${p.cy}" r="10" fill="#58A6FF"/>
  <text x="${p.cx}" y="${p.textY}"
        fill="${p.last ? '#58A6FF' : '#F0F6FC'}"
        font-size="${p.last ? '20' : '18'}"
        font-weight="${p.last ? '700' : '600'}"
        text-anchor="${p.last ? 'end' : 'middle'}">
        ${activeSteps[i]}
  </text>`).join('');

  } else {
    // Dynamic generation for N=5, N=6
    const startX = 120;
    const endX = 1100;
    const dx = (endX - startX) / (N - 1);

    let pathParts = [`M${startX} 220`];
    let points = [];

    for (let i = 0; i < N; i++) {
      const cx = startX + i * dx;
      const isLast = i === N - 1;
      const cy = isLast ? 120 : 220;

      points.push({
        cx,
        cy,
        textY: isLast ? 105 : (i % 2 === 0 ? 260 : 260), // Keep text below the curve consistently
        last: isLast
      });

      if (i > 0) {
        const prevX = startX + (i - 1) * dx;
        if (isLast) {
          const cp1x = prevX + dx * 0.33;
          const cp2x = prevX + dx * 0.66;
          pathParts.push(`C${cp1x} 170, ${cp2x} 150, ${cx} ${cy}`);
        } else {
          const dir = (i - 1) % 2 === 0 ? 120 : 320; // Up then down
          const cp1x = prevX + dx * 0.33;
          const cp2x = prevX + dx * 0.66;
          pathParts.push(`C${cp1x} ${dir}, ${cp2x} ${dir}, ${cx} ${cy}`);
        }
      }
    }

    pathD = pathParts.join('\n             ');

    nodesSvg = points.map((p, i) => `
  <circle cx="${p.cx}" cy="${p.cy}" r="10" fill="#58A6FF"/>
  <text x="${p.cx}" y="${p.textY}"
        fill="${p.last ? '#58A6FF' : '#F0F6FC'}"
        font-size="${p.last ? '20' : '18'}"
        font-weight="${p.last ? '700' : '600'}"
        text-anchor="${p.last ? 'end' : 'middle'}">
        ${activeSteps[i]}
  </text>`).join('');
  }

  return `
<svg width="1200" height="340" viewBox="0 0 1200 340"
     xmlns="http://www.w3.org/2000/svg">

  <rect width="1200" height="340"
        rx="24"
        fill="#0D1117"/>

  <text x="60"
        y="55"
        fill="#58A6FF"
        font-size="12"
        letter-spacing="4"
        font-weight="600"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
        ENGINEERING JOURNEY
  </text>

  <text x="60"
        y="105"
        fill="#F0F6FC"
        font-size="42"
        font-weight="700"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
        ${title}
  </text>

  <path d="${pathD}"
        fill="none"
        stroke="#30363D"
        stroke-width="4"/>
${nodesSvg}

  <text x="60"
        y="315"
        fill="#8B949E"
        font-size="16"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
        ${description}
  </text>

</svg>
`.trim();
};
