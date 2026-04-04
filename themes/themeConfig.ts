import { theme, ThemeConfig } from 'antd';

/**
 * Get CSS variable value from :root
 * @param cssVariable - CSS variable name (e.g., '--primary' or 'primary')
 * @returns The CSS variable value or empty string if not found
 */
export const getCssVariable = (cssVariable: string): string => {
  if (typeof window === 'undefined') return '';

  // Ensure the variable starts with --
  const varName = cssVariable.startsWith('--') ? cssVariable : `--${cssVariable}`;

  // Get the computed style from the document root
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

  return value;
};

/**
 * Create theme configuration dynamically based on mode
 * This allows reading CSS variables at runtime
 */
export const createThemeConfig = (mode: 'light' | 'dark'): ThemeConfig => {
  // Read colors from CSS variables
  const primaryColor = getCssVariable('primary');
  const bgContainer = getCssVariable('--secondary');
  const textColor = getCssVariable('--antd-text');
  const primaryShadow = getCssVariable('--antd-button-primary-shadow');
  console.log('bgContainer',bgContainer)
  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
      colorBgContainer: bgContainer,
      colorText: textColor,
      borderRadius: 8,
      fontSize: 14,
    },
    components: {
      Typography:{
        
      },
      Button: {
        controlHeight: 42,
        fontWeight: 500,
        primaryShadow: primaryShadow,
      },
      Input: {
        controlHeight: 42,
      },
      Select: {
        controlHeight: 42,
      },
    },
  };
};

// Static theme configurations (fallback)
export const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#2563eb',
    colorBgContainer: '#ffffff',
    colorText: '#0f172a',
    borderRadius: 8,
    fontSize: 14,
  },
  components: {
    Button: {
      controlHeight: 42,
      fontWeight: 500,
      primaryShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
    },
    Input: {
      controlHeight: 42,
    },
    Select: {
      controlHeight: 42,
    },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#910a0a',
    colorBgContainer: '#1e293b',
    colorText: '#f1f5f9',
    borderRadius: 8,
    fontSize: 14,
  },
  components: {
    Button: {
      controlHeight: 42,
      fontWeight: 500,
      primaryShadow: '0 2px 4px rgba(145, 10, 10, 0.3)',
    },
    Input: {
      controlHeight: 42,
    },
    Select: {
      controlHeight: 42,
    },
  },
};
