import { escapeSvg } from '../utils/escapeSvg';

export const generateStatusBadge = (text: string): string => {
  const safeText = escapeSvg(text);
  return `
<svg width="220" height="38" xmlns="http://www.w3.org/2000/svg">

<rect width="220"
      height="38"
      rx="10"
      fill="#0D1117"/>

<circle cx="18"
        cy="19"
        r="4"
        fill="#3FB950"/>

<text x="30"
      y="24"
      fill="#F0F6FC"
      font-size="12"
      font-weight="600"
      font-family="Segoe UI">
${safeText}
</text>

</svg>
`.trim();
};
