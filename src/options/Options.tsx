import React, { useEffect, useState } from 'react';
import { NightModeSettings, DEFAULT_SETTINGS } from '../types';

// 颜色选择器组件
const ColorPicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="flex items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded border-0 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ml-2 px-2 py-1 w-24 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
        />
      </div>
    </div>
  );
};

// 滑块组件
const Slider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
}> = ({ value, onChange, min, max, label }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2"
      />
    </div>
  );
};

// 网站管理表格行组件
const SiteRow: React.FC<{
  site: string;
  onRemove: () => void;
}> = ({ site, onRemove }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="py-2 px-4">{site}</td>
      <td className="py-2 px-4 text-right">
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          删除
        </button>
      </td>
    </tr>
  );
};

const Options: React.FC = () => {
  const [settings, setSettings] = useState<NightModeSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [newSite, setNewSite] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('general');
  const [status, setStatus] = useState<string>('');
  
  // 获取设置
  useEffect(() => {
    const getSettings = async () => {
      try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
        if (response && response.settings) {
          setSettings(response.settings);
        }
      } catch (error) {
        console.error('Error getting settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSettings();
  }, []);
  
  // 保存设置
  const saveSettings = async (newSettings: NightModeSettings) => {
    try {
      const response = await chrome.runtime.sendMessage({ 
        type: 'SAVE_SETTINGS', 
        data: newSettings 
      });
      
      if (response && response.success) {
        setSettings(newSettings);
        setStatus('设置已保存！');
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setStatus('保存设置失败');
      setTimeout(() => setStatus(''), 3000);
    }
  };
  
  // 自动模式选择处理
  const handleAutoModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSettings = { 
      ...settings, 
      autoMode: e.target.value as 'off' | 'time' | 'system' 
    };
    saveSettings(newSettings);
  };
  
  // 时间设置处理
  const handleTimeChange = (type: 'startTime' | 'endTime', value: string) => {
    const newSettings = { ...settings, [type]: value };
    saveSettings(newSettings);
  };
  
  // 添加网站到白名单
  const addToWhitelist = () => {
    if (!newSite) return;
    
    try {
      // 验证并格式化URL
      const hostname = new URL(newSite.startsWith('http') ? newSite : `http://${newSite}`).hostname;
      
      if (!settings.whitelistedSites.includes(hostname)) {
        const newSettings = { 
          ...settings, 
          whitelistedSites: [...settings.whitelistedSites, hostname] 
        };
        saveSettings(newSettings);
        setNewSite('');
      }
    } catch (error) {
      setStatus('请输入有效的URL');
      setTimeout(() => setStatus(''), 3000);
    }
  };
  
  // 从白名单删除网站
  const removeFromWhitelist = (site: string) => {
    const newSettings = { 
      ...settings, 
      whitelistedSites: settings.whitelistedSites.filter(s => s !== site) 
    };
    saveSettings(newSettings);
  };
  
  // 添加网站到黑名单
  const addToBlacklist = () => {
    if (!newSite) return;
    
    try {
      // 验证并格式化URL
      const hostname = new URL(newSite.startsWith('http') ? newSite : `http://${newSite}`).hostname;
      
      if (!settings.blacklistedSites.includes(hostname)) {
        const newSettings = { 
          ...settings, 
          blacklistedSites: [...settings.blacklistedSites, hostname] 
        };
        saveSettings(newSettings);
        setNewSite('');
      }
    } catch (error) {
      setStatus('请输入有效的URL');
      setTimeout(() => setStatus(''), 3000);
    }
  };
  
  // 从黑名单删除网站
  const removeFromBlacklist = (site: string) => {
    const newSettings = { 
      ...settings, 
      blacklistedSites: settings.blacklistedSites.filter(s => s !== site) 
    };
    saveSettings(newSettings);
  };
  
  // 重置所有设置
  const resetSettings = () => {
    if (window.confirm('确定要重置所有设置吗？此操作无法撤销。')) {
      saveSettings(DEFAULT_SETTINGS);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }
  
  return (
    <div className={`container mx-auto px-4 py-8 ${settings.enabled ? 'dark bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-8 text-center">夜间模式设置</h1>
      
      {status && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-100 rounded">
          {status}
        </div>
      )}
      
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('general')}
          className={`py-2 px-4 ${activeTab === 'general' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          常规设置
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`py-2 px-4 ${activeTab === 'appearance' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          外观设置
        </button>
        <button
          onClick={() => setActiveTab('sites')}
          className={`py-2 px-4 ${activeTab === 'sites' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          网站管理
        </button>
      </div>
      
      {activeTab === 'general' && (
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-medium">启用夜间模式</label>
              <button 
                onClick={() => saveSettings({ ...settings, enabled: !settings.enabled })}
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${settings.enabled ? 'bg-purple-600' : 'bg-gray-200'}`}
              >
                <span className="sr-only">切换夜间模式</span>
                <span 
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.enabled ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">自动切换模式</label>
              <select
                value={settings.autoMode}
                onChange={handleAutoModeChange}
                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
              >
                <option value="off">手动（关闭自动切换）</option>
                <option value="time">基于时间</option>
                <option value="system">基于系统主题</option>
              </select>
            </div>
            
            {settings.autoMode === 'time' && (
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">开始时间</label>
                  <input
                    type="time"
                    value={settings.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">结束时间</label>
                  <input
                    type="time"
                    value={settings.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'appearance' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">样式设置</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Slider 
                label="亮度" 
                value={settings.brightness} 
                onChange={(value) => saveSettings({ ...settings, brightness: value })} 
                min={50} 
                max={100} 
              />
              
              <Slider 
                label="对比度" 
                value={settings.contrast} 
                onChange={(value) => saveSettings({ ...settings, contrast: value })} 
                min={50} 
                max={150} 
              />
              
              <Slider 
                label="灰度" 
                value={settings.grayscale} 
                onChange={(value) => saveSettings({ ...settings, grayscale: value })} 
                min={0} 
                max={100} 
              />
              
              <Slider 
                label="褐色" 
                value={settings.sepia} 
                onChange={(value) => saveSettings({ ...settings, sepia: value })} 
                min={0} 
                max={100} 
              />
            </div>
            
            <div>
              <ColorPicker 
                label="背景颜色" 
                value={settings.backgroundColor} 
                onChange={(value) => saveSettings({ ...settings, backgroundColor: value })} 
              />
              
              <ColorPicker 
                label="文本颜色" 
                value={settings.textColor} 
                onChange={(value) => saveSettings({ ...settings, textColor: value })} 
              />
              
              <ColorPicker 
                label="链接颜色" 
                value={settings.linkColor} 
                onChange={(value) => saveSettings({ ...settings, linkColor: value })} 
              />
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <h3 className="text-lg font-medium mb-2">预览</h3>
            <div 
              className="p-4 rounded" 
              style={{ 
                backgroundColor: settings.backgroundColor,
                color: settings.textColor
              }}
            >
              <p className="mb-2">这是夜间模式的文本预览。</p>
              <a href="#" style={{ color: settings.linkColor }}>这是链接的样式</a>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'sites' && (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">白名单网站</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">这些网站将不会应用夜间模式</p>
            
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="输入网站域名（例如：example.com）"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                className="flex-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l"
              />
              <button
                onClick={addToWhitelist}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-r"
              >
                添加
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-2 px-4 text-left">网站</th>
                    <th className="py-2 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.whitelistedSites.length === 0 ? (
                    <tr>
                      <td className="py-4 px-4 text-center text-gray-500 dark:text-gray-400" colSpan={2}>
                        白名单为空
                      </td>
                    </tr>
                  ) : (
                    settings.whitelistedSites.map((site) => (
                      <SiteRow key={site} site={site} onRemove={() => removeFromWhitelist(site)} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">黑名单网站</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">这些网站将始终应用夜间模式</p>
            
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="输入网站域名（例如：example.com）"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                className="flex-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l"
              />
              <button
                onClick={addToBlacklist}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-r"
              >
                添加
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-2 px-4 text-left">网站</th>
                    <th className="py-2 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.blacklistedSites.length === 0 ? (
                    <tr>
                      <td className="py-4 px-4 text-center text-gray-500 dark:text-gray-400" colSpan={2}>
                        黑名单为空
                      </td>
                    </tr>
                  ) : (
                    settings.blacklistedSites.map((site) => (
                      <SiteRow key={site} site={site} onRemove={() => removeFromBlacklist(site)} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <button 
          onClick={resetSettings}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          重置所有设置
        </button>
      </div>
    </div>
  );
};

export default Options; 