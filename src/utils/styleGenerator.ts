import { NightModeSettings } from '@/types';

// 夜间模式样式ID
const NIGHT_MODE_STYLE_ID = 'night-mode-extension-style';

// 生成夜间模式CSS
export const generateNightModeCSS = (settings: NightModeSettings): string => {
  const {
    brightness,
    contrast,
    grayscale,
    sepia,
    backgroundColor,
    textColor,
    linkColor,
  } = settings;

  return `
    html {
      filter: brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) !important;
    }
    
    body {
      background-color: ${backgroundColor} !important;
      color: ${textColor} !important;
    }
    
    a, a:visited {
      color: ${linkColor} !important;
    }
    
    /* 增强分隔线的可见性 */
    hr {
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    /* 为内容块添加卡片效果 */
    .card, .box, .panel, .container, article, section, aside, .content {
      background-color: rgba(30, 30, 30, 0.7) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 6px !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5) !important;
    }
    
    /* 修复图像处理 */
    img, svg, canvas, video {
      filter: brightness(90%) !important;
    }
    
    /* 调整按钮样式 */
    button, input[type="button"], input[type="submit"], .button, .btn {
      background-color: #333 !important;
      color: #eee !important;
      border: 1px solid #555 !important;
    }
    
    /* 调整输入框样式 */
    input, textarea, select {
      background-color: #222 !important;
      color: #eee !important;
      border: 1px solid #444 !important;
    }
    
    /* 调整表格样式 */
    table, th, td {
      border-color: #444 !important;
    }
    
    tr:nth-child(even) {
      background-color: rgba(40, 40, 40, 0.7) !important;
    }
  `;
};

// 应用夜间模式样式
export const applyNightMode = (settings: NightModeSettings): void => {
  // 移除已有的样式
  removeNightMode();

  // 创建样式元素
  const style = document.createElement('style');
  style.id = NIGHT_MODE_STYLE_ID;
  style.textContent = generateNightModeCSS(settings);

  // 添加到文档头部
  document.head.appendChild(style);
};

// 移除夜间模式样式
export const removeNightMode = (): void => {
  const existingStyle = document.getElementById(NIGHT_MODE_STYLE_ID);
  if (existingStyle) {
    existingStyle.remove();
  }
};

// 检查夜间模式是否已应用
export const isNightModeApplied = (): boolean => {
  return !!document.getElementById(NIGHT_MODE_STYLE_ID);
};

// 检查是否需要基于时间启用夜间模式
export const shouldEnableBasedOnTime = (settings: NightModeSettings): boolean => {
  if (settings.autoMode !== 'time' || !settings.startTime || !settings.endTime) {
    return false;
  }

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = settings.startTime.split(':').map(Number);
  const [endHour, endMinute] = settings.endTime.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  // 判断当前时间是否在启用时间范围内
  if (startTime < endTime) {
    // 普通情况：如 20:00 - 08:00
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    // 跨日情况：如 20:00 - 08:00
    return currentTime >= startTime || currentTime <= endTime;
  }
};

// 检查是否需要基于系统主题启用夜间模式
export const shouldEnableBasedOnSystem = (): boolean => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};