import { NightModeSettings } from '../types';

// 生成夜间模式的CSS样式
export const generateNightModeCSS = (settings: NightModeSettings): string => {
  if (!settings.enabled) {
    return ''; // 如果未启用夜间模式，返回空字符串
  }

  // 生成基本的夜间模式样式
  const css = `
    :root {
      --night-mode-background: ${settings.backgroundColor};
      --night-mode-text: ${settings.textColor};
      --night-mode-link: ${settings.linkColor};
    }
    
    html, body {
      background-color: var(--night-mode-background) !important;
      color: var(--night-mode-text) !important;
    }
    
    a, a:visited, a:hover, a:active {
      color: var(--night-mode-link) !important;
    }
    
    /* 处理常见的背景和文本颜色情况 */
    div, p, span, h1, h2, h3, h4, h5, h6, header, footer, nav, article, section, aside, main {
      background-color: transparent !important;
      color: var(--night-mode-text) !important;
    }
    
    /* 处理输入框 */
    input, textarea, select, button {
      background-color: #2a2a2a !important;
      color: var(--night-mode-text) !important;
      border-color: #444 !important;
    }
    
    /* 处理表格 */
    table, tr, td, th {
      background-color: transparent !important;
      color: var(--night-mode-text) !important;
      border-color: #444 !important;
    }
    
    /* 处理图片和视频，应用滤镜 */
    img, video, canvas, svg {
      filter: brightness(${settings.brightness}%) contrast(${settings.contrast}%)
              ${settings.grayscale > 0 ? `grayscale(${settings.grayscale}%)` : ''}
              ${settings.sepia > 0 ? `sepia(${settings.sepia}%)` : ''} !important;
    }
    
    /* 反色处理 */
    .night-mode-invert {
      filter: invert(100%) hue-rotate(180deg) !important;
    }
    
    /* 处理常见的深色背景和浅色文本组合 */
    [style*="background-color: rgb(255, 255, 255)"],
    [style*="background-color: white"],
    [style*="background-color: #fff"],
    [style*="background-color: #ffffff"],
    [style*="background: white"],
    [style*="background: #fff"],
    [style*="background: #ffffff"] {
      background-color: var(--night-mode-background) !important;
    }
    
    [style*="color: rgb(0, 0, 0)"],
    [style*="color: black"],
    [style*="color: #000"],
    [style*="color: #000000"] {
      color: var(--night-mode-text) !important;
    }
    
    /* 处理阴影 */
    * {
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    /* 增强分割线可见性 */
    hr, div[class*="divider"], div[class*="separator"], .border-bottom, 
    div[style*="border-bottom"], div[style*="border-top"], 
    div[class*="border-t"], div[class*="border-b"] {
      border-color: rgba(255, 255, 255, 0.2) !important;
      border-width: 1px !important;
      margin: 10px 0 !important;
      opacity: 1 !important;
    }
    
    /* 使用其他样式增强分割线 */
    hr {
      height: 1px !important;
      background-color: rgba(255, 255, 255, 0.15) !important;
      border-style: dashed !important;
    }
    
    /* 对特定分割线使用点线样式 */
    div[class*="divider"], div[class*="separator"] {
      border-style: dotted !important;
      border-width: 2px !important;
    }
    
    /* 为分割线添加微弱阴影效果 */
    hr, div[class*="divider"], div[class*="separator"] {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
    }
    
    /* 调整元素间距增强视觉区分 */
    section, article, .content-block, .section {
      margin-bottom: 20px !important;
      padding-bottom: 10px !important;
    }
    
    /* 豆瓣网站特定优化 */
    .section, .mod, .aside, .extra, .content, .article {
      margin-bottom: 15px !important;
    }
    
    /* 内容列表项样式 */
    .content .item, .topic-item, .comment-item, .reviews .item {
      padding: 5px !important;
      margin-bottom: 8px !important;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.15) !important;
    }
    
    /* 改善列表视觉层次 */
    ul, ol {
      padding-left: 20px !important;
    }
    
    li {
      margin-bottom: 5px !important;
    }
    
    /* 改善表格视觉效果 */
    table {
      border-collapse: separate !important;
      border-spacing: 0 4px !important;
    }
  `;

  return css;
};

// 生成内联样式标签
export const createStyleElement = (css: string): HTMLStyleElement => {
  const style = document.createElement('style');
  style.id = 'night-mode-style';
  style.textContent = css;
  return style;
};

// 应用夜间模式
export const applyNightMode = (settings: NightModeSettings): void => {
  // 移除现有的夜间模式样式（如果有）
  removeNightMode();
  
  if (!settings.enabled) {
    return;
  }
  
  // 生成并应用夜间模式样式
  const css = generateNightModeCSS(settings);
  const style = createStyleElement(css);
  document.head.appendChild(style);
  
  // 给 body 添加类，方便样式识别
  document.body.classList.add('night-mode-enabled');
};

// 移除夜间模式
export const removeNightMode = (): void => {
  const existingStyle = document.getElementById('night-mode-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  document.body.classList.remove('night-mode-enabled');
}; 