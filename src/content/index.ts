import { Message, NightModeSettings } from '../types';
import { applyNightMode, removeNightMode } from '../utils/styleGenerator';

// 监听来自 background 脚本的消息
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  switch (message.type) {
    case 'APPLY_NIGHT_MODE':
      applyNightMode(message.data as NightModeSettings);
      sendResponse({ success: true });
      break;
      
    case 'REMOVE_NIGHT_MODE':
      removeNightMode();
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
  
  return true; // 保持消息通道开放，以便异步响应
});

// 观察DOM变化，确保夜间模式持续应用
const setupMutationObserver = (settings: NightModeSettings) => {
  if (!settings.enabled) return;
  
  // 创建一个观察器实例
  const observer = new MutationObserver((mutations) => {
    // 检查是否有样式元素被删除
    const hasNightModeStyle = document.getElementById('night-mode-style');
    if (!hasNightModeStyle) {
      // 重新应用夜间模式
      applyNightMode(settings);
    }
    
    // 处理动态加载的内容
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 对于新添加的节点，可能需要额外处理
        // 例如对iframe或shadow DOM进行处理
      }
    });
  });
  
  // 配置观察选项
  const config = { 
    childList: true, 
    subtree: true 
  };
  
  // 开始观察
  observer.observe(document.body, config);
  
  return observer;
};

// 初始化
const initialize = async () => {
  // 请求当前页面的设置
  chrome.runtime.sendMessage(
    { type: 'GET_SETTINGS', data: { url: window.location.href } },
    (response: { settings: NightModeSettings }) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting settings:', chrome.runtime.lastError);
        return;
      }
      
      const settings = response.settings;
      
      // 应用夜间模式（如果已启用）
      if (settings.enabled) {
        applyNightMode(settings);
        
        // 设置DOM观察器
        setupMutationObserver(settings);
      }
    }
  );
};

// 当DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
} 