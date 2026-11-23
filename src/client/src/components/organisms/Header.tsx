import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher';
import { Separator } from '@/components/ui/separator';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 flex h-12 items-center justify-between gap-4 border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 px-4 sm:px-6"
      data-testid="header"
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger data-testid="button-sidebar-toggle" className="text-muted-foreground hover:text-foreground" />
        {title && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
