export const MISSION_CLASSES = ["Project", "Financial", "Growth", "Creative", "Relationship", "Milestone", "Maintenance"] as const;
export type MissionClass = typeof MISSION_CLASSES[number];

export const MISSION_DIFFICULTIES = ["Routine", "Focused", "Advanced", "Epic", "Legacy"] as const;
export type MissionDifficulty = typeof MISSION_DIFFICULTIES[number];

export const MISSION_HEALTHS = ["Healthy", "Needs Attention", "At Risk", "Critical", "Dormant"] as const;
export type MissionHealth = typeof MISSION_HEALTHS[number];

export const MISSION_STATUSES = ["Planned", "Active", "Paused", "Completed", "Archived"] as const;
export type MissionStatus = typeof MISSION_STATUSES[number];

export const MISSION_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export type MissionPriority = typeof MISSION_PRIORITIES[number];

export const SECTORS = ["Work", "Finance", "Growth", "Creative", "Wellbeing", "Personal", "Relationships", "Archive"] as const;
export type Sector = typeof SECTORS[number];

export const FINANCIAL_WEATHERS = ["Clear", "Stable", "Caution", "Pressure", "Storm"] as const;
export type FinancialWeather = typeof FINANCIAL_WEATHERS[number];

export const FINANCIAL_HEALTHS = ["Thriving", "Steady", "Tight", "Strained", "Critical"] as const;
export type FinancialHealth = typeof FINANCIAL_HEALTHS[number];

export const AUDIO_CAPSULE_TYPES = ["Signal Log", "Memory Echo", "Future Transmission", "Mission Debrief", "Era Record", "Relationship Echo", "Event Chronicle"] as const;
export type AudioCapsuleType = typeof AUDIO_CAPSULE_TYPES[number];

export const HEALTH_COLOR: Record<MissionHealth, string> = {
  "Healthy": "text-primary",
  "Needs Attention": "text-chart-4",
  "At Risk": "text-chart-5",
  "Critical": "text-destructive",
  "Dormant": "text-muted-foreground",
};

export const WEATHER_GRADIENT: Record<FinancialWeather, string> = {
  Clear:    "from-cyan-400/40 to-blue-500/30",
  Stable:   "from-emerald-400/30 to-cyan-500/30",
  Caution:  "from-amber-400/30 to-orange-500/30",
  Pressure: "from-orange-500/40 to-rose-500/40",
  Storm:    "from-rose-600/50 to-violet-700/40",
};
