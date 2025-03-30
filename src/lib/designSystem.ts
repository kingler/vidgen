/**
 * Design System for AI MovieMaker
 * 
 * This file establishes a centralized design language for the application,
 * ensuring visual consistency and making styling changes easier to manage across
 * all components.
 */

// Main theme colors
export const themeColors = {
  // Primary UI background (custom gray)
  primary: {
    base: 'rgb(137, 137, 137)',
    // Various opacity levels for different UI elements
    opacity: {
      20: 'rgba(137, 137, 137, 0.2)',
      30: 'rgba(137, 137, 137, 0.3)',
      40: 'rgba(137, 137, 137, 0.4)',
      50: 'rgba(137, 137, 137, 0.5)',
      70: 'rgba(137, 137, 137, 0.7)'
    }
  },
  // Accent colors
  accent: {
    blue: 'rgb(59, 130, 246)', // Tailwind blue-600
    indigo: 'rgb(79, 70, 229)',
    purple: 'rgb(124, 58, 237)'
  },
  // Text colors
  text: {
    primary: 'rgb(255, 255, 255)',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)'
  }
};

// Glass morphic effect settings
export const glassMorphism = {
  // For browsers that support backdrop-filter
  supportedSettings: {
    standard: {
      background: themeColors.primary.opacity[30],
      blur: 'backdrop-blur-sm'
    },
    intense: {
      background: themeColors.primary.opacity[40],
      blur: 'backdrop-blur-md'
    }
  },
  // Fallbacks for browsers without backdrop-filter support
  fallbackSettings: {
    standard: {
      background: themeColors.primary.opacity[50]
    },
    intense: {
      background: themeColors.primary.opacity[70]
    }
  },
  // Border styles
  border: 'border border-white/10',
  // Shadow effects
  shadow: {
    standard: 'shadow-lg',
    intense: 'shadow-xl'
  }
};

// Common component styles
export const componentStyles = {
  // Container styles (rounded corners, padding, etc.)
  container: {
    rounded: 'rounded-xl',
    padding: {
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8'
    }
  },
  // Input field styles
  input: {
    base: 'w-full p-3 border border-white/30 rounded-md text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
    background: themeColors.primary.opacity[30]
  },
  // Button styles
  button: {
    base: 'px-6 py-2 rounded-md transition-colors focus:outline-none',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: `bg-${themeColors.primary.opacity[40]} text-white border border-white/20 hover:bg-${themeColors.primary.opacity[50]}`
  }
};

// Function to get the right glass morphic settings based on browser support and intensity
export const getGlassMorphicClasses = (
  supportsBackdropFilter: boolean,
  intense: boolean = false
): string => {
  const shadow = intense ? glassMorphism.shadow.intense : glassMorphism.shadow.standard;
  
  if (supportsBackdropFilter) {
    // Use backdrop blur for supported browsers
    const supportedSettings = intense ?
      glassMorphism.supportedSettings.intense :
      glassMorphism.supportedSettings.standard;
      
    return `${glassMorphism.border} ${shadow} ${supportedSettings.background} ${supportedSettings.blur}`;
  } else {
    // Use solid background fallback for non-supported browsers
    const fallbackSettings = intense ?
      glassMorphism.fallbackSettings.intense :
      glassMorphism.fallbackSettings.standard;
      
    return `${glassMorphism.border} ${shadow} ${fallbackSettings.background}`;
  }
};

/**
 * Usage example:
 * 
 * import { themeColors, glassMorphism, componentStyles, getGlassMorphicClasses } from '@/lib/designSystem';
 * 
 * // In a component:
 * const MyComponent = ({ intense = false }) => {
 *   const [supportsBlur, setSupportsBlur] = useState(false);
 *   
 *   useEffect(() => {
 *     setSupportsBlur(supportsCssBackdropFilter());
 *   }, []);
 *   
 *   const containerClasses = `${componentStyles.container.rounded} ${componentStyles.container.padding.medium} ${getGlassMorphicClasses(supportsBlur, intense)}`;
 *   
 *   return (
 *     <div className={containerClasses}>
 *       <input className={`${componentStyles.input.base} ${componentStyles.input.background}`} />
 *       <button className={`${componentStyles.button.base} ${componentStyles.button.primary}`}>Submit</button>
 *     </div>
 *   );
 * };
 */