export interface NightModeSettings {
  // 全局设置
  enabled: boolean;                // 是否全局启用夜间模式
  autoMode: 'off' | 'time' | 'system';  // 自动切换模式：关闭、基于时间、基于系统主题
  startTime: string;              // 自动开始时间 (HH:MM 格式)
  endTime: string;                // 自动结束时间 (HH:MM 格式)
  
  // 样式设置
  brightness: number;             // 亮度 (0-100)
  contrast: number;               // 对比度 (0-100)
  grayscale: number;              // 灰度 (0-100)
  sepia: number;                  // 褐色 (0-100)
  
  // 颜色设置
  backgroundColor: string;        // 背景色
  textColor: string;              // 文本色
  linkColor: string;              // 链接色
  
  // 站点特定设置
  siteSpecificSettings: Record<string, SiteSettings>;
  
  // 白名单/黑名单
  whitelistedSites: string[];     // 不应用夜间模式的网站
  blacklistedSites: string[];     // 总是应用夜间模式的网站
}

export interface SiteSettings {
  enabled: boolean;               // 是否启用夜间模式
  customCSS: string;              // 自定义CSS
  useGlobalSettings: boolean;     // 是否使用全局设置
  brightness?: number;            // 站点特定亮度
  contrast?: number;              // 站点特定对比度
  grayscale?: number;             // 站点特定灰度
  sepia?: number;                 // 站点特定褐色
  backgroundColor?: string;       // 站点特定背景色
  textColor?: string;             // 站点特定文本色
  linkColor?: string;             // 站点特定链接色
}

export interface Message {
  type: 'GET_SETTINGS' | 'SAVE_SETTINGS' | 'TOGGLE_NIGHT_MODE' | 'APPLY_NIGHT_MODE' | 'REMOVE_NIGHT_MODE';
  data?: any;
}

export const DEFAULT_SETTINGS: NightModeSettings = {
  enabled: false,
  autoMode: 'off',
  startTime: '20:00',
  endTime: '07:00',
  brightness: 90,
  contrast: 100,
  grayscale: 0,
  sepia: 0,
  backgroundColor: '#121212',
  textColor: '#e0e0e0',
  linkColor: '#bb86fc',
  siteSpecificSettings: {},
  whitelistedSites: [],
  blacklistedSites: []
}; 