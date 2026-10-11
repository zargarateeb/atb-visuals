export interface Addon {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export const ADDONS: Addon[] = [
  { id: "extra-revision", name: "Extra revision round", price: 200, description: "One additional round of edits" },
  { id: "custom-thumbnail", name: "Custom thumbnail", price: 150, description: "Designed thumbnail image" },
  { id: "motion-graphics", name: "Motion graphics package", price: 500, description: "Animated titles, lower thirds, transitions" },
  { id: "color-grading", name: "Cinematic color grading", price: 400, description: "Professional color correction" },
  { id: "sound-design", name: "Custom sound design", price: 350, description: "Bespoke SFX + music mixing" },
  { id: "subtitles", name: "Subtitles / captions", price: 250, description: "Burned-in or .srt captions" },
  { id: "multi-format", name: "Multi-format exports", price: 200, description: "9:16, 1:1, 16:9 versions" },
];