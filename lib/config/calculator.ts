export interface CalcService {
  id: string;
  name: string;
  basePrice: number;
}

export const CALC_SERVICES: CalcService[] = [
  { id: "ig-reel", name: "IG Reel / Short", basePrice: 400 },
  { id: "yt-short", name: "YouTube Short", basePrice: 400 },
  { id: "tiktok", name: "TikTok Edit", basePrice: 400 },
  { id: "podcast", name: "Podcast Edit", basePrice: 700 },
  { id: "fast-paced", name: "Fast-Paced Reel", basePrice: 800 },
  { id: "gym-car", name: "Gym / Car Edit", basePrice: 800 },
  { id: "gaming", name: "Gaming Montage", basePrice: 800 },
  { id: "saas", name: "SaaS Animation", basePrice: 1500 },
  { id: "motion-graphics", name: "Motion Graphics", basePrice: 1500 },
  { id: "brand", name: "Brand / Product Showcase", basePrice: 1000 },
  { id: "case-study", name: "Case Study Edit", basePrice: 1000 },
  { id: "advertisement", name: "Advertisement", basePrice: 1800 },
];

export const CALC_TIERS = [
  { label: "Basic", multiplier: 1 },
  { label: "Advanced", multiplier: 1.8 },
];

export const CALC_LENGTHS = [
  { label: "Up to 30 sec", multiplier: 1 },
  { label: "30–60 sec", multiplier: 1.3 },
  { label: "60–120 sec", multiplier: 1.6 },
  { label: "120+ sec", multiplier: 2 },
];

export const RUSH_MULTIPLIER = 1.3;