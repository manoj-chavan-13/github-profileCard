import { LanguageData } from '../github/github.service';

export const generateLanguageCard = (data: LanguageData): string => {
  const { languages, repositoriesCount } = data;
  
  const circumference = 2 * Math.PI * 110;
  let currentOffset = 0;
  
  let donutCircles = '';
  languages.forEach(lang => {
    const dash = (lang.percentage / 100) * circumference;
    donutCircles += `
<circle cx="320"
        cy="270"
        r="110"
        fill="none"
        stroke="${lang.color}"
        stroke-width="28"
        stroke-dasharray="${dash} ${circumference}"
        stroke-dashoffset="-${currentOffset}"
        transform="rotate(-90 320 270)"/>`;
    currentOffset += dash;
  });

  const topLangs = languages.slice(0, 4);
  
  let statsRows = '';
  topLangs.forEach((lang, index) => {
    const yCenter = 195 + (index * 50);
    const yText = yCenter + 6;
    statsRows += `
<!-- Row ${index + 1} -->
<circle cx="660" cy="${yCenter}" r="7" fill="${lang.color}"/>
<text x="680" y="${yText}" fill="#F0F6FC" font-size="22" font-weight="600" font-family="Segoe UI, sans-serif">
  ${lang.name}
</text>
<text x="1060" y="${yText}" text-anchor="end" fill="#F0F6FC" font-size="22" font-weight="700" font-family="Segoe UI, sans-serif">
  ${lang.percentage.toFixed(1)}%
</text>`;
  });
  
  const primaryLang = languages[0]?.name || 'Unknown';
  const secondaryLang = languages[1]?.name || '';
  const primaryStack = secondaryLang ? `${primaryLang} + ${secondaryLang}` : primaryLang;

  return `<svg width="1200" height="500" viewBox="0 0 1200 500" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="500" rx="24" fill="#0D1117"/>

<!-- Header -->
<text x="60" y="55" fill="#58A6FF" font-size="12" letter-spacing="4" font-family="Segoe UI, sans-serif">LANGUAGE ANALYTICS</text>
<text x="60" y="110" fill="#F0F6FC" font-size="44" font-weight="700" font-family="Segoe UI, sans-serif">Codebase Composition</text>

<!-- Donut Background -->
<circle cx="320" cy="270" r="110" fill="none" stroke="#21262D" stroke-width="28"/>

${donutCircles}

<!-- Center -->
<text x="320" y="255" text-anchor="middle" fill="#F0F6FC" font-size="18" font-family="Segoe UI, sans-serif">Primary</text>
<text x="320" y="290" text-anchor="middle" fill="#F0F6FC" font-size="32" font-weight="700" font-family="Segoe UI, sans-serif">${primaryLang}</text>

<!-- Stats Panel -->
<rect x="620" y="150" width="500" height="230" rx="16" fill="#161B22"/>

${statsRows}

<!-- Footer Metrics -->
<line x1="60" y1="440" x2="1140" y2="440" stroke="#21262D"/>
<text x="60" y="475" fill="#8B949E" font-size="14" font-family="Segoe UI, sans-serif">
  ${languages.length} Languages • ${repositoriesCount} Repositories • Primary Stack: ${primaryStack}
</text>
<text x="1140" y="475" text-anchor="end" fill="#58A6FF" font-size="14" font-family="Segoe UI, sans-serif">Language Intelligence Engine</text>
</svg>`;
};
