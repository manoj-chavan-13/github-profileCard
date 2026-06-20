import { escapeSvg } from '../utils/escapeSvg';

export const generateFocusBadge = (text: string): string => {
  const safeText = escapeSvg(text);
  return `
<svg width="240" height="38" xmlns="http://www.w3.org/2000/svg">

<rect width="240"
      height="38"
      rx="10"
      fill="#0D1117"/>

<rect x="12"
      y="12"
      width="14"
      height="14"
      rx="3"
      fill="#161B22"/>

<rect x="15"
      y="15"
      width="8"
      height="8"
      rx="2"
      fill="#58A6FF"/>

<text x="38"
      y="24"
      fill="#F0F6FC"
      font-size="12"
      font-weight="600">
${safeText}
</text>

</svg>
`.trim();
};
