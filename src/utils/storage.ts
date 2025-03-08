import { NightModeSettings, DEFAULT_SETTINGS } from '../types';

// 获取所有设置
export const getSettings = async (): Promise<NightModeSettings> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['nightModeSettings'], (result) => {
      if (result.nightModeSettings) {
        resolve(result.nightModeSettings as NightModeSettings);
      } else {
        // 如果没有保存的设置，返回默认设置
        resolve(DEFAULT_SETTINGS);
      }
    });
  });
};

// 保存所有设置
export const saveSettings = async (settings: NightModeSettings): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ nightModeSettings: settings }, () => {
      resolve();
    });
  });
};

// 获取特定网站的设置
export const getSiteSettings = async (url: string): Promise<NightModeSettings> => {
  const settings = await getSettings();
  const hostname = new URL(url).hostname;
  
  // 检查是否在白名单中
  if (settings.whitelistedSites.includes(hostname)) {
    return { ...settings, enabled: false };
  }
  
  // 检查是否在黑名单中
  if (settings.blacklistedSites.includes(hostname)) {
    return { ...settings, enabled: true };
  }
  
  // 检查是否有特定站点设置
  if (hostname in settings.siteSpecificSettings) {
    const siteSettings = settings.siteSpecificSettings[hostname];
    
    if (!siteSettings.useGlobalSettings) {
      // 使用站点特定设置，但保留全局设置中未覆盖的部分
      return {
        ...settings,
        enabled: siteSettings.enabled,
        brightness: siteSettings.brightness ?? settings.brightness,
        contrast: siteSettings.contrast ?? settings.contrast,
        grayscale: siteSettings.grayscale ?? settings.grayscale,
        sepia: siteSettings.sepia ?? settings.sepia,
        backgroundColor: siteSettings.backgroundColor ?? settings.backgroundColor,
        textColor: siteSettings.textColor ?? settings.textColor,
        linkColor: siteSettings.linkColor ?? settings.linkColor,
      };
    }
  }
  
  // 使用全局设置
  return settings;
}; 