import { Message, NightModeSettings } from '../types';
import { getSettings, getSiteSettings, saveSettings } from '../utils/storage';

// 检查是否应该自动切换夜间模式
const checkAutoMode = async () => {
  const settings = await getSettings();
  
  if (settings.autoMode === 'off') {
    return;
  }
  
  if (settings.autoMode === 'time') {
    // 基于时间自动切换
    const now = new Date();
    
    const startTimeParts = settings.startTime.split(':');
    const endTimeParts = settings.endTime.split(':');
    
    const startTime = new Date();
    startTime.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]), 0);
    
    const endTime = new Date();
    endTime.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0);
    
    // 确定是否在夜间时段
    const isNightTime = endTime < startTime
      ? (now >= startTime || now < endTime) // 跨越午夜
      : (now >= startTime && now < endTime); // 同一天内
    
    if (isNightTime !== settings.enabled) {
      // 更新设置
      const newSettings = { ...settings, enabled: isNightTime };
      await saveSettings(newSettings);
      
      // 通知所有标签页更新
      updateAllTabs();
    }
  } else if (settings.autoMode === 'system') {
    // 基于系统主题自动切换
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode !== settings.enabled) {
      // 更新设置
      const newSettings = { ...settings, enabled: isDarkMode };
      await saveSettings(newSettings);
      
      // 通知所有标签页更新
      updateAllTabs();
    }
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async (e) => {
      const settings = await getSettings();
      if (settings.autoMode === 'system') {
        const newSettings = { ...settings, enabled: e.matches };
        await saveSettings(newSettings);
        
        // 通知所有标签页更新
        updateAllTabs();
      }
    });
  }
};

// 通知所有标签页更新夜间模式状态
const updateAllTabs = async () => {
  // 获取所有标签页
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(async (tab) => {
      if (tab.id && tab.url) {
        try {
          // 获取特定网站的设置
          const siteSettings = await getSiteSettings(tab.url);
          
          // 发送消息到内容脚本
          chrome.tabs.sendMessage(tab.id, {
            type: siteSettings.enabled ? 'APPLY_NIGHT_MODE' : 'REMOVE_NIGHT_MODE',
            data: siteSettings
          });
        } catch (error) {
          console.error(`Error updating tab ${tab.id}:`, error);
        }
      }
    });
  });
};

// 处理来自弹出窗口或内容脚本的消息
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case 'GET_SETTINGS':
          // 获取设置（全局或特定网站）
          if (message.data && message.data.url) {
            const siteSettings = await getSiteSettings(message.data.url);
            sendResponse({ settings: siteSettings });
          } else {
            const settings = await getSettings();
            sendResponse({ settings });
          }
          break;
          
        case 'SAVE_SETTINGS':
          // 保存设置
          await saveSettings(message.data as NightModeSettings);
          // 通知所有标签页更新
          updateAllTabs();
          sendResponse({ success: true });
          break;
          
        case 'TOGGLE_NIGHT_MODE':
          // 切换夜间模式状态
          const settings = await getSettings();
          const newSettings = { ...settings, enabled: !settings.enabled };
          await saveSettings(newSettings);
          // 通知所有标签页更新
          updateAllTabs();
          sendResponse({ success: true, enabled: newSettings.enabled });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      sendResponse({ success: false, error: String(error) });
    }
  })();
  
  return true; // 保持消息通道开放，以便异步响应
});

// 当安装或更新扩展时初始化
chrome.runtime.onInstalled.addListener(async () => {
  // 初始化设置（如果尚未设置）
  await getSettings();
  
  // 检查自动模式
  checkAutoMode();
  
  // 设置定期检查自动模式的计时器（每分钟检查一次）
  setInterval(checkAutoMode, 60000);
});

// 当标签页更新时应用夜间模式
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    try {
      // 获取特定网站的设置
      const siteSettings = await getSiteSettings(tab.url);
      
      // 发送消息到内容脚本
      chrome.tabs.sendMessage(tabId, {
        type: siteSettings.enabled ? 'APPLY_NIGHT_MODE' : 'REMOVE_NIGHT_MODE',
        data: siteSettings
      });
    } catch (error) {
      console.error(`Error updating tab ${tabId}:`, error);
    }
  }
}); 