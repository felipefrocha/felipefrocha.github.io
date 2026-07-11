import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

afterEach(async () => {
  vi.restoreAllMocks();
  await i18n.changeLanguage('en');
});

describe('LanguageSwitcher', () => {
  it('renders a language trigger button', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('Change language')).toBeInTheDocument();
  });

  it('opens the menu and lists native language names', async () => {
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('Português')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('changes the language when an item is selected', async () => {
    const spy = vi.spyOn(i18n, 'changeLanguage');
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByText('Español'));
    expect(spy).toHaveBeenCalledWith('es');
  });
});
