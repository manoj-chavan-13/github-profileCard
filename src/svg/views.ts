import { escapeSvg } from '../utils/escapeSvg';

export const generateViewsBadge = (value: string): string => {
  const safeValue = escapeSvg(value);
  return `
<svg width="170" height="38" xmlns="http://www.w3.org/2000/svg">

<rect width="170" height="38" rx="10" fill="#0D1117"/>

<path d="M18 14
         L24 20
         L18 26"
      stroke="#58A6FF"
      stroke-width="2"
      fill="none"/>

<text x="35"
      y="16"
      fill="#8B949E"
      font-size="8"
      letter-spacing="2">
PROFILE VIEWS
</text>

<text x="35"
      y="28"
      fill="#F0F6FC"
      font-size="14"
      font-weight="700">
${safeValue}
</text>

</svg>
`.trim();
};
