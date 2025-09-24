import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'react-vant'
import './index.css'
import 'lib-flexible'
import App from './App.tsx'

const themeVarsDark = {
  // Dark 主题配置

  // Rate 组件
  rateIconFullColor: '#ffd21e',

  // Slider 组件
  sliderBarHeight: '4px',
  sliderButtonWidth: '20px',
  sliderButtonHeight: '20px',
  sliderActiveBackgroundColor: '#4fc3f7',

  // Button 组件
  buttonPrimaryBorderColor: '#4fc3f7',
  buttonPrimaryBackgroundColor: '#4fc3f7',
  buttonDefaultColor: '#ffffff',
  buttonDefaultBorderColor: '#3a3a3c',
  buttonDefaultBackgroundColor: '#2c2c2e',

  // Tabbar 组件 (Dark 主题)
  tabbarBackgroundColor: 'rgba(28, 28, 30, 0.95)',
  tabbarItemActiveColor: '#4fc3f7',
  tabbarItemInactiveColor: '#8e8e93',
  tabbarActiveColor: '#4fc3f7',
  tabbarInactiveColor: '#8e8e93',
  tabbarTextColor: '#8e8e93',
  // 移除激活时的背景色变化
  tabbarItemActiveBackgroundColor: 'transparent',
  tabbarItemInactiveBackgroundColor: 'transparent',
  // Search 组件
  searchBackgroundColor: '#2c2c2e',
  searchPlaceholderColor: '#ffffff',
  searchTextColor: '#ffffff',
  searchContentBackgroundColor: '#2c2c2e',
  // input组件
  inputTextColor: '#ffffff',
  

  // 主色调 (Dark 主题)
  primaryColor: '#4fc3f7',
  successColor: '#34c759',
  warningColor: '#ff9f0a',
  dangerColor: '#ff453a',

  // 文本颜色 (Dark 主题)
  // textColor: '#ffffff',
  // textColor2: '#ebebf5',
  // textColor3: '#8e8e93',

  // 背景色 (Dark 主题)
  backgroundColor: '#000000',
  backgroundColor2: '#1c1c1e',

  // 边框色 (Dark 主题)
  borderColor: '#3a3a3c',

  // 字体大小
  // fontSizeSm: '12px',
  // fontSizeMd: '14px',
  // fontSizeLg: '16px',
}
const themeVars = {
  // Light 明亮主题配置

  // Rate 组件
  rateIconFullColor: '#ff6b35',

  // Slider 组件
  sliderBarHeight: '4px',
  sliderButtonWidth: '20px',
  sliderButtonHeight: '20px',
  sliderActiveBackgroundColor: '#ff6b35',

  // Button 组件
  buttonPrimaryBorderColor: '#ff6b35',
  buttonPrimaryBackgroundColor: '#ff6b35',
  buttonDefaultColor: '#333333',
  buttonDefaultBorderColor: '#e0e0e0',
  buttonDefaultBackgroundColor: '#ffffff',

  // Tabbar 组件 (Light 主题)
  tabbarBackgroundColor: 'rgba(255, 255, 255, 0.95)',
  tabbarItemActiveColor: '#ff6b35',
  tabbarItemInactiveColor: '#666666',
  tabbarActiveColor: '#ff6b35',
  tabbarInactiveColor: '#666666',
  tabbarTextColor: '#666666',
  // 移除激活时的背景色变化
  tabbarItemActiveBackgroundColor: 'transparent',
  tabbarItemInactiveBackgroundColor: 'transparent',
  
  // Search 组件
  searchBackgroundColor: '#f8f9fa',
  searchPlaceholderColor: '#999999',
  searchTextColor: '#333333',
  searchContentBackgroundColor: '#f3f3f3',
  
  // input组件
  inputTextColor: '#ffffff',
  

  // 主色调 (Light 主题)
  primaryColor: '#ff6b35',
  successColor: '#28a745',
  warningColor: '#ffc107',
  dangerColor: '#dc3545',

  // 背景色 (Light 主题)
  backgroundColor: '#333',
  backgroundColor2: '#f8f9fa',

  // 边框色 (Light 主题)
  borderColor: '#e0e0e0',
}

createRoot(document.getElementById('root')!).render(
  <Router>
   
    <ConfigProvider themeVars={themeVarsDark}>
   
       <App />
   
    </ConfigProvider>
  </Router>
)
