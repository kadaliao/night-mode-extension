import React, { useEffect, useState } from 'react';
import { NightModeSettings } from '../types';

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

const Popup: React.FC = () => {
  const [settings, setSettings] = useState<NightModeSettings | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // 获取当前标签页的URL和设置
  useEffect(() => {
    const getCurrentTab = async () => {
      try {
        // 获取当前活动标签页
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0 && tabs[0].url) {
          setCurrentUrl(tabs[0].url);
          
          // 获取当前网站的设置
          const response = await chrome.runtime.sendMessage({ 
            type: 'GET_SETTINGS', 
            data: { url: tabs[0].url } 
          });
          
          if (response && response.settings) {
            setSettings(response.settings);
          }
        }
      } catch (error) {
        console.error('Error getting current tab or settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getCurrentTab();
  }, []);
  
  // 切换夜间模式
  const toggleNightMode = async () => {
    if (!settings) return;
    
    try {
      const response = await chrome.runtime.sendMessage({ type: 'TOGGLE_NIGHT_MODE' });
      if (response && response.success) {
        setSettings({ ...settings, enabled: response.enabled });
      }
    } catch (error) {
      console.error('Error toggling night mode:', error);
    }
  };
  
  // 更新设置
  const updateSettings = async (newSettings: NightModeSettings) => {
    try {
      const response = await chrome.runtime.sendMessage({ 
        type: 'SAVE_SETTINGS', 
        data: newSettings 
      });
      
      if (response && response.success) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };
  
  // 更新亮度
  const updateBrightness = (value: number) => {
    if (!settings) return;
    const newSettings = { ...settings, brightness: value };
    updateSettings(newSettings);
  };
  
  // 更新对比度
  const updateContrast = (value: number) => {
    if (!settings) return;
    const newSettings = { ...settings, contrast: value };
    updateSettings(newSettings);
  };
  
  // 打开设置页面
  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="p-4">
        <p className="text-red-500">无法加载设置。请重试。</p>
      </div>
    );
  }
  
  return (
    <div className={`p-4 min-h-[300px] ${settings.enabled ? 'dark bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">夜间模式</h1>
        <button 
          onClick={toggleNightMode}
          className={`relative inline-flex items-center h-6 rounded-full w-11 ${settings.enabled ? 'bg-purple-600' : 'bg-gray-200'}`}
        >
          <span className="sr-only">切换夜间模式</span>
          <span 
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.enabled ? 'translate-x-6' : 'translate-x-1'}`} 
          />
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">当前网站: {new URL(currentUrl).hostname}</p>
      </div>
      
      <div className="space-y-4">
        <Slider 
          label="亮度" 
          value={settings.brightness} 
          onChange={updateBrightness} 
          min={50} 
          max={100} 
        />
        
        <Slider 
          label="对比度" 
          value={settings.contrast} 
          onChange={updateContrast} 
          min={50} 
          max={150} 
        />
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={openOptionsPage}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
        >
          高级设置
        </button>
      </div>
    </div>
  );
};

export default Popup; 