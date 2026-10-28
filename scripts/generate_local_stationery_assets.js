/**
 * Generate Local SVG Stationery Assets
 * Creates self-hosted vector graphics for all categories, banners, and product fallbacks
 * Ensures the website works 100% offline with zero broken image icons.
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');
const catDir = path.join(baseDir, 'categories');
const prodDir = path.join(baseDir, 'products');

if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });
if (!fs.existsSync(prodDir)) fs.mkdirSync(prodDir, { recursive: true });

// Palette colors for stationery themes
const categoriesData = [
  {
    slug: 'writing-instruments',
    title: 'Pens & Pencils',
    bg1: '#3B82F6',
    bg2: '#1D4ED8',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Fountain Pen / Ballpoint Icon -->
      <path d="M12 2L19 9L11 17L4 17L4 10L12 2Z" fill="#FFFFFF" fill-opacity="0.9" />
      <path d="M4 17L2 22L7 20L4 17Z" fill="#FDE047" />
      <line x1="8" y1="6" x2="16" y2="14" stroke="#1D4ED8" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="17" cy="7" r="1.5" fill="#EF4444" />
    `
  },
  {
    slug: 'notebooks-paper',
    title: 'Notebooks',
    bg1: '#10B981',
    bg2: '#047857',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Spiral Bound Notebook -->
      <rect x="5" y="3" width="15" height="18" rx="2" fill="#FFFFFF" fill-opacity="0.95"/>
      <rect x="8" y="6" width="9" height="1.5" rx="0.75" fill="#047857"/>
      <rect x="8" y="10" width="9" height="1.5" rx="0.75" fill="#6EE7B7"/>
      <rect x="8" y="14" width="6" height="1.5" rx="0.75" fill="#6EE7B7"/>
      <!-- Wire spirals -->
      <circle cx="5" cy="6" r="1.5" fill="#F59E0B"/>
      <circle cx="5" cy="10" r="1.5" fill="#F59E0B"/>
      <circle cx="5" cy="14" r="1.5" fill="#F59E0B"/>
      <circle cx="5" cy="18" r="1.5" fill="#F59E0B"/>
    `
  },
  {
    slug: 'school-essentials',
    title: 'School Essentials',
    bg1: '#F59E0B',
    bg2: '#D97706',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Graduation Cap / Geometry Compass -->
      <polygon points="12,3 2,8 12,13 22,8" fill="#FFFFFF"/>
      <path d="M6 10.5V16C6 17.5 8.7 19 12 19C15.3 19 18 17.5 18 16V10.5" stroke="#FFFFFF" stroke-width="1.8" fill="none"/>
      <path d="M22 8V15" stroke="#FEF08A" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="22" cy="16" r="1.5" fill="#FEF08A"/>
    `
  },
  {
    slug: 'office-supplies',
    title: 'Office Gear',
    bg1: '#6366F1',
    bg2: '#4338CA',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Briefcase & Paperclip -->
      <rect x="3" y="7" width="18" height="13" rx="2" fill="#FFFFFF" fill-opacity="0.95"/>
      <path d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      <path d="M3 12H21" stroke="#4338CA" stroke-width="1.5"/>
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill="#F59E0B"/>
    `
  },
  {
    slug: 'art-supplies',
    title: 'Art & Colors',
    bg1: '#EC4899',
    bg2: '#BE185D',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Paint Palette with Color Dots -->
      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6 22 11 22C12.5 22 13.5 20.8 13.5 19.5C13.5 18.9 13.2 18.3 12.8 17.9C12.4 17.5 12.1 16.9 12.1 16.2C12.1 14.8 13.2 13.7 14.6 13.7H17C19.8 13.7 22 11.5 22 8.7C22 5 17.5 2 12 2Z" fill="#FFFFFF"/>
      <circle cx="6.5" cy="9.5" r="1.5" fill="#EF4444"/>
      <circle cx="10.5" cy="6.5" r="1.5" fill="#F59E0B"/>
      <circle cx="15.5" cy="7.5" r="1.5" fill="#10B981"/>
      <circle cx="17.5" cy="11.5" r="1.5" fill="#3B82F6"/>
    `
  },
  {
    slug: 'craft-diy',
    title: 'Craft & DIY',
    bg1: '#8B5CF6',
    bg2: '#6D28D9',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Scissors & Tape -->
      <circle cx="6" cy="6" r="3" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      <circle cx="6" cy="18" r="3" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      <line x1="8.5" y1="8" x2="19" y2="17" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="8.5" y1="16" x2="19" y2="7" stroke="#FEF08A" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="#F59E0B"/>
    `
  },
  {
    slug: 'planners-journals',
    title: 'Planners',
    bg1: '#14B8A6',
    bg2: '#0F766E',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Calendar Planner -->
      <rect x="3" y="4" width="18" height="17" rx="2" fill="#FFFFFF"/>
      <path d="M3 9H21" stroke="#0F766E" stroke-width="2"/>
      <line x1="8" y1="2" x2="8" y2="5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="16" y1="2" x2="16" y2="5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <!-- Calendar checkmark -->
      <path d="M8 14L11 17L16 12" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    `
  },
  {
    slug: 'desk-organizers',
    title: 'Organizers',
    bg1: '#0284C7',
    bg2: '#0369A1',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Grid Organizers -->
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#FFFFFF"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#BAE6FD"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#BAE6FD"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#FFFFFF"/>
      <circle cx="6.5" cy="6.5" r="1" fill="#0369A1"/>
      <circle cx="17.5" cy="17.5" r="1" fill="#0369A1"/>
    `
  },
  {
    slug: 'exam-essentials',
    title: 'Exam Kit',
    bg1: '#EA580C',
    bg2: '#C2410C',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Exam Checklist & Score -->
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#FFFFFF"/>
      <path d="M8 7L10 9L14 5" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="#CBD5E1" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="8" y1="17" x2="14" y2="17" stroke="#CBD5E1" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="16" cy="18" r="3.5" fill="#F59E0B"/>
      <path d="M15 18L16 19L17.5 17" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round"/>
    `
  },
  {
    slug: 'gift-sets-combos',
    title: 'Gift Sets',
    bg1: '#E11D48',
    bg2: '#BE123C',
    iconColor: '#FFFFFF',
    svgIcon: `
      <!-- Gift Box with Ribbon -->
      <rect x="3" y="9" width="18" height="12" rx="2" fill="#FFFFFF"/>
      <rect x="2" y="5" width="20" height="4" rx="1.5" fill="#FEE2E2"/>
      <line x1="12" y1="5" x2="12" y2="21" stroke="#E11D48" stroke-width="2.5"/>
      <path d="M12 5C10 2 6 2 6 4C6 6 12 5 12 5Z" fill="#FDE047"/>
      <path d="M12 5C14 2 18 2 18 4C18 6 12 5 12 5Z" fill="#FDE047"/>
    `
  }
];

function generateCategorySvg(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="grad-${item.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.bg1}" />
      <stop offset="100%" stop-color="${item.bg2}" />
    </linearGradient>
    <filter id="shadow-${item.slug}" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.15" />
    </filter>
  </defs>
  <!-- Background Rounded Canvas -->
  <rect width="100" height="100" rx="22" fill="url(#grad-${item.slug})" />
  
  <!-- Subtle stationery pattern dots in background -->
  <circle cx="20" cy="20" r="1.5" fill="#ffffff" fill-opacity="0.15" />
  <circle cx="80" cy="25" r="2" fill="#ffffff" fill-opacity="0.2" />
  <circle cx="25" cy="80" r="1.5" fill="#ffffff" fill-opacity="0.15" />
  <circle cx="75" cy="78" r="2.5" fill="#ffffff" fill-opacity="0.2" />
  
  <!-- Central Icon Badge -->
  <g transform="translate(26, 26) scale(2.0)" filter="url(#shadow-${item.slug})">
    ${item.svgIcon.trim()}
  </g>
</svg>`;
}

// Write Category SVGs
for (const cat of categoriesData) {
  const filePath = path.join(catDir, `${cat.slug}.svg`);
  fs.writeFileSync(filePath, generateCategorySvg(cat), 'utf-8');
  console.log(`✓ Generated: public/images/categories/${cat.slug}.svg`);
}

// Generate Product Placeholder SVG
const productPlaceholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgGrad)" />
  <g transform="translate(140, 130) scale(5)">
    <!-- Stationery Notebook and Pen Icon -->
    <rect x="3" y="3" width="14" height="18" rx="2" fill="#3B82F6" />
    <rect x="5" y="6" width="10" height="2" rx="1" fill="#FFFFFF" fill-opacity="0.9" />
    <rect x="5" y="10" width="10" height="2" rx="1" fill="#93C5FD" />
    <rect x="5" y="14" width="6" height="2" rx="1" fill="#93C5FD" />
    <path d="M16 17L21 2L23 4L18 19L16 17Z" fill="#F59E0B" />
    <polygon points="16,17 15,21 18,19" fill="#1D4ED8" />
  </g>
  <text x="200" y="290" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#475569">
    SmartStation Stationery
  </text>
  <text x="200" y="315" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="#94A3B8">
    100% Genuine Guaranteed
  </text>
</svg>`;
fs.writeFileSync(path.join(prodDir, 'stationery-placeholder.svg'), productPlaceholderSvg, 'utf-8');
console.log('✓ Generated: public/images/products/stationery-placeholder.svg');

// Generate Hero Visual Flatlay SVG
const heroFlatlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="notebookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="penGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" rx="32" fill="url(#deskGrad)" />
  
  <!-- Desk Grid Texture -->
  <g opacity="0.08">
    <path d="M0 100 H800 M0 200 H800 M0 300 H800 M0 400 H800 M0 500 H800" stroke="#FFFFFF" stroke-width="1.5"/>
    <path d="M100 0 V600 M200 0 V600 M300 0 V600 M400 0 V600 M500 0 V600 M600 0 V600 M700 0 V600" stroke="#FFFFFF" stroke-width="1.5"/>
  </g>
  
  <!-- A4 Notebook Center -->
  <g transform="translate(240, 110) rotate(-6)">
    <rect width="320" height="420" rx="16" fill="url(#notebookGrad)" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.5))" />
    <rect x="25" y="20" width="270" height="380" rx="8" fill="#FFFDF9" />
    <!-- Ruling lines -->
    <path d="M45 70 H275 M45 110 H275 M45 150 H275 M45 190 H275 M45 230 H275 M45 270 H275 M45 310 H275 M45 350 H275" stroke="#E2E8F0" stroke-width="2" />
    <line x1="85" y1="20" x2="85" y2="400" stroke="#FCA5A5" stroke-width="2" />
    <!-- Notebook Label -->
    <rect x="110" y="160" width="140" height="70" rx="8" fill="#1E293B" />
    <text x="180" y="195" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#F8FAFC" letter-spacing="2">SMARTSTATION</text>
    <text x="180" y="215" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#F59E0B">LECTURE NOTEBOOK A4</text>
  </g>
  
  <!-- Fountain Pen Resting on Right -->
  <g transform="translate(560, 260) rotate(32)">
    <rect width="24" height="260" rx="6" fill="url(#penGrad)" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))"/>
    <rect x="2" y="30" width="20" height="6" rx="2" fill="#FDE047"/>
    <path d="M4 260 L12 295 L20 260 Z" fill="#FDE047"/>
    <circle cx="12" cy="272" r="2" fill="#0284C7"/>
  </g>
  
  <!-- Pastel Highlighters Left -->
  <g transform="translate(90, 240) rotate(-22)">
    <rect width="36" height="140" rx="8" fill="#F472B6" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))"/>
    <rect x="6" y="140" width="24" height="30" rx="4" fill="#FDF2F8"/>
  </g>
  <g transform="translate(135, 270) rotate(-22)">
    <rect width="36" height="140" rx="8" fill="#A78BFA" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))"/>
    <rect x="6" y="140" width="24" height="30" rx="4" fill="#F5F3FF"/>
  </g>
  <g transform="translate(180, 300) rotate(-22)">
    <rect width="36" height="140" rx="8" fill="#34D399" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))"/>
    <rect x="6" y="140" width="24" height="30" rx="4" fill="#ECFDF5"/>
  </g>
  
  <!-- Paperclips Floating -->
  <g transform="translate(580, 100) rotate(45)">
    <rect width="20" height="50" rx="10" stroke="#FBBF24" stroke-width="4" fill="none"/>
  </g>
  <g transform="translate(120, 120) rotate(-15)">
    <rect width="18" height="42" rx="9" stroke="#38BDF8" stroke-width="3.5" fill="none"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(baseDir, 'hero-stationery.svg'), heroFlatlaySvg, 'utf-8');
console.log('✓ Generated: public/images/hero-stationery.svg');

console.log('\n🎉 All local SVG vector assets generated successfully!');
