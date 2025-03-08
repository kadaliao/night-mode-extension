export interface NightModeSettings {
  enabled: boolean;
  brightness: number;
  contrast: number;
  grayscale: number;
  sepia: number;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  autoMode: 'off' | 'time' | 'system';
  startTime?: string;
  endTime?: string;
}

export interface SiteSettings {
  url: string;
  enabled: boolean;
  whitelisted: boolean;
  blacklisted: boolean;
  customSettings?: Partial<NightModeSettings>;
}

export interface Message {
  type: string;
  data?: any;
}

export interface StorageData {
  globalSettings: NightModeSettings;
  siteSettings: SiteSettings[];
}

export type MessageResponse = {
  success: boolean;
  data?: any;
  error?: string;
};