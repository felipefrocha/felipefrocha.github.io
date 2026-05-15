import { ThemeToggle } from '../atoms/ThemeToggle';
import { ThemeContext, useThemeProvider } from '@/hooks/useTheme';

export default function ThemeToggleExample() {
  const themeValue = useThemeProvider();
  
  return (
    <ThemeContext.Provider value={themeValue}>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm text-muted-foreground">Current: {themeValue.theme}</span>
      </div>
    </ThemeContext.Provider>
  );
}
