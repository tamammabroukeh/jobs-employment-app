import { ThemeConfig } from 'antd';

/**
 * Ant Design Theme Configuration for Light and Dark modes
 * Centralized theme tokens for consistent styling across all Ant Design components
 */

export const antdLightTheme: ThemeConfig = {
  token: {
    // Primary Colors
    colorPrimary: '#2563eb',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    
    // Background Colors
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorBgSpotlight: '#f1f5f9',
    
    // Text Colors
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    colorTextQuaternary: '#cbd5e1',
    colorTextDisabled: '#9ca3af',
    
    // Border Colors
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    
    // General
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  components: {
    // Pagination
    Pagination: {
      itemActiveBg: '#2563eb',
      itemBg: '#ffffff',
      itemLinkBg: '#ffffff',
      itemInputBg: '#ffffff',
      colorPrimary: '#2563eb',
      colorPrimaryHover: '#1d4ed8',
      colorText: '#0f172a',
      colorTextDisabled: '#9ca3af',
      colorBorder: '#e2e8f0',
    },
    
    // Button
    Button: {
      controlHeight: 42,
      fontWeight: 500,
      primaryShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
      colorPrimary: '#2563eb',
      colorPrimaryHover: '#1d4ed8',
    },
    
    // Input
    Input: {
      controlHeight: 42,
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorText: '#0f172a',
    },
    
    // Select
    Select: {
      controlHeight: 42,
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorText: '#0f172a',
    },
    
    // Card
    Card: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#e2e8f0',
    },
    
    // Modal
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#ffffff',
    },
    
    // Table
    Table: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#e2e8f0',
    },
  },
};

export const antdDarkTheme: ThemeConfig = {
  token: {
    // Primary Colors
    colorPrimary: '#3b82f6',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    
    // Background Colors
    colorBgContainer: '#1e293b',
    colorBgElevated: '#1e293b',
    colorBgLayout: '#0f172a',
    colorBgSpotlight: '#334155',
    
    // Text Colors
    colorText: '#f1f5f9',
    colorTextSecondary: '#94a3b8',
    colorTextTertiary: '#64748b',
    colorTextQuaternary: '#475569',
    colorTextDisabled: '#6b7280',
    
    // Border Colors
    colorBorder: '#334155',
    colorBorderSecondary: '#1e293b',
    
    // General
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
    boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  },
  components: {
    // Pagination
    Pagination: {
      itemActiveBg: '#3b82f6',
      itemBg: '#1e293b',
      itemLinkBg: '#1e293b',
      itemInputBg: '#1e293b',
      colorPrimary: '#3b82f6',
      colorPrimaryHover: '#60a5fa',
      colorText: '#f1f5f9',
      colorTextDisabled: '#6b7280',
      colorBorder: '#334155',
    },
    
    // Button
    Button: {
      controlHeight: 42,
      fontWeight: 500,
      primaryShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
      colorPrimary: '#3b82f6',
      colorPrimaryHover: '#60a5fa',
    },
    
    // Input
    Input: {
      controlHeight: 42,
      colorBgContainer: '#1e293b',
      colorBorder: '#334155',
      colorText: '#f1f5f9',
    },
    
    // Select
    Select: {
      controlHeight: 42,
      colorBgContainer: '#1e293b',
      colorBorder: '#334155',
      colorText: '#f1f5f9',
    },
    
    // Card
    Card: {
      colorBgContainer: '#1e293b',
      colorBorderSecondary: '#334155',
    },
    
    // Modal
    Modal: {
      contentBg: '#1e293b',
      headerBg: '#1e293b',
    },
    
    // Table
    Table: {
      colorBgContainer: '#1e293b',
      colorBorderSecondary: '#334155',
    },
  },
};

/**
 * Get Ant Design theme based on current theme mode
 * @param themeMode - 'light' or 'dark'
 * @returns ThemeConfig for Ant Design
 */
export const getAntdTheme = (themeMode: 'light' | 'dark'): ThemeConfig => {
  return themeMode === 'dark' ? antdDarkTheme : antdLightTheme;
};
