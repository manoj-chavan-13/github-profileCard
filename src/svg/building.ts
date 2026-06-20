import { escapeSvg } from '../utils/escapeSvg';

export const generateBuildingBadge = (text: string): string => {
  const safeText = escapeSvg(text);
  const width = Math.max(80, 28 + text.length * 8 + 20);
  return `
<svg width="${width}" height="38" xmlns="http://www.w3.org/2000/svg">

<rect width="${width}"
      height="38"
      rx="10"
      fill="#0D1117"/>

<text x="14"
      y="24"
      fill="#58A6FF"
      font-size="12"
      font-family="Consolas">
&gt;
</text>

<text x="28"
      y="24"
      fill="#F0F6FC"
      font-size="12"
      font-weight="600">
${safeText}
</text>

</svg>
`.trim();
};
