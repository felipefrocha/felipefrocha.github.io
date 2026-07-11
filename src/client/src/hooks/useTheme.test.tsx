import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, useTheme, useThemeProvider } from './useTheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('useThemeProvider', () => {
  it('defaults to light when nothing is stored and system is not dark', () => {
    const { result } = renderHook(() => useThemeProvider());
    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('honors a stored theme preference', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useThemeProvider());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles between dark and light and syncs the document class', () => {
    const { result } = renderHook(() => useThemeProvider());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
  });

  it('sets an explicit theme', () => {
    const { result } = renderHook(() => useThemeProvider());
    act(() => result.current.setTheme('dark'));
    expect(result.current.theme).toBe('dark');
  });
});

describe('useTheme', () => {
  it('throws when used outside a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/);
  });

  it('returns the context value when provided', () => {
    const value = { theme: 'dark' as const, toggleTheme: () => {}, setTheme: () => {} };
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(ThemeContext.Provider, { value }, children);
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');
  });
});
