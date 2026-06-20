import { escapeSvg } from '../utils/escapeSvg';

export const generateLearningBadge = (text: string): string => {
  const safeText = escapeSvg(text);
  const width = Math.max(100, 48 + text.length * 8 + 20);
  return `
<svg width="${width}" height="38" xmlns="http://www.w3.org/2000/svg">

<rect width="${width}"
      height="38"
      rx="10"
      fill="#0D1117"/>

<path d="M16 24
         L22 16
         L28 22
         L34 12"
      fill="none"
      stroke="#58A6FF"
      stroke-width="1.5"/>

<text x="48"
      y="24"
      fill="#F0F6FC"
      font-size="12"
      font-weight="600">
${safeText}
</text>

</svg>
`.trim();
};
