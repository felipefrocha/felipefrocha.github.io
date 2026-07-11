import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { ThemeContext } from '@/hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';

function withTheme(theme: 'light' | 'dark', toggleTheme = vi.fn()) {
  return ({ children }: { children: ReactNode }) => (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: vi.fn() }}>{children}</ThemeContext.Provider>
  );
}

describe('ThemeToggle', () => {
  it('shows a sun icon and "switch to light" label in dark mode', () => {
    render(<ThemeToggle />, { wrapper: withTheme('dark') });
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('shows "switch to dark" label in light mode', () => {
    render(<ThemeToggle />, { wrapper: withTheme('light') });
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', async () => {
    const toggle = vi.fn();
    render(<ThemeToggle />, { wrapper: withTheme('light', toggle) });
    await userEvent.click(screen.getByTestId('button-theme-toggle'));
    expect(toggle).toHaveBeenCalledOnce();
  });
});
