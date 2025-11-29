import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { Separator } from '@/components/ui/separator';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header 
      className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4"
      role="banner"
      data-testid="header"
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        {title && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium">{title}</span>
          </>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
