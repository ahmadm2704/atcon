export const PROJECT_CATEGORIES = [
  "Residential",
  "Commercial",
  "Military",
  "Mechanical Works",
  "PEB Buildings",
  "Highways",
  "Educational",
  "Sports",
  "Religious",
] as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

export const MEDIA_CATEGORIES = [
  "Education",
  "Residential",
  "Institutional",
  "Commercial",
  "Development",
  "Events",
  "YouTube Shorts",
  "Client Reviews"
] as const;

export type MediaCategory = typeof MEDIA_CATEGORIES[number];
