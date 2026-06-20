import { GitHubData } from '../types';
import { formatWatermark, formatNumberWithCommas } from '../utils/format';

export const generateImpactCard = (data: GitHubData): string => {
  const {
    username,
    repositories,
    stars,
    allTimeContributions,
    longestStreak,
  } = data;

  const watermark = formatWatermark(allTimeContributions);
  const formattedContributions = formatNumberWithCommas(allTimeContributions);

  // Dynamically reduce font size if username is too long
  const usernameFontSize = username.length > 15 ? 48 : username.length > 11 ? 58 : 72;

  return `
<svg width="1000" height="500" viewBox="0 0 1000 500"
     xmlns="http://www.w3.org/2000/svg">

  <rect width="1000" height="500" rx="24" fill="#0D1117"/>

  <text x="500"
        y="410"
        text-anchor="middle"
        fill="#161B22"
        font-size="320"
        font-weight="700"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    ${watermark}
  </text>

  <text x="70"
        y="75"
        fill="#7D8590"
        font-size="12"
        font-weight="600"
        letter-spacing="4"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    OPEN SOURCE IMPACT
  </text>

  <text x="70"
        y="155"
        fill="#F0F6FC"
        font-size="${usernameFontSize}"
        font-weight="700"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    ${username}
  </text>

  <text x="70"
        y="198"
        fill="#8B949E"
        font-size="22"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    Building software with consistency.
  </text>

  <text x="70"
        y="325"
        fill="#FFFFFF"
        font-size="135"
        font-weight="700"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    ${formattedContributions}
  </text>

  <text x="78"
        y="365"
        fill="#8B949E"
        font-size="18"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    All-Time Contributions
  </text>

  <line x1="70"
        y1="405"
        x2="360"
        y2="405"
        stroke="#30363D"/>

  <text x="720"
        y="105"
        fill="#7D8590"
        font-size="11"
        letter-spacing="3"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    REPOSITORIES
  </text>

  <text x="720"
        y="165"
        fill="#F0F6FC"
        font-size="56"
        font-weight="700"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    ${repositories}
  </text>

  <text x="720"
        y="245"
        fill="#7D8590"
        font-size="11"
        letter-spacing="3"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    STARS
  </text>

  <text x="720"
        y="305"
        fill="#F0F6FC"
        font-size="56"
        font-weight="700"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    ${stars}
  </text>

  <text x="720"
        y="385"
        fill="#7D8590"
        font-size="11"
        letter-spacing="3"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    LONGEST STREAK
  </text>

  <text x="720"
        y="445"
        fill="#58A6FF"
        font-size="56"
        font-weight="700"
        font-family="Segoe UI, Helvetica, Arial, sans-serif">
    ${longestStreak}D
  </text>

  <line x1="650"
        y1="70"
        x2="650"
        y2="450"
        stroke="#21262D"/>

</svg>
`.trim();
};
