import { NightModeSettings, SiteSettings, StorageData } from '@/types';

// 默认设置
const defaultSettings: NightModeSettings = {
  enabled: false,
  brightness: 90,
  contrast: 100,
  grayscale: 0,
  sepia: 10,
  backgroundColor: '#1a1a1a',
  textColor: '#e6e6e6',
  linkColor: '#3391ff',
  autoMode: 'off',
};

// 获取存储的全局设置
export const getSettings = async (): Promise<NightModeSettings> => {
  try {
    const data = await chrome.storage.sync.get('globalSettings');
    return data.globalSettings || defaultSettings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return defaultSettings;
  }
};

// 保存全局设置
export const saveSettings = async (settings: NightModeSettings): Promise<boolean> => {
  try {
    await chrome.storage.sync.set({ globalSettings: settings });
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// 获取特定网站的设置
export const getSiteSettings = async (url: string): Promise<SiteSettings | null> => {
  try {
    const data = await chrome.storage.sync.get('siteSettings');
    const siteSettings: SiteSettings[] = data.siteSettings || [];
    const hostname = new URL(url).hostname;

    return siteSettings.find((site) => site.url === hostname) || null;
  } catch (error) {
    console.error('Error getting site settings:', error);
    return null;
  }
};

// 保存特定网站的设置
export const saveSiteSettings = async (siteSettings: SiteSettings): Promise<boolean> => {
  try {
    const data = await chrome.storage.sync.get('siteSettings');
    let sites: SiteSettings[] = data.siteSettings || [];

    // 检查是否已存在该网站的设置
    const index = sites.findIndex((site) => site.url === siteSettings.url);

    if (index !== -1) {
      // 更新现有设置
      sites[index] = siteSettings;
    } else {
      // 添加新设置
      sites.push(siteSettings);
    }

    await chrome.storage.sync.set({ siteSettings: sites });
    return true;
  } catch (error) {
    console.error('Error saving site settings:', error);
    return false;
  }
};

// 获取所有站点设置
export const getAllSiteSettings = async (): Promise<SiteSettings[]> => {
  try {
    const data = await chrome.storage.sync.get('siteSettings');
    return data.siteSettings || [];
  } catch (error) {
    console.error('Error getting all site settings:', error);
    return [];
  }
};

// 删除特定网站的设置
export const deleteSiteSettings = async (url: string): Promise<boolean> => {
  try {
    const data = await chrome.storage.sync.get('siteSettings');
    let sites: SiteSettings[] = data.siteSettings || [];

    // 过滤掉要删除的网站
    sites = sites.filter((site) => site.url !== url);

    await chrome.storage.sync.set({ siteSettings: sites });
    return true;
  } catch (error) {
    console.error('Error deleting site settings:', error);
    return false;
  }
};