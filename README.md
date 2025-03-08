# 夜间模式 Chrome 扩展项目文档

## 项目概述

夜间模式扩展是一个 Chrome 浏览器扩展，可以为任何网站启用夜间模式，保护用户眼睛并提供更舒适的浏览体验。该扩展通过动态注入 CSS 样式实现夜间模式效果，特别适用于不原生支持夜间模式的网站。

## 已实现功能

### 核心功能
- **夜间模式切换**：一键切换当前网站的夜间/白天模式
- **自定义样式**：调整亮度、对比度、灰度、褐色等参数
- **颜色设置**：自定义背景色、文本色、链接色
- **网站管理**：设置白名单（不应用夜间模式）和黑名单（总是应用夜间模式）
- **自动模式**：基于时间或系统主题自动切换

### 用户界面
- **弹出窗口**：提供快速开关和基本设置
- **设置页面**：提供详细的设置选项和网站管理
- **实时预览**：直观显示样式调整效果

## 技术架构

### 技术栈
- **前端框架**：React + TypeScript
- **样式**：TailwindCSS
- **构建工具**：Vite + CRXJS
- **状态管理**：React Hooks
- **浏览器 API**：Chrome Extension API

### 主要文件结构

```
night-mode-extension/
├── src/                     # 源代码
│   ├── assets/              # 图标和资源
│   ├── background/          # 后台脚本
│   │   └── index.ts         # 后台服务处理逻辑
│   ├── content/             # 内容脚本
│   │   └── index.ts         # 网页内容处理逻辑
│   ├── options/             # 设置页面
│   │   ├── index.tsx        # 设置页面入口
│   │   └── Options.tsx      # 设置页面组件
│   ├── popup/               # 弹出窗口
│   │   ├── index.tsx        # 弹出窗口入口
│   │   └── Popup.tsx        # 弹出窗口组件
│   ├── types/               # 类型定义
│   │   └── index.ts         # 通用类型接口
│   ├── utils/               # 工具函数
│   │   ├── storage.ts       # 存储管理
│   │   └── styleGenerator.ts# 样式生成
│   └── index.css            # 全局样式
├── manifest.json            # 扩展清单
├── popup.html               # 弹出窗口HTML
└── options.html             # 设置页面HTML
```

## 核心功能模块

### 1. 夜间模式样式生成 (`src/utils/styleGenerator.ts`)
- `generateNightModeCSS(settings)`: 根据用户设置生成 CSS 样式
- `applyNightMode(settings)`: 将夜间模式样式应用到当前页面
- `removeNightMode()`: 移除夜间模式样式

### 2. 设置管理 (`src/utils/storage.ts`)
- `getSettings()`: 获取全局设置
- `saveSettings(settings)`: 保存全局设置
- `getSiteSettings(url)`: 获取特定网站的设置

### 3. 后台服务 (`src/background/index.ts`)
- 处理自动切换夜间模式（基于时间或系统主题）
- 处理消息传递
- 管理标签页状态

### 4. 内容脚本 (`src/content/index.ts`)
- 接收后台服务的消息
- 应用或移除夜间模式样式
- 使用 MutationObserver 监控 DOM 变化

### 5. 用户界面组件
- **弹出窗口** (`src/popup/Popup.tsx`): 提供快速设置和开关
- **设置页面** (`src/options/Options.tsx`): 提供详细的设置选项

## 常见问题及解决方案

### 样式冲突
- **问题**: 某些网站使用 !important 规则或特定的样式结构，导致夜间模式样式无法正确应用。
- **解决方案**: 
  - 在关键样式中使用 !important 规则
  - 使用高优先级选择器
  - 为特定网站添加自定义样式规则

### 内容分隔问题
- **问题**: 在夜间模式下，某些网站的内容分隔线可能变得不可见。
- **解决方案**:
  - 为内容块添加卡片效果（背景色、边框和圆角）
  - 增强分割线的可见性
  - 调整内容间距

### 图片处理
- **问题**: 某些图片在夜间模式下可能显示不清晰。
- **解决方案**:
  - 使用适当的亮度和对比度设置
  - 对于特定类型的图片（如图标），可以应用反色处理

## 使用指南

### 安装扩展

1. **从 Chrome 网上应用店安装**（待发布）
   - 访问 Chrome 网上应用店
   - 点击"添加到 Chrome"按钮
   - 确认安装

2. **开发者模式安装**
   - 打开 Chrome 浏览器，进入 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"，选择项目的 `dist` 目录

### 使用扩展

1. 点击浏览器工具栏中的扩展图标
2. 使用开关按钮切换当前网站的夜间模式
3. 调整亮度和对比度滑块
4. 点击"高级设置"按钮进入详细设置页面
5. 在设置页面中可以：
   - 设置自动切换模式
   - 自定义外观参数
   - 管理网站白名单/黑名单

## 隐私说明

此扩展不会收集或传输您的任何个人数据。所有设置都存储在您的本地浏览器中。

## 开发指南

### 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 开发模式：
   ```bash
   npm run dev
   ```

3. 构建扩展：
   ```bash
   npm run build
   ```

### 调试扩展

1. 调试后台脚本：
   - 在扩展管理页面点击"背景页"链接
   - 使用开发者工具进行调试

2. 调试内容脚本：
   - 在网页上右键点击，选择"检查"
   - 在开发者工具中找到已注入的样式

### 发布流程

1. 更新版本号：
   - 修改 `package.json` 和 `manifest.json` 中的版本号

2. 构建发布版本：
   ```bash
   npm run build
   ```

3. 压缩 `dist` 目录，准备上传到 Chrome Web Store

## 未来开发计划

### 性能优化
- 减少不必要的DOM操作
- 优化CSS选择器

### 增强兼容性
- 添加更多网站特定的优化规则
- 支持更多浏览器（Firefox、Edge等）

### 功能增强
- 支持自定义CSS规则
- 添加预设主题
- 添加快捷键支持

### 用户体验改进
- 添加导入/导出设置功能
- 提供更多视觉反馈

## 问题反馈

如有任何问题或建议，请在 GitHub 上提交 issue。

## 贡献指南

1. 创建新分支进行开发
2. 提交代码前运行测试和构建
3. 遵循项目的代码风格和命名约定
4. 提交详细的PR描述

## 许可证

MIT