import { escapeSvg } from '../utils/escapeSvg';

export const generateFollowersBadge = (value: string): string => {
  const safeValue = escapeSvg(value);
  return `
<svg width="145" height="38" xmlns="http://www.w3.org/2000/svg">

<rect width="145" height="38" rx="10" fill="#0D1117"/>

<circle cx="16" cy="19" r="4" fill="#58A6FF"/>

<text x="28"
      y="16"
      fill="#8B949E"
      font-size="8"
      letter-spacing="2"
      font-family="Segoe UI">
FOLLOWERS
</text>

<text x="28"
      y="28"
      fill="#F0F6FC"
      font-size="14"
      font-weight="700"
      font-family="Segoe UI">
${safeValue}
</text>

</svg>
`.trim();
};
